// app/creator/[handle]/about.tsx
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {useRequireAuth} from "@/hooks/useRequireAuth";

interface About {
  bio: string;
  media: string;
}

export default function CreatorAbout() {
  const { handle } = useLocalSearchParams<{ handle: string }>();
  const [about, setAbout] = useState<About>({ bio: '', media: '' });

  const token = useRequireAuth();

  useEffect(() => {
    if (!token){
      return;
    }
    axios.get<About>(`http://localhost:3000/creators/${handle}/about`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setAbout(res.data))
      .catch(err => console.error(err));
  }, [handle]);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>About {handle}</Text>
      <Text>Bio: {about.bio}</Text>
      <Text>Media: {about.media}</Text> {/* Assume media is a JSON string, parse if needed */}
    </View>
  );
}