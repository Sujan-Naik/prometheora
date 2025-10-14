import { View, Text, Button, FlatList, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useAuthStatus } from '@/hooks/useAuthStatus'; // adjust path as needed

interface Post {
  id: number;
  title: string;
  content: string;
  isPaid: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const router = useRouter();
  const { isAuthenticated } = useAuthStatus();

  useEffect(() => {
    axios
      .get<Post[]>('http://localhost:3000/posts') // use your backend port
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
        renderItem={({ item }) => <Text>{item.title}</Text>}
        ListEmptyComponent={<Text>No posts yet.</Text>}
      />

      <View style={{ marginTop: 30 }}>
        {isAuthenticated ? (
          <>
            <Button title="Creator" onPress={() => router.push('/creator/create-post')} />
            <Button title="Settings" onPress={() => router.push('/settings/profile')} />
          </>
        ) : (
          <>
            <Button title="Go to Login" onPress={() => router.push('/auth/login')} />
            <Button title="Go to Signup" onPress={() => router.push('/auth/signup')} />
          </>
        )}
        <Button title="Go to Blog" onPress={() => router.push('/blog/index')} />
      </View>
    </View>
  );
}