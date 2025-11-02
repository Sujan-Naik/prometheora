import { View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useAdmin } from "@/hooks/useAdmin";
import LoadingScreen from '@/components/LoadingScreen';
import { Text } from '@/components/ThemedText';

interface CreateBlogResponse {
  id: number;
  title: string;
  slug: string;
}

export default function CreateBlog() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const token = useRequireAuth();
  const { isAdmin } = useAdmin();

  const handleTitleChange = (text: string) => {
    setTitle(text);
    if (!slug) {
      setSlug(text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleCreate = async () => {
    if (!token) return;

    if (!title || !slug || !content) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await axios.post<CreateBlogResponse>(
        `${process.env.EXPO_PUBLIC_API_URL}/blogs`,
        { title, content, slug },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Success', 'Blog post created!');
      router.back();
    } catch (err) {
      console.error('Failed to create blog:', err);
      Alert.alert('Error', 'Failed to create blog post');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <View className="error-container">
        <Text className="error-text">
          You are not authorized to create blogs.
        </Text>
      </View>
    );
  }

  if (loading) {
    return <LoadingScreen message="Creating blog post..." />;
  }

  return (
    <View className="page-container">
      <ScrollView style={{ height: '100vh' as any }} contentContainerStyle={{alignItems: "center"}} className="basic-container">
        <View className="basic-container">
          <Text className="title">Create Blog Post</Text>

          <View className="input-container">
            <Text className="input-label">Title</Text>
            <TextInput
              placeholder="Enter blog title"
              value={title}
              onChangeText={handleTitleChange}
              className="input"
            />
          </View>

          <View className="input-container">
            <Text className="input-label">Slug (URL)</Text>
            <TextInput
              placeholder="blog-post-url"
              value={slug}
              onChangeText={setSlug}
              className="input"
            />
          </View>

          <View className="input-container">
            <Text className="input-label">Content</Text>
            <TextInput
              placeholder="Write your blog content..."
              value={content}
              onChangeText={setContent}
              multiline
              className="input-multiline input-tall"
            />
          </View>

          <TouchableOpacity
            onPress={handleCreate}
            disabled={loading}
            className={loading ? 'button button-disabled' : 'button'}
          >
            <Text className="button-text">
              {loading ? 'Creating...' : 'Publish Blog Post'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}