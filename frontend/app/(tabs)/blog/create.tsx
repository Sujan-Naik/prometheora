// app/blog/create.tsx
import { View, TextInput, Button, Text } from 'react-native';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useAdmin } from "@/hooks/useAdmin";

interface CreateBlogResponse {
  id: number;
  title: string;
}

export default function CreateBlog() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();
  const token = useRequireAuth();
  const isAdmin = useAdmin();

  if (!isAdmin) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>You are not authorized to create blogs.</Text>
      </View>
    );
  }

  const handleCreate = () => {
    if (!token) return;
    axios.post<CreateBlogResponse>(
      'http://localhost:3000/blogs',
      { title, content, slug },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(() => router.back())
      .catch(err => console.error(err));
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Create Blog</Text>
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={{ borderWidth: 1, marginVertical: 8, padding: 8 }} />
      <TextInput placeholder="Slug" value={slug} onChangeText={setSlug} style={{ borderWidth: 1, marginVertical: 8, padding: 8 }} />
      <TextInput placeholder="Content" value={content} onChangeText={setContent} multiline style={{ borderWidth: 1, marginVertical: 8, padding: 8, height: 200 }} />
      <Button title="Submit" onPress={handleCreate} />
    </View>
  );
}
