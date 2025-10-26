import { View, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { IPayment } from "@/types/prisma";
import PaymentCard from "@/components/PaymentCard";
import LoadingScreen from '@/components/LoadingScreen';
import { Text } from '@/components/ThemedText';

export default function Payments() {
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const token = useRequireAuth();

  useEffect(() => {
    if (!token) return;
    
    axios.get<IPayment[]>(`${process.env.EXPO_PUBLIC_API_URL}/payments`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setPayments(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [token]);

  const handleRecordPayment = (subscriptionId: number, amount: number) => {
    if (!token) return;
    
    axios.post<{ id: number }>(`${process.env.EXPO_PUBLIC_API_URL}/payments`, { subscriptionId, amount }, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => alert('Payment recorded!'))
      .catch(err => console.error(err));
  };

  if (loading) {
    return <LoadingScreen message="Loading payments..." />;
  }

  return (
    <View className="page-container">
      <View className="header">
        <Text className="header-title">My Payments</Text>
      </View>
      <FlatList
        data={payments}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <PaymentCard payment={item}/>
        )}
      />
    </View>
  );
}
