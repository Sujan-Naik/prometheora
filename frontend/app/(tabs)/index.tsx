// app/index.tsx
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useAuthStatus } from '@/hooks/useAuthStatus';
import PostCard from '@/components/PostCard';
import { IPost } from '@/types/prisma';
import '@/global.css';

export default function Home() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { isAuthenticated } = useAuthStatus();

  const fetchPosts = async () => {
    try {
      setError(null);
      const response = await axios.get<IPost[]>(`${process.env.EXPO_PUBLIC_API_URL}/posts`);
      setPosts(response.data);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Auth status loading
  if (isAuthenticated === null) {
    return (
      <ScrollView style={{ height: '100vh' as any }} className="container">
        <ActivityIndicator size="large" color="var(--primary)" />
        <Text className="loading-text">Loading...</Text>
      </ScrollView>
    );
  }

  // Not authenticated - Landing page
  if (!isAuthenticated) {
    return (
      <ScrollView style={{ height: '100vh' as any }} className="container">
        <View className="flex-1 items-center justify-center p-5">
          <Text className="text-5xl mb-2">🎨</Text>
          <Text className="text-3xl font-bold text-[var(--text-primary)] text-center mb-2">
            Creator Hub
          </Text>
          <Text className="text-base text-[var(--text-secondary)] text-center mb-10">
            Support creators, follow projects, and discover amazing content
          </Text>

          <TouchableOpacity
            onPress={() => router.push('/auth/signup')}
            className="button w-full max-w-[300px] mb-3"
          >
            <Text className="button-text">Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/auth/login')}
            className="button border-2 border-[var(--primary)] bg-transparent w-full max-w-[300px]"
          >
            <Text className="button-text text-[var(--primary)]">Sign In</Text>
          </TouchableOpacity>
        </View>

        {/* Public Posts Preview */}
        <View className="p-5 bg-[var(--secondary)]">
          <View style={{ paddingHorizontal: 8 }}>
            <Text className="text-xl font-bold mb-3 text-[var(--text-primary)]">
              Recent Posts
            </Text>
          </View>
          {loading ? (
            <ActivityIndicator size="small" color="var(--primary)" />
          ) : error ? (
            <Text className="text-[var(--text-secondary)] text-center">{error}</Text>
          ) : posts.length === 0 ? (
            <Text className="text-[var(--text-secondary)] text-center">No posts yet.</Text>
          ) : (
            <>
              {posts.slice(0, 3).map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
              <Text className="text-[var(--text-secondary)] text-center mt-3">
                Sign in to see more
              </Text>
            </>
          )}
        </View>
      </ScrollView>
    );
  }

  // Authenticated - Feed view
  return (
    <ScrollView style={{ height: '100vh' as any }} className="container">
      {/* Header */}
      <View className="p-5 pt-15 bg-[var(--primary)] rounded-b-2xl">
        <Text className="text-2xl font-bold text-white mb-1">Discover</Text>
        <Text className="text-sm text-white/80">Latest posts from creators you follow</Text>
      </View>

      {/* Navigation Quick Access */}
      <View className="flex-row p-4 gap-2 bg-[var(--background)] border-b border-[var(--border)]">
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/blog')}
          className="flex-1 bg-[var(--secondary)] p-3 rounded-lg items-center"
        >
          <Text className="text-xl mb-1">📰</Text>
          <Text className="text-xs text-[var(--text-secondary)] font-semibold">Blog</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/(tabs)/creator')}
          className="flex-1 bg-[var(--secondary)] p-3 rounded-lg items-center"
        >
          <Text className="text-xl mb-1">🎨</Text>
          <Text className="text-xs text-[var(--text-secondary)] font-semibold">Creators</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/(tabs)/patron')}
          className="flex-1 bg-[var(--secondary)] p-3 rounded-lg items-center"
        >
          <Text className="text-xl mb-1">💎</Text>
          <Text className="text-xs text-[var(--text-secondary)] font-semibold">Patronage</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/(tabs)/settings')}
          className="flex-1 bg-[var(--secondary)] p-3 rounded-lg items-center"
        >
          <Text className="text-xl mb-1">⚙️</Text>
          <Text className="text-xs text-[var(--text-secondary)] font-semibold">Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Posts Feed */}
      {loading && posts.length === 0 ? (
        <View className="container items-center justify-center">
          <ActivityIndicator size="large" color="var(--primary)" />
          <Text className="loading-text">Loading posts...</Text>
        </View>
      ) : error ? (
        <View className="container items-center justify-center">
          <Text className="error-text">{error}</Text>
          <TouchableOpacity onPress={fetchPosts} className="button mt-4">
            <Text className="button-text">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ padding: 16 }}>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </View>
      )}
    </ScrollView>
  );
}