// app/creator/[handle]/portfolio.tsx
import { View, Text, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRequireAuth } from "@/hooks/useRequireAuth";

interface PortfolioItem {
  id: number;
  order: number;
  caption?: string;
  project: {
    id: number;
    title: string;
    description: string;
  };
}

export default function CreatorPortfolio() {
  const { handle } = useLocalSearchParams<{ handle: string }>();
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const token = useRequireAuth();

  useEffect(() => {
    if (!token) {
      return;
    }
    axios.get<PortfolioItem[]>(`http://localhost:3000/portfolio/${handle}`, {
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
          <View>
            <Text>{item.project.title}</Text>
            <Text>{item.caption}</Text>
            <Text>{item.project.description}</Text>
          </View>
        )}
      />
    </View>
  );
}