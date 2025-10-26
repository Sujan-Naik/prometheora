import { View, FlatList } from 'react-native';
import { Text } from '@/components/ThemedText';

import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { ITier } from "@/types/prisma";
import TierCard from "@/components/TierCard";
import LoadingScreen from '@/components/LoadingScreen';

export default function CreatorTiers() {
  const { handle } = useLocalSearchParams<{ handle: string }>();
  const [tiers, setTiers] = useState<ITier[]>([]);
  const [loading, setLoading] = useState(true);
  const token = useRequireAuth();

  useEffect(() => {
    if (!token) return;

    axios.get<ITier[]>(`${process.env.EXPO_PUBLIC_API_URL}/creators/${handle}/tiers`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setTiers(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [handle, token]);

  const handleSubscribe = (tierId: number) => {
    if (!token) return;

    axios.post<{ id: number }>(`${process.env.EXPO_PUBLIC_API_URL}/subscriptions`, { tierId }, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => alert('Subscribed!'))
      .catch(err => console.error(err));
  };

  if (loading) {
    return <LoadingScreen message="Loading tiers..." />;
  }

  return (
    <View className="page-container">
      <View className="header">
        <Text className="header-title">Tiers for {handle}</Text>
      </View>
      <FlatList
        data={tiers}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <TierCard tier={item} onSubscribe={() => handleSubscribe(item.id)} />
        )}
      />
    </View>
  );
}