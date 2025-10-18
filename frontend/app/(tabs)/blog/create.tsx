// app/(tabs)/blog/create.tsx
import { View, TextInput, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useAdmin } from "@/hooks/useAdmin";
import '../../../global.css';

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

  // Auto-generate slug from title
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
      <View className="container items-center justify-center">
        <Text className="error-text">
          You are not authorized to create blogs.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="container" style={{ height: '100vh' as any }}>
      <Text className="title">Create Blog Post</Text>

      <View className="mb-4">
        <Text className="section-title">Title</Text>
        <TextInput
          placeholder="Enter blog title"
          value={title}
          onChangeText={handleTitleChange}
          className="input"
        />
      </View>

      <View className="mb-4">
        <Text className="section-title">Slug (URL)</Text>
        <TextInput
          placeholder="blog-post-url"
          value={slug}
          onChangeText={setSlug}
          className="input"
        />
      </View>

      <View className="mb-4">
        <Text className="section-title">Content</Text>
        <TextInput
          placeholder="Write your blog content..."
          value={content}
          onChangeText={setContent}
          multiline
          className="input h-40"
        />
      </View>

      <TouchableOpacity
        onPress={handleCreate}
        disabled={loading}
        className={loading ? 'button opacity-60' : 'button'}
      >
        <Text className="button-text">
          {loading ? 'Creating...' : 'Publish Blog Post'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}