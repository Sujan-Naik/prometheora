// app/creator/[handle]/portfolio.tsx
import { View, Text, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRequireAuth } from "@/hooks/useRequireAuth";
import {IPortfolioItem} from "@/types/prisma";
import ProjectCard from "@/components/ProjectCard";


export default function CreatorPortfolio() {
  const { handle } = useLocalSearchParams<{ handle: string }>();
  const [portfolio, setPortfolio] = useState<IPortfolioItem[]>([]);
  const token = useRequireAuth();

  useEffect(() => {
    if (!token) {
      return;
    }
    axios.get<IPortfolioItem[]>(`${process.env.EXPO_PUBLIC_API_URL}/portfolio/${handle}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setPortfolio(res.data))
      .catch(err => console.error(err));
  }, [handle, token]);

  return (
    <View style={{ flex: 1 }}>
      <Text>Portfolio for {handle}</Text>
      <FlatList
        data={portfolio}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <ProjectCard project={item.project!} />
        )}
      />
    </View>
  );
}