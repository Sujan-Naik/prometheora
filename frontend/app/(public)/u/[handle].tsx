import { View, ScrollView } from 'react-native';
import { Text } from '@/components/ThemedText';

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

  useEffect(() => {

    axios.get<IUser>(`${process.env.EXPO_PUBLIC_API_URL}/creators/${handle}`, {})
      .then(res => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [handle]);

  if (loading || !handle) {
    return <LoadingScreen message="Loading profile..." />;
  }

  return (
    <View className="page-container">
      <ScrollView style={{ height: '100vh' as any }} contentContainerStyle={{alignItems: "center"}} className="basic-container">
        <View className="basic-container">
          <Text className="title">{handle}&#39;s profile</Text>
          {profile && <UserCard user={profile}/>}
        </View>
      </ScrollView>
    </View>
  );
}
