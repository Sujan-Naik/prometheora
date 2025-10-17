// app/creator/[handle]/posts.tsx
import { View, Text, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRequireAuth } from "@/hooks/useRequireAuth";
import {IPost} from "@/types/prisma";
import PostCard from "@/components/PostCard";

export default function CreatorPosts() {
  const { handle } = useLocalSearchParams<{ handle: string }>();
  const [posts, setPosts] = useState<IPost[]>([]);
  const token = useRequireAuth();

  useEffect(() => {
    if (!token) {
      return;
    }
    axios.get<IPost[]>(`EXPO_PUBLIC_API_URL/creators/${handle}/posts`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setPosts(res.data))
      .catch(err => console.error(err));
  }, [handle, token]);

  return (
    <View style={{ flex: 1 }}>
      <Text>Posts for {handle}</Text>
      <FlatList
        data={posts}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <PostCard post={item}/>
        )}
      />
    </View>
  );
}