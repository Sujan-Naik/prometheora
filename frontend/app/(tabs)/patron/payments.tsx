// app/patron/payments.tsx
import { View, Text, FlatList, Button } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {useRequireAuth} from "@/hooks/useRequireAuth";

interface Subscription {
  id: number;
  // etc.
}

interface Payment {
  id: number;
  amount: number;
  date: string;
  subscription: Subscription;
}

interface RecordPaymentResponse {
  id: number;
  // etc.
}

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
const token = useRequireAuth();
  useEffect(() => {
      if (!token){
          return;
      }
    axios.get<Payment[]>('http://localhost:3000/payments', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setPayments(res.data))
      .catch(err => console.error(err));
  }, []);

  // Optional: Function to record a payment, but might be triggered elsewhere (e.g., after subscribe)
  const handleRecordPayment = (subscriptionId: number, amount: number) => {
      if (!token){
          return;
      }
    axios.post<RecordPaymentResponse>('http://localhost:3000/payments', { subscriptionId, amount }, {
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
          <View>
            <Text>Amount: ${item.amount}</Text>
            <Text>Date: {item.date}</Text>
          </View>
        )}
      />
      {/* If needed, add buttons to record payments for specific subs */}
    </View>
  );
}