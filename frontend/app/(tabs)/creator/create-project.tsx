import { View, TextInput, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { IProject, Visibility } from '@/types/prisma';
import PickMedia from '@/components/PickMedia';
import DisplayMedia from '@/components/DisplayMedia';
import { MediaRecord } from '@/utils/mediaUtils';
import LoadingScreen from '@/components/LoadingScreen';

export default function CreateProject() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [status, setStatus] = useState('');
  const [visibility, setVisibility] = useState<Visibility>(Visibility.PATRON_ONLY);
  const [media, setMedia] = useState<MediaRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const token = useRequireAuth();

  const handleMediaUploaded = (newMedia: MediaRecord) => {
    setMedia(prev => [...prev, newMedia]);
  };

  const handleMediaDeleted = (id: number) => {
    setMedia(prev => prev.filter(m => m.id !== id));
  };

  const handleCreate = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const response = await axios.post<IProject>(
        `${process.env.EXPO_PUBLIC_API_URL}/projects`,
        {
          title,
          description,
          repoUrl: repoUrl || undefined,
          demoUrl: demoUrl || undefined,
          status: status || undefined,
          visibility,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const projectId = response.data.id;

      if (media.length > 0) {
        await Promise.all(
          media.map((m, index) =>
            axios.put(
              `${process.env.EXPO_PUBLIC_API_URL}/media/${m.id}`,
              { order: index, projectId },
              { headers: { Authorization: `Bearer ${token}` } },
            ),
          ),
        );
      }

      Alert.alert('Success', 'Project created successfully!');
      router.back();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen message="Creating project..." />;
  }

  return (
    <View className="page-container">
      <ScrollView style={{ height: '100vh' as any }} className="basic-container">
        <View style={{width: '100vw' as any}} className="basic-container">
          <Text className="title">Create Project</Text>

          <View className="input-container">
            <Text className="input-label">Project Title</Text>
            <TextInput
              placeholder="Project Title"
              value={title}
              onChangeText={setTitle}
              className="input"
            />
          </View>

          <View className="input-container">
            <Text className="input-label">Description</Text>
            <TextInput
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              multiline
              className="input-multiline input-tall"
            />
          </View>

          <View className="input-container">
            <Text className="input-label">Repository URL (optional)</Text>
            <TextInput
              placeholder="Repository URL"
              value={repoUrl}
              onChangeText={setRepoUrl}
              className="input"
            />
          </View>

          <View className="input-container">
            <Text className="input-label">Demo URL (optional)</Text>
            <TextInput
              placeholder="Demo URL"
              value={demoUrl}
              onChangeText={setDemoUrl}
              className="input"
            />
          </View>

          <View className="input-container">
            <Text className="input-label">Status</Text>
            <TextInput
              placeholder="e.g., In Progress, Completed"
              value={status}
              onChangeText={setStatus}
              className="input"
            />
          </View>

          <View className="input-container">
            <Text className="input-label">Visibility</Text>
            <View className="picker-container">
              <Picker
                selectedValue={visibility}
                onValueChange={itemValue => setVisibility(itemValue as Visibility)}
              >
                <Picker.Item label="Public" value={Visibility.PUBLIC} />
                <Picker.Item label="Patron Only" value={Visibility.PATRON_ONLY} />
                <Picker.Item label="Follower Only" value={Visibility.FOLLOWER_ONLY} />
                <Picker.Item label="Private" value={Visibility.PRIVATE} />
              </Picker>
            </View>
          </View>

          <View className="input-container">
            <Text className="input-label">Media</Text>
            <PickMedia
              onMediaUploaded={handleMediaUploaded}
              onMediaDeleted={handleMediaDeleted}
              buttonText="Add Photo/Video"
            />

            {media.map(item => (
              <DisplayMedia key={item.id} media={item} showCaption={false} />
            ))}
          </View>

          <TouchableOpacity className="button" onPress={handleCreate}>
            <Text className="button-text">Create Project</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}