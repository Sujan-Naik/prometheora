// app/creator/[handle]/tiers.tsx
import { View, Text, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRequireAuth } from "@/hooks/useRequireAuth";
import {ITier} from "@/types/prisma";
import TierCard from "@/components/TierCard";


export default function CreatorTiers() {
  const { handle } = useLocalSearchParams<{ handle: string }>();
  const [tiers, setTiers] = useState<ITier[]>([]);
  const token = useRequireAuth();

  useEffect(() => {
    if (!token) {
      return;
    }
    axios.get<ITier[]>(`${process.env.EXPO_PUBLIC_API_URL}/creators/${handle}/tiers`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setTiers(res.data))
      .catch(err => console.error(err));
  }, [handle, token]);

  const handleSubscribe = (tierId: number) => {
    if (!token) {
      return;
    }
    axios.post<{ id: number }>(`${process.env.EXPO_PUBLIC_API_URL}/subscriptions`, { tierId }, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => alert('Subscribed!'))
      .catch(err => console.error(err));
  };

  return (
    <View style={{ flex: 1 }}>
      <Text>Tiers for {handle}</Text>
      <FlatList
        data={tiers}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
            <TierCard tier={item} onSubscribe={() => handleSubscribe(item.id)} />
        )}
      />
    </View>
  );
}