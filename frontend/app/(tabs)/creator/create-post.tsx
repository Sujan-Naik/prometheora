// app/creator/create-post.tsx
import { View, TextInput, Button, Text } from 'react-native';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import {useRequireAuth} from "@/hooks/useRequireAuth";

interface CreatePostResponse {
  id: number;
  title: string;
  // etc.
}

export default function CreatePost() {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const router = useRouter();
    const token = useRequireAuth();

  const handleCreate = () => {
      if (!token) return;
    axios.post<CreatePostResponse>('http://localhost:3000/posts', { title, content, isPaid }, {
 headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => router.back())
      .catch(err => console.error(err));
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Create Post</Text>
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} />
      <TextInput placeholder="Content" value={content} onChangeText={setContent} multiline />
      <Button title={isPaid ? 'Paid' : 'Free'} onPress={() => setIsPaid(!isPaid)} />
      <Button title="Submit" onPress={handleCreate} />
    </View>
  );
}