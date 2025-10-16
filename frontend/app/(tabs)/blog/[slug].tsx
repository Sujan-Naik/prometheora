// app/blog/[slug].tsx
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function BlogPostDetail() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  useEffect(() => {
    console.log('slug param:', slug);
    axios.get<BlogPost>(`http://localhost:3000/blogs/${slug}`)
      .then(res => setPost(res.data))
      .catch(err => console.error(err));
  }, [slug]);

  if (!post) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Loading...</Text></View>;
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{post.title}</Text>
      <Text style={{ marginTop: 10 }}>{post.content}</Text>
    </View>
  );
}
