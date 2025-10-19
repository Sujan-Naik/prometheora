import { View, Text, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { IDevlog } from "@/types/prisma";
import DevlogCard from "@/components/DevlogCard";
import LoadingScreen from '@/components/LoadingScreen';

export default function FollowedProjectsFeed() {
  const [feed, setFeed] = useState<IDevlog[]>([]);
  const [loading, setLoading] = useState(true);
  const token = useRequireAuth();

  useEffect(() => {
    if (!token) return;

    axios.get<IDevlog[]>(`${process.env.EXPO_PUBLIC_API_URL}/projects/followed/feed`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setFeed(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return <LoadingScreen message="Loading feed..." />;
  }

  return (
    <View style={{ flex: 1 }}>
      <View className="header">
        <Text className="header-title">Followed Projects Feed</Text>
      </View>
      <FlatList
        data={feed}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <DevlogCard devlog={item} />
        )}
      />
    </View>
  );
}