import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useAuthStatus } from '@/hooks/useAuthStatus';
import PostCard from '@/components/PostCard';
import { IPost } from '@/types/prisma';
import LoadingScreen from '@/components/LoadingScreen';
import '@/global.css'
import LogoutButton from "@/components/Logout";

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
  if (isAuthenticated === null) {
    return <LoadingScreen />;
  }
  // Show loading screen for initial load when authenticated
  if (isAuthenticated && loading && posts.length === 0) {
    return <LoadingScreen message="Loading posts..." />;
  }
  if (!isAuthenticated) {
    return (
      <View style={{ flex: 1}}>
        <ScrollView style={{ height: '100vh' as any }} contentContainerStyle={{alignItems: "center"}} className="basic-container">
          <View className="landing-container">
            <Text className="landing-icon">🎨</Text>
            <Text className="landing-title">Creator Hub</Text>
            <Text className="landing-subtitle">
              Support creators, follow projects, and discover amazing content
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/auth/signup')}
              className="button"
            >
              <Text className="button-text">Get Started</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/auth/login')}
              className="button-secondary"
            >
              <Text className="button-secondary-text">Sign In</Text>
            </TouchableOpacity>
          </View>
          <View className="basic-container w">
            <Text className="section-title">Recent Posts</Text>
            {loading ? (
              <LoadingScreen />
            ) : error ? (
              <Text className="error-text">{error}</Text>
            ) : posts.length === 0 ? (
              <Text className="subtitle">No posts yet.</Text>
            ) : (
              <>
                {posts.slice(0, 3).map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
                <Text className="subtitle">Sign in to see more</Text>
              </>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
  return (
    <View style={{ flex: 1}}>
      <View className="header">
        <Text className="header-title">Discover</Text>
        <Text className="header-subtitle">Latest posts from creators you follow</Text>
      </View>
      <ScrollView style={{ height: '100vh' as any}} className="basic-container">
        <View className="nav-card-container">
          <TouchableOpacity onPress={() => router.push('/(tabs)/blog')} className="nav-card">
            <Text className="nav-card-icon">📰</Text>
            <Text className="nav-card-text">Blog</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(tabs)/creator')} className="nav-card">
            <Text className="nav-card-icon">🎨</Text>
            <Text className="nav-card-text">Creators</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(tabs)/patron')} className="nav-card">
            <Text className="nav-card-icon">💎</Text>
            <Text className="nav-card-text">Patronage</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(tabs)/settings')} className="nav-card">
            <Text className="nav-card-icon">⚙️</Text>
            <Text className="nav-card-text">Settings</Text>
          </TouchableOpacity>
        </View>
        {error ? (
          <View className="error-container">
            <Text className="error-text">{error}</Text>
            <TouchableOpacity onPress={fetchPosts} className="button">
              <Text className="button-text">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="basic-container">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}