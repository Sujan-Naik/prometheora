import { View, FlatList } from 'react-native';
import { Text } from '@/components/ThemedText';

import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { IPost } from "@/types/prisma";
import PostCard from "@/components/PostCard";
import LoadingScreen from '@/components/LoadingScreen';

export default function CreatorPosts() {
  const { handle } = useLocalSearchParams<{ handle: string }>();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const token = useRequireAuth();

  useEffect(() => {
    if (!token) return;

    axios.get<IPost[]>(`${process.env.EXPO_PUBLIC_API_URL}/creators/${handle}/posts`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setPosts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [handle, token]);

  if (loading) {
    return <LoadingScreen message="Loading posts..." />;
  }

  return (
    <View className="page-container" >
        <View>
      <View className="header">
        <Text className="header-title">Posts for {handle}</Text>
      </View>
      <FlatList
        data={posts}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <PostCard post={item}/>
        )}
      />
            </View>
    </View>
  );
}