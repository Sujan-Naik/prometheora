// app/creator/[handle]/index.tsx
import {View, Text, ScrollView} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRequireAuth } from "@/hooks/useRequireAuth";
import {IUser} from "@/types/prisma";

export default function CreatorProfile() {
  const { handle } = useLocalSearchParams<{ handle: string }>();
  const [profile, setProfile] = useState<IUser | null>(null);
  const token = useRequireAuth();

  useEffect(() => {
    if (!token) {
      return;
    }
    axios.get<IUser>(`${process.env.EXPO_PUBLIC_API_URL}/creators/${handle}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setProfile(res.data))
      .catch(err => console.error(err));
  }, [handle, token]);

  return (
        <ScrollView style={{ height: "100vh" as any }} className="container">

      <Text className="title">Creator Profile: {handle}</Text>
      {profile?.bio && <Text className="text-base text-[var(--text-primary)]">{profile.bio.replace(/<[^>]+>/g, '')}</Text>}
        </ScrollView>
  );
}