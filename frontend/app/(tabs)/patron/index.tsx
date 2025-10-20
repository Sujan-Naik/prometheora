import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function PatronScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ height: '100vh' as any }} className="container">
        <View className="container">
          <Text className="title">Patron</Text>

          <TouchableOpacity
            className="card"
            onPress={() => router.push('/patron/followed-projects')}
          >
            <Text className="text-lg font-semibold">Followed Projects</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="card"
            onPress={() => router.push('/patron/subscriptions')}
          >
            <Text className="text-lg font-semibold">Subscriptions</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="card"
            onPress={() => router.push('/patron/payments')}
          >
            <Text className="text-lg font-semibold">Payments</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}