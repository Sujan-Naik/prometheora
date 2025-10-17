// app/patron/payments.tsx
import { View, Text, FlatList, Button } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRequireAuth } from "@/hooks/useRequireAuth";
import {IPayment} from "@/types/prisma";
import PaymentCard from "@/components/PaymentCard";


export default function Payments() {
  const [payments, setPayments] = useState<IPayment[]>([]);
  const token = useRequireAuth();

  useEffect(() => {
    if (!token) {
      return;
    }
    axios.get<IPayment[]>('http://localhost:3000/payments', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setPayments(res.data))
      .catch(err => console.error(err));
  }, [token]);

  // Optional: Function to record a payment, but might be triggered elsewhere (e.g., after subscribe)
  const handleRecordPayment = (subscriptionId: number, amount: number) => {
    if (!token) {
      return;
    }
    axios.post<IPayment>('http://localhost:3000/payments', { subscriptionId, amount }, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => alert('Payment recorded!'))
      .catch(err => console.error(err));
  };

  return (
    <View style={{ flex: 1 }}>
      <Text>My Payments</Text>
      <FlatList
        data={payments}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <PaymentCard payment={item}/>
        )}
      />
      {/* If needed, add buttons to record payments for specific subs */}
    </View>
  );
}