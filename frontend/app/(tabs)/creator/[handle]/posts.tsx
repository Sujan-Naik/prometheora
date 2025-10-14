// app/creator/[handle]/posts.tsx
import { View, Text, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {useRequireAuth} from "@/hooks/useRequireAuth";

interface Post {
  id: number;
  title: string;
  content: string;
  isPaid: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function CreatorPosts() {
  const { handle } = useLocalSearchParams<{ handle: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
const token = useRequireAuth();
  useEffect(() => {
    if (!token){
          return;
      }
    axios.get<Post[]>(`http://localhost:3000/creators/${handle}/posts`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setPosts(res.data))
      .catch(err => console.error(err));
  }, [handle]);

  return (
    <View style={{ flex: 1 }}>
      <Text>Posts for {handle}</Text>
      <FlatList
        data={posts}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <Text>{item.title}</Text>}
      />
    </View>
  );
}