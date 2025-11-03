import { View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useMyProjects } from '@/hooks/useMyProjects';
import { IPost } from '@/types/prisma';
import PickMedia from '@/components/PickMedia';
import DisplayMedia from '@/components/DisplayMedia';
import { MediaRecord } from '@/utils/mediaUtils';
import LoadingScreen from '@/components/LoadingScreen';
import { Text } from '@/components/ThemedText';

export default function CreatePost() {
  const { projects, loading: projectsLoading } = useMyProjects();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [quotedProjectId, setQuotedProjectId] = useState<number | null>(null);
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
      const response = await axios.post<IPost>(
        `${process.env.EXPO_PUBLIC_API_URL}/posts`,
        {
          title,
          content,
          isPaid,
          quotedProjectId: quotedProjectId || undefined,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const postId = response.data.id;

      if (media.length > 0) {
        await Promise.all(
          media.map((m, index) =>
            axios.put(
              `${process.env.EXPO_PUBLIC_API_URL}/media/${m.id}`,
              { order: index, postId },
              { headers: { Authorization: `Bearer ${token}` } }
            )
          )
        );
      }

      Alert.alert('Success', 'Post created successfully!');
      router.back();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  if (loading || projectsLoading) {
    return <LoadingScreen message={loading ? "Creating post..." : "Loading..."} />;
  }

  return (
    <View className="page-container">
      <ScrollView style={{ height: '100vh' as any}} className="basic-container">
        <View style={{width: '100%'}}  className="basic-container">
          <Text className="title">Create Post</Text>

          <View className="input-container">
            <Text className="input-label">Title</Text>
            <TextInput
              placeholder="Post Title"
              value={title}
              onChangeText={setTitle}
              className="input"
            />
          </View>

          <View className="input-container">
            <Text className="input-label">Content</Text>
            <TextInput
              placeholder="What's on your mind?"
              value={content}
              onChangeText={setContent}
              multiline
              className="input-multiline input-tall"
            />
          </View>

          <View className="input-container">
            <Text className="input-label">Quote a Project (optional)</Text>
            <View className="picker-container">
              <Picker
                selectedValue={quotedProjectId}
                onValueChange={(value) => setQuotedProjectId(value)}
                style={{backgroundColor: 'inherit', color: 'var(--text-color)'}}
              >
                <Picker.Item label="None" value={null} />
                {projects.map(project => (
                  <Picker.Item key={project.id} label={project.title} value={project.id} />
                ))}
              </Picker>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => setIsPaid(!isPaid)}
            className={isPaid ? 'button' : 'button-secondary'}
          >
            <Text className={isPaid ? 'button-text' : 'button-secondary-text'}>
              {isPaid ? '💰 Paid Post' : '🆓 Free Post'}
            </Text>
          </TouchableOpacity>

          <View className="input-container">
            <Text className="input-label">Media</Text>
            <PickMedia
              onMediaUploaded={handleMediaUploaded}
              onMediaDeleted={handleMediaDeleted}
              buttonText="Add Photo/Video"
            />

            {media.map((item) => (
              <DisplayMedia key={item.id} media={item} showCaption={false} />
            ))}
          </View>

          <TouchableOpacity className="button" onPress={handleCreate}>
            <Text className="button-text">Publish Post</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}