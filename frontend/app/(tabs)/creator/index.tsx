import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRequireAuth } from '@/hooks/useRequireAuth';

export default function CreatorScreen() {
  const router = useRouter();
  const token = useRequireAuth();
  const [handle, setHandle] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUserHandle = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `${process.env.EXPO_PUBLIC_API_URL}/user/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            timeout: 10000, // 10 second timeout
          }
        );

        if (response.data && response.data.handle) {
          setHandle(response.data.handle);
        }
      } catch (err) {
        console.error('Failed to fetch user handle:', err);
        setError('Failed to load user data');
        // Don't crash - just continue without the handle
      } finally {
        setLoading(false);
      }
    };

    fetchUserHandle();
  }, [token]);

  return (
    <ScrollView className="container">
      <Text className="title">Creator Dashboard</Text>

      {loading && (
        <View className="loading-container">
          <ActivityIndicator size="large" color="#007aff" />
          <Text className="loading-text">Loading your profile...</Text>
        </View>
      )}

      {error && (
        <View style={{ padding: 10, backgroundColor: '#fff3cd', borderRadius: 8, marginBottom: 20 }}>
          <Text style={{ color: '#856404' }}>{error}</Text>
        </View>
      )}

      <View className="section">
        <Text className="section-title">Create Content</Text>

        <TouchableOpacity
          className="button"
          onPress={() => router.push('/creator/create-post')}
        >
          <Text className="button-text">Create Post</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="button"
          onPress={() => router.push('/creator/create-devlog')}
        >
          <Text className="button-text">Create Devlog</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="button"
          onPress={() => router.push('/creator/create-project')}
        >
          <Text className="button-text">Create Project</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="button"
          onPress={() => router.push('/creator/create-tier')}
        >
          <Text className="button-text">Create Tier</Text>
        </TouchableOpacity>
      </View>

      {!loading && handle && (
        <TouchableOpacity
          className="profile-button"
          onPress={() => router.push(`/(tabs)/creator/${handle}`)}
        >
          <Text className="profile-button-text">View Your Profile</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}