import { View, Text, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { ISubscription } from "@/types/prisma";
import SubscriptionCard from "@/components/SubscriptionCard";
import LoadingScreen from '@/components/LoadingScreen';

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState<ISubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const token = useRequireAuth();

  useEffect(() => {
    if (!token) return;
    
    axios.get<ISubscription[]>(`${process.env.EXPO_PUBLIC_API_URL}/subscriptions`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setSubscriptions(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return <LoadingScreen message="Loading subscriptions..." />;
  }

  return (
    <View className="page-container">
      <View className="header">
        <Text className="header-title">My Subscriptions</Text>
      </View>
      <FlatList
        data={subscriptions}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <SubscriptionCard subscription={item}/>
        )}
      />
    </View>
  );
}
