// app/blog/create.tsx
import { View, TextInput, Button, Text } from 'react-native';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import {useRequireAuth} from "@/hooks/useRequireAuth";

interface CreateBlogResponse {
  id: number;
  title: string;
  // etc.
}

export default function CreateBlog() {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
  const router = useRouter();
const token = useRequireAuth();
  const handleCreate = () => {
      if (!token){
          return;
      }
    axios.post<CreateBlogResponse>('http://localhost:3000/blogs', { title, content, slug }, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => router.back())
      .catch(err => console.error(err));
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Create Blog</Text>
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} />
      <TextInput placeholder="Slug" value={slug} onChangeText={setSlug} />
      <TextInput placeholder="Content" value={content} onChangeText={setContent} multiline />
      <Button title="Submit" onPress={handleCreate} />
    </View>
  );
}