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
    axios.get<BlogPost>(`http://localhost:3000/blogs/${slug}`)
      .then(res => setPost(res.data))
      .catch(err => console.error(err));
  }, [slug]);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {post && (
        <>
          <Text>{post.title}</Text>
          <Text>{post.content}</Text>
        </>
      )}
    </View>
  );
}