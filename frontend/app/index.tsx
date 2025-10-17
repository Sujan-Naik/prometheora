// app/index.tsx
import { View, Text, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useAuthStatus } from '@/hooks/useAuthStatus';
import PostCard from "@/components/PostCard";
import { IPost } from "@/types/prisma";
import '../global.css';

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

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  // Auth status loading
  if (isAuthenticated === null) {
    return (
      <View className="loading-container">
        <ActivityIndicator size="large" color="#007AFF" />
        <Text className="loading-text">Loading...</Text>
      </View>
    );
  }

  // Not authenticated - Landing page
  if (!isAuthenticated) {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 48, marginBottom: 8 }}>🎨</Text>
          <Text style={{ fontSize: 32, fontWeight: '700', color: '#000', textAlign: 'center', marginBottom: 8 }}>
            Creator Hub
          </Text>
          <Text style={{ fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 40 }}>
            Support creators, follow projects, and discover amazing content
          </Text>

          <TouchableOpacity
            onPress={() => router.push('/auth/signup')}
            style={{
              backgroundColor: '#007aff',
              paddingHorizontal: 40,
              paddingVertical: 16,
              borderRadius: 12,
              width: '100%',
              maxWidth: 300,
              marginBottom: 12,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600', textAlign: 'center' }}>
              Get Started
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/auth/login')}
            style={{
              backgroundColor: '#fff',
              borderWidth: 2,
              borderColor: '#007aff',
              paddingHorizontal: 40,
              paddingVertical: 16,
              borderRadius: 12,
              width: '100%',
              maxWidth: 300,
            }}
          >
            <Text style={{ color: '#007aff', fontSize: 18, fontWeight: '600', textAlign: 'center' }}>
              Sign In
            </Text>
          </TouchableOpacity>
        </View>

        {/* Public Posts Preview */}
        <View style={{ padding: 20, backgroundColor: '#f5f5f5' }}>
          <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 12, color: '#000' }}>
            Recent Posts
          </Text>
          {loading ? (
            <ActivityIndicator size="small" color="#007AFF" />
          ) : error ? (
            <Text style={{ color: '#666', textAlign: 'center' }}>{error}</Text>
          ) : posts.length === 0 ? (
            <Text style={{ color: '#666', textAlign: 'center' }}>No posts yet.</Text>
          ) : (
            <>
              {posts.slice(0, 3).map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
              <Text style={{ color: '#666', textAlign: 'center', marginTop: 12 }}>
                Sign in to see more
              </Text>
            </>
          )}
        </View>
      </View>
    );
  }

  // Authenticated - Feed view
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <View style={{
        padding: 20,
        paddingTop: 60,
        backgroundColor: '#007aff',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
      }}>
        <Text style={{ fontSize: 28, fontWeight: '700', color: '#fff', marginBottom: 4 }}>
          Discover
        </Text>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
          Latest posts from creators you follow
        </Text>
      </View>

      {/* Navigation Quick Access */}
      <View style={{
        flexDirection: 'row',
        padding: 16,
        gap: 8,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
      }}>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/blog')}
          style={{
            flex: 1,
            backgroundColor: '#f5f5f5',
            padding: 12,
            borderRadius: 8,
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 20, marginBottom: 4 }}>📰</Text>
          <Text style={{ fontSize: 12, color: '#666', fontWeight: '600' }}>Blog</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/(tabs)/creator')}
          style={{
            flex: 1,
            backgroundColor: '#f5f5f5',
            padding: 12,
            borderRadius: 8,
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 20, marginBottom: 4 }}>🎨</Text>
          <Text style={{ fontSize: 12, color: '#666', fontWeight: '600' }}>Creators</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/(tabs)/patron')}
          style={{
            flex: 1,
            backgroundColor: '#f5f5f5',
            padding: 12,
            borderRadius: 8,
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 20, marginBottom: 4 }}>💎</Text>
          <Text style={{ fontSize: 12, color: '#666', fontWeight: '600' }}>Patronage</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/(tabs)/settings')}
          style={{
            flex: 1,
            backgroundColor: '#f5f5f5',
            padding: 12,
            borderRadius: 8,
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 20, marginBottom: 4 }}>⚙️</Text>
          <Text style={{ fontSize: 12, color: '#666', fontWeight: '600' }}>Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Posts Feed */}
      {loading && posts.length === 0 ? (
        <View className="loading-container">
          <ActivityIndicator size="large" color="#007AFF" />
          <Text className="loading-text">Loading posts...</Text>
        </View>
      ) : error ? (
        <View className="error-container">
          <Text className="error-text">{error}</Text>
          <TouchableOpacity
            onPress={fetchPosts}
            style={{
              marginTop: 16,
              backgroundColor: '#007aff',
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '600' }}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => <PostCard post={item} />}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <View style={{ padding: 40, alignItems: 'center' }}>
              <Text style={{ fontSize: 48, marginBottom: 12 }}>📭</Text>
              <Text style={{ fontSize: 18, fontWeight: '600', color: '#000', marginBottom: 8 }}>
                No posts yet
              </Text>
              <Text style={{ fontSize: 14, color: '#666', textAlign: 'center' }}>
                Follow some creators to see their posts here
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/creator')}
                style={{
                  marginTop: 16,
                  backgroundColor: '#007aff',
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '600' }}>Discover Creators</Text>
              </TouchableOpacity>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#007AFF"
            />
          }
        />
      )}
    </View>
  );
}