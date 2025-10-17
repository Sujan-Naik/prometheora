// app/(tabs)/blog/[slug].tsx
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { IBlog } from "@/types/prisma";

export default function BlogPostDetail() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [post, setPost] = useState<IBlog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Fetching blog post with slug:', slug);

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
        console.log('Blog post fetched:', res.data);
        setPost(res.data);
      })
      .catch(err => {
        console.error('Error fetching blog post:', err);
        setError(err.response?.data?.message || 'Failed to load blog post');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <View className="loading-container">
        <ActivityIndicator size="large" color="#007AFF" />
        <Text className="loading-text">Loading...</Text>
      </View>
    );
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
      <View className="loading-container">
        <Text className="not-found-text">Blog post not found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="container">
      <Text className="blog-title">{post.title}</Text>
      <Text className="date-text">
        {new Date(post.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </Text>
      <Text className="blog-content">{post.content}</Text>
    </ScrollView>
  );
}