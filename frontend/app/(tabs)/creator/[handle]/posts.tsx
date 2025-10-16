// app/creator/[handle]/posts.tsx
import { View, Text, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRequireAuth } from "@/hooks/useRequireAuth";
import {IPost} from "@/types/prisma";

export default function CreatorPosts() {
  const { handle } = useLocalSearchParams<{ handle: string }>();
  const [posts, setPosts] = useState<IPost[]>([]);
  const token = useRequireAuth();

  useEffect(() => {
    if (!token) {
      return;
    }
    axios.get<IPost[]>(`http://localhost:3000/creators/${handle}/posts`, {
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
          <View>
            <Text>{item.title}</Text>
            <Text>{item.content}</Text>
            {item.quotedProject && <Text>Quoted: {item.quotedProject.title}</Text>}
          </View>
        )}
      />
    </View>
  );
}