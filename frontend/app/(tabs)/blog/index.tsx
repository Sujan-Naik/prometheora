import { View, Text, FlatList, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'expo-router';
import { IBlog } from "@/types/prisma";
import LoadingScreen from '@/components/LoadingScreen';

export default function BlogList() {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get<IBlog[]>(`${process.env.EXPO_PUBLIC_API_URL}/blogs`)
      .then(res => {
        setBlogs(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <LoadingScreen message="Loading blogs..." />;
  }

  return (
    <View className="page-container">
      <View className="header">
        <Text className="header-title">Blog List</Text>
      </View>
      <FlatList
        data={blogs}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <Link href={`/(tabs)/blog/${item.slug}`} asChild>
            <Pressable className="blog-item">
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
