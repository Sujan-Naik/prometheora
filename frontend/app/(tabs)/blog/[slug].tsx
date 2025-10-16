// app/blog/[slug].tsx
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {IBlog} from "@/types/prisma";


export default function BlogPostDetail() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [post, setPost] = useState<IBlog | null>(null);
  useEffect(() => {
    console.log('slug param:', slug);
    axios.get<IBlog>(`http://localhost:3000/blogs/${slug}`)
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
