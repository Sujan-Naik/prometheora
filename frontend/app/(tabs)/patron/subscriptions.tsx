// app/patron/subscriptions.tsx
import { View, Text, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRequireAuth } from "@/hooks/useRequireAuth";
import {ISubscription} from "@/types/prisma";
import SubscriptionCard from "@/components/SubscriptionCard";

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState<ISubscription[]>([]);
  const token = useRequireAuth();

  useEffect(() => {
    if (!token) {
      return;
    }
    axios.get<ISubscription[]>('EXPO_PUBLIC_API_URL/subscriptions', {
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
          <SubscriptionCard subscription={item}/>
        )}
      />
    </View>
  );
}