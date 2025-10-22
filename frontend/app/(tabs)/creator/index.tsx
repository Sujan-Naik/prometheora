import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import LoadingScreen from '@/components/LoadingScreen';

export default function CreatorScreen() {
  const router = useRouter();
  const token = useRequireAuth();
  const [handle, setHandle] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    axios
      .get(`${process.env.EXPO_PUBLIC_API_URL}/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        setHandle(res.data.handle);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return <LoadingScreen message="Loading creator dashboard..." />;
  }

  return (
    <View className="page-container">
      <ScrollView style={{ height: '100vh' as any }} contentContainerStyle={{alignItems: "center"}} className="basic-container">
        <View style={{width: '100%'}} className="basic-container">
          <Text className="title">Creator Dashboard</Text>

          <View className="input-container">
            <Text className="section-title">Create Content</Text>

            <TouchableOpacity className="button" onPress={() => router.push('/creator/create-post')}>
              <Text className="button-text">Create Post</Text>
            </TouchableOpacity>

            <TouchableOpacity className="button" onPress={() => router.push('/creator/create-devlog')}>
              <Text className="button-text">Create Devlog</Text>
            </TouchableOpacity>

            <TouchableOpacity className="button" onPress={() => router.push('/creator/create-project')}>
              <Text className="button-text">Create Project</Text>
            </TouchableOpacity>

            <TouchableOpacity className="button" onPress={() => router.push('/creator/create-tier')}>
              <Text className="button-text">Create Tier</Text>
            </TouchableOpacity>
          </View>

          {handle && (
            <TouchableOpacity className="button" onPress={() => router.push(`/(tabs)/profile/${handle}`)}>
              <Text className="button-text">View Your Profile</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}