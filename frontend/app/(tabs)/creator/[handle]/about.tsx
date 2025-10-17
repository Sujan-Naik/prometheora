// app/creator/[handle]/about.tsx
import { View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRequireAuth } from "@/hooks/useRequireAuth";
import DisplayMedia from '@/components/DisplayMedia';
import { MediaRecord } from '@/utils/mediaUtils';

interface About {
  bio: string;
  media: MediaRecord[];
}

export default function CreatorAbout() {
  const { handle } = useLocalSearchParams<{ handle: string }>();
  const [about, setAbout] = useState<About>({ bio: '', media: [] });
  const token = useRequireAuth();

  useEffect(() => {
    if (!token) {
      return;
    }
    axios.get<About>(`${process.env.EXPO_PUBLIC_API_URL}/creators/${handle}/about`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setAbout(res.data))
      .catch(err => console.error(err));
  }, [handle, token]);

  return (
    <ScrollView className="container">
      <Text className="title">About {handle}</Text>
      <View className="section">
        <Text className="section-title">Bio</Text>
        <Text>{about.bio || 'No bio available'}</Text>
      </View>

      {about.media && about.media.length > 0 && (
        <View className="section">
          <Text className="section-title">Media</Text>
          {about.media.map((item) => (
            <DisplayMedia
              key={item.id}
              media={item}
              showCaption={true}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}