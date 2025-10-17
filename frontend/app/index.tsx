// app/index.tsx
import { View, Text, Button, FlatList, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useAuthStatus } from '@/hooks/useAuthStatus';
import PostCard from "@/components/PostCard";
import {IPost} from "@/types/prisma";

export default function Home() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const router = useRouter();
  const { isAuthenticated } = useAuthStatus();
    console.log(isAuthenticated)
  useEffect(() => {
    axios
      .get<IPost[]>('http://localhost:3000/posts')
      .then(res => setPosts(res.data))
      .catch(console.error);
  }, []);

  if (isAuthenticated === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Discover Feed</Text>
      <FlatList
        data={posts}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <PostCard post={item}/>}
        ListEmptyComponent={<Text>No posts yet.</Text>}
      />
      <View style={{ marginTop: 30 }}>
        {isAuthenticated ? (
          <>
            <Button title="Blog" onPress={() => router.push('/(tabs)/blog')} />
            <Button title="Creator" onPress={() => router.push('/(tabs)/creator')} />
            <Button title="Settings" onPress={() => router.push('/(tabs)/settings')} />
          </>
        ) : (
          <>
            <Button title="Login" onPress={() => router.push('/auth/login')} />
            <Button title="Signup" onPress={() => router.push('/auth/signup')} />
          </>
        )}
      </View>
    </View>
  );
}