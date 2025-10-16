// app/creator/create-post.tsx
import { View, TextInput, Button, Text } from 'react-native';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useRequireAuth } from "@/hooks/useRequireAuth";
import {IPost} from "@/types/prisma";


export default function CreatePost() {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [quotedProjectId, setQuotedProjectId] = useState<string>('');
  const router = useRouter();
  const token = useRequireAuth();

  const handleCreate = () => {
    if (!token) {
      return;
    }
    axios.post<IPost>('http://localhost:3000/posts', { title, content, isPaid, quotedProjectId: quotedProjectId ? parseInt(quotedProjectId) : undefined }, {
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
      <TextInput placeholder="Quoted Project ID (optional)" value={quotedProjectId} onChangeText={setQuotedProjectId} keyboardType="numeric" />
      <Button title={isPaid ? 'Paid' : 'Free'} onPress={() => setIsPaid(!isPaid)} />
      <Button title="Submit" onPress={handleCreate} />
    </View>
  );
}