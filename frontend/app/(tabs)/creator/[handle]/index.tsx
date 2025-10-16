// app/creator/[handle]/index.tsx
import { View, Text } from 'react-native';
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
    axios.get<IUser>(`http://localhost:3000/creators/${handle}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setProfile(res.data))
      .catch(err => console.error(err));
  }, [handle, token]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Creator Profile: {handle}</Text>
      {profile && <Text>{profile.bio!.replace(/<[^>]+>/g, '')}</Text>}
    </View>
  );
}