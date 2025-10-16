// app/patron/subscriptions.tsx
import { View, Text, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRequireAuth } from "@/hooks/useRequireAuth";

interface Tier {
  id: number;
  name: string;
}

interface Subscription {
  id: number;
  startDate: string;
  endDate?: string;
  tier: Tier;
}

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const token = useRequireAuth();

  useEffect(() => {
    if (!token) {
      return;
    }
    axios.get<Subscription[]>('http://localhost:3000/subscriptions', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setSubscriptions(res.data))
      .catch(err => console.error(err));
  }, [token]);

  return (
    <View style={{ flex: 1 }}>
      <Text>My Subscriptions</Text>
      <FlatList
        data={subscriptions}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>Tier: {item.tier.name}</Text>
            <Text>Start Date: {item.startDate}</Text>
          </View>
        )}
      />
    </View>
  );
}