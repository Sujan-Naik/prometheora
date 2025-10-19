import { View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { IUser } from "@/types/prisma";
import UserCard from "@/components/UserCard";
import LoadingScreen from '@/components/LoadingScreen';

export default function CreatorProfile() {
  const { handle } = useLocalSearchParams<{ handle: string }>();
  const [profile, setProfile] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const token = useRequireAuth();

  useEffect(() => {
    if (!token) return;
    
    axios.get<IUser>(`${process.env.EXPO_PUBLIC_API_URL}/creators/${handle}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [handle, token]);

  if (loading) {
    return <LoadingScreen message="Loading profile..." />;
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <View className="container">
          <Text className="title">{handle}s profile</Text>
          {profile && <UserCard user={profile}/>}
        </View>
      </ScrollView>
    </View>
  );
}
