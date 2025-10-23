import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function PatronScreen() {
  const router = useRouter();

  return (
    <View className="page-container">
      <ScrollView style={{ height: '100vh' as any }} contentContainerStyle={{alignItems: "center"}} className="basic-container">
        <View className="basic-container">
          <Text className="title">Patron</Text>

          <TouchableOpacity
            className="card"
            onPress={() => router.push('/patron/followed-projects')}
          >
            <Text className="text-lg font-semibold  text-[var(--text-color)]">Followed Projects</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="card"
            onPress={() => router.push('/patron/subscriptions')}
          >
            <Text className="text-lg font-semibold  text-[var(--text-color)]">Subscriptions</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="card"
            onPress={() => router.push('/patron/payments')}
          >
            <Text className="text-lg font-semibold  text-[var(--text-color)]">Payments</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}