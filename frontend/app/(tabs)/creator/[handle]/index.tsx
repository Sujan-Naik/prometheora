// app/creator/[handle]/index.tsx
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {useRequireAuth} from "@/hooks/useRequireAuth";

interface CreatorProfile {
  id: number;
  handle: string;
  bio: string;
  media: string;
  posts: Post[];
  tiers: Tier[];
}

interface Post {
  id: number;
  title: string;
  // etc.
}

interface Tier {
  id: number;
  name: string;
  // etc.
}

export default function CreatorProfile() {
  const { handle } = useLocalSearchParams<{ handle: string }>();
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
const token = useRequireAuth();
  useEffect(() => {
    if (!token){
          return;
      }
    axios.get<CreatorProfile>(`http://localhost:3000/creators/${handle}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setProfile(res.data))
      .catch(err => console.error(err));
  }, [handle]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Creator Profile: {handle}</Text>
      {profile && <Text>{profile.bio}</Text>}
    </View>
  );
}