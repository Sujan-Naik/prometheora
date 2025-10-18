// app/(tabs)/blog/index.tsx
import { View, Text, FlatList, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'expo-router';
import { IBlog } from "@/types/prisma";

export default function BlogList() {
  const [blogs, setBlogs] = useState<IBlog[]>([]);

  useEffect(() => {
    axios
      .get<IBlog[]>(`${process.env.EXPO_PUBLIC_API_URL}/blogs`)
      .then(res => setBlogs(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <View className="container">
      <Text className="title">Blog List</Text>
      <FlatList
        data={blogs}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <Link href={`/(tabs)/blog/${item.slug}`} asChild>
            <Pressable className="p-4 border-b border-[var(--border)]">
              <Text className="text-lg font-semibold text-[var(--text-primary)]">{item.title}</Text>
              <Text className="text-sm text-[var(--text-secondary)]">
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </Pressable>
          </Link>
        )}
      />
    </View>
  );
}