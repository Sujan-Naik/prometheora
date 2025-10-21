import { View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRequireAuth } from "@/hooks/useRequireAuth";
import DisplayMedia from '@/components/DisplayMedia';
import { MediaRecord } from '@/utils/mediaUtils';
import LoadingScreen from '@/components/LoadingScreen';

interface About {
  bio: string;
  media: MediaRecord[];
}

export default function CreatorAbout() {
  const { handle } = useLocalSearchParams<{ handle: string }>();
  const [about, setAbout] = useState<About>({ bio: '', media: [] });
  const [loading, setLoading] = useState(true);
  const token = useRequireAuth();

  useEffect(() => {
    if (!token) return;
    
    axios.get<About>(`${process.env.EXPO_PUBLIC_API_URL}/creators/${handle}/about`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setAbout(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [handle, token]);

  if (loading) {
    return <LoadingScreen message="Loading about..." />;
  }

  return (
  <View className="page-container">
      <ScrollView style={{ height: '100vh' as any }} className="basic-container">
        <View className="basic-container">
          <Text className="title">About {handle}</Text>
          
          <View className="input-container">
            <Text className="section-title">Bio</Text>
            <Text className="text-base">{about.bio || 'No bio available'}</Text>
          </View>

          {about.media && about.media.length > 0 && (
            <View className="input-container">
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
        </View>
      </ScrollView>
    </View>
  );
}
