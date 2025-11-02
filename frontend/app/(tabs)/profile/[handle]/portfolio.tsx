import { View, FlatList } from 'react-native';
import { Text } from '@/components/ThemedText';

import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { IPortfolioItem } from "@/types/prisma";
import ProjectCard from "@/components/ProjectCard";
import LoadingScreen from '@/components/LoadingScreen';

export default function CreatorPortfolio() {
  const { handle } = useLocalSearchParams<{ handle: string }>();
  const [portfolio, setPortfolio] = useState<IPortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const token = useRequireAuth();

  useEffect(() => {
    if (!token) return;

    axios.get<IPortfolioItem[]>(`${process.env.EXPO_PUBLIC_API_URL}/portfolio/${handle}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setPortfolio(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [handle, token]);

  if (loading) {
    return <LoadingScreen message="Loading portfolio..." />;
  }

  return (
    <View className="page-container">
      <View className="header">
        <Text className="header-title">Portfolio for {handle}</Text>
      </View>
      <FlatList
        data={portfolio}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <ProjectCard project={item.project!} />
        )}
      />
    </View>
  );
}