// app/creator/create-tier.tsx
import { View, TextInput, Button, Text } from 'react-native';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useRequireAuth } from "@/hooks/useRequireAuth";
import {ITier} from "@/types/prisma";

export default function CreateTier() {
  const [name, setName] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [benefits, setBenefits] = useState<string>('');
  const router = useRouter();
  const token = useRequireAuth();

  const handleCreate = () => {
    if (!token) {
      return;
    }
    axios.post<ITier>('EXPO_PUBLIC_API_URL/tiers', { name, price: parseFloat(price), benefits }, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => router.back())
      .catch(err => console.error(err));
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Create Tier</Text>
      <TextInput placeholder="Name" value={name} onChangeText={setName} />
      <TextInput placeholder="Price" value={price} onChangeText={setPrice} keyboardType="numeric" />
      <TextInput placeholder="Benefits" value={benefits} onChangeText={setBenefits} multiline />
      <Button title="Submit" onPress={handleCreate} />
    </View>
  );
}