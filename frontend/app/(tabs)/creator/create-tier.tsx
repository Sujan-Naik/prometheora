import { View, TextInput, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { ITier } from "@/types/prisma";
import LoadingScreen from '@/components/LoadingScreen';

export default function CreateTier() {
  const [name, setName] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [benefits, setBenefits] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const token = useRequireAuth();

  const handleCreate = () => {
    if (!token) return;

    setLoading(true);
    axios.post<ITier>(`${process.env.EXPO_PUBLIC_API_URL}/tiers`,
      { name, price: parseFloat(price), benefits },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(() => {
        setLoading(false);
        router.back();
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  if (loading) {
    return <LoadingScreen message="Creating tier..." />;
  }

  return (
    <View className="page-container">
      <ScrollView style={{ height: '100vh' as any }} className="basic-container">
        <View style={{width: '100vw' as any}} className="basic-container">
          <Text className="title">Create Tier</Text>

          <View className="input-container">
            <Text className="input-label">Name</Text>
            <TextInput
              placeholder="Name"
              value={name}
              onChangeText={setName}
              className="input"
            />
          </View>

          <View className="input-container">
            <Text className="input-label">Price</Text>
            <TextInput
              placeholder="Price"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              className="input"
            />
          </View>

          <View className="input-container">
            <Text className="input-label">Benefits</Text>
            <TextInput
              placeholder="Benefits"
              value={benefits}
              onChangeText={setBenefits}
              multiline
              className="input-multiline input-tall"
            />
          </View>

          <TouchableOpacity className="button" onPress={handleCreate}>
            <Text className="button-text">Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}