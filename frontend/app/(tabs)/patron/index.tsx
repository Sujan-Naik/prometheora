// app/(tabs)/patron.tsx
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import { useRouter } from 'expo-router';

export default function PatronScreen() {
  const router = useRouter();

  return (
      <ScrollView style={{ height: "100vh" as any }} className="container">
      <Text className="title">Patron</Text>

      <TouchableOpacity
        className="bg-[var(--secondary)] p-5 rounded-xl mb-3"
        onPress={() => router.push('/patron/followed-projects')}
      >
        <Text className="text-lg font-semibold">Followed Projects</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-[var(--secondary)] p-5 rounded-xl mb-3"
        onPress={() => router.push('/patron/subscriptions')}
      >
        <Text className="text-lg font-semibold">Subscriptions</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-[var(--secondary)] p-5 rounded-xl mb-3"
        onPress={() => router.push('/patron/payments')}
      >
        <Text className="text-lg font-semibold">Payments</Text>
      </TouchableOpacity>
      </ScrollView>
  );
}