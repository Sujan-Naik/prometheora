// app/creator/create-project.tsx
import { View, TextInput, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { IProject, Visibility } from "@/types/prisma";
import PickMedia from '@/components/PickMedia';
import DisplayMedia from '@/components/DisplayMedia';
import { MediaRecord } from '@/utils/mediaUtils';

export default function CreateProject() {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [repoUrl, setRepoUrl] = useState<string>('');
  const [demoUrl, setDemoUrl] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [visibility, setVisibility] = useState<Visibility>(Visibility.PATRON_ONLY);
  const [media, setMedia] = useState<MediaRecord[]>([]);
  const [tempProjectId, setTempProjectId] = useState<number | null>(null);
  const router = useRouter();
  const token = useRequireAuth();

  const handleMediaUploaded = (newMedia: MediaRecord) => {
    setMedia([...media, newMedia]);
  };

  const handleCreate = async () => {
    if (!token) {
      return;
    }

    try {
      const response = await axios.post<IProject>(
        `${process.env.EXPO_PUBLIC_API_URL}/projects`,
        {
          title,
          description,
          repoUrl: repoUrl || undefined,
          demoUrl: demoUrl || undefined,
          status: status || undefined,
          visibility
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const projectId = response.data.id;

      // Link all uploaded media to the project
      if (media.length > 0) {
        await Promise.all(
          media.map((m, index) =>
            axios.put(
              `${process.env.EXPO_PUBLIC_API_URL}/media/${m.id}`,
              { order: index },
              { headers: { Authorization: `Bearer ${token}` } }
            )
          )
        );
      }

      Alert.alert('Success', 'Project created successfully!');
      router.back();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to create project');
    }
  };

  return (
    <ScrollView className="container">
      <Text className="title">Create Project</Text>

      <View className="section">
        <TextInput
          placeholder="Project Title"
          value={title}
          onChangeText={setTitle}
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            borderRadius: 8,
            marginBottom: 10
          }}
        />

        <TextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            borderRadius: 8,
            minHeight: 100,
            textAlignVertical: 'top',
            marginBottom: 10
          }}
        />

        <TextInput
          placeholder="Repository URL (optional)"
          value={repoUrl}
          onChangeText={setRepoUrl}
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            borderRadius: 8,
            marginBottom: 10
          }}
        />

        <TextInput
          placeholder="Demo URL (optional)"
          value={demoUrl}
          onChangeText={setDemoUrl}
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            borderRadius: 8,
            marginBottom: 10
          }}
        />

        <TextInput
          placeholder="Status (e.g., In Progress, Completed)"
          value={status}
          onChangeText={setStatus}
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            borderRadius: 8,
            marginBottom: 10
          }}
        />

        <Text style={{ marginBottom: 5, fontWeight: '600' }}>Visibility</Text>
        <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 10 }}>
          <Picker
            selectedValue={visibility}
            onValueChange={(itemValue) => setVisibility(itemValue as Visibility)}
          >
            <Picker.Item label="Public" value={Visibility.PUBLIC} />
            <Picker.Item label="Patron Only" value={Visibility.PATRON_ONLY} />
            <Picker.Item label="Follower Only" value={Visibility.FOLLOWER_ONLY} />
            <Picker.Item label="Private" value={Visibility.PRIVATE} />
          </Picker>
        </View>
      </View>

      <View className="section">
        <Text className="section-title">Media</Text>
        <PickMedia
          onMediaUploaded={handleMediaUploaded}
          buttonText="Add Photo/Video"
        />

        {media.map((item) => (
          <DisplayMedia
            key={item.id}
            media={item}
            showCaption={false}
          />
        ))}
      </View>

      <TouchableOpacity
        className="button"
        onPress={handleCreate}
      >
        <Text className="button-text">Create Project</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}