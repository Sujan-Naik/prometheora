// app/blog/index.tsx
import {View, Text, FlatList, Pressable} from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'expo-router';

interface BlogIndex {
  id: number;
  slug: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function BlogList() {
  const [blogs, setBlogs] = useState<BlogIndex[]>([]);

  useEffect(() => {
    axios
      .get<BlogIndex[]>('http://localhost:3000/blogs')
      .then(res => setBlogs(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Blog List</Text>
      <FlatList
        data={blogs}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <Link href={`/blog/${item.slug}`}>
              <Pressable>
            <Text style={{ fontSize: 18, marginVertical: 8 }}>{item.title}</Text>
                  </Pressable>
          </Link>
        )}
      />
    </View>
  );
}
