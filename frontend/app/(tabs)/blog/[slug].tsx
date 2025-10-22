import { View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { IBlog } from "@/types/prisma";
import LoadingScreen from '@/components/LoadingScreen';

export default function BlogPostDetail() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [post, setPost] = useState<IBlog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError('No slug provided');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    axios
      .get<IBlog>(`${process.env.EXPO_PUBLIC_API_URL}/blogs/${slug}`)
      .then(res => {
        setPost(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Failed to load blog post');
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <View className="error-container">
        <Text className="error-text">{error}</Text>
      </View>
    );
  }

  if (!post) {
    return (
      <View className="error-container">
        <Text className="not-found-text">Blog post not found</Text>
      </View>
    );
  }

  return(
  <View className="page-container">
      <ScrollView style={{ height: '100vh' as any }} contentContainerStyle={{alignItems: "center"}} className="basic-container">
        <View className="basic-container">
          <Text className="blog-title">{post.title}</Text>
          <Text className="date-text">
            {new Date(post.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Text>
          <Text className="blog-content">{post.content}</Text>
        </View>
      </ScrollView>
    </View>
  );
}