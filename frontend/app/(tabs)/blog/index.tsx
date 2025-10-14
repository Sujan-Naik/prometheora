// app/blog/index.tsx
import { View, Text, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'expo-router';

interface Blog {
  id: number;
  slug: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    axios.get<Blog[]>('http://localhost:3000/blogs')
      .then(res => setBlogs(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Text>Blog List</Text>
      <FlatList
        data={blogs}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <Link href={`/blog/${item.slug}`}>
            <Text>{item.title}</Text>
          </Link>
        )}
      />
    </View>
  );
}