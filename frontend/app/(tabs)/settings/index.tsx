// app/(tabs)/settings.tsx
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const router = useRouter();

  return (

    <ScrollView style={{ height: "100vh" as any }} className="container">
      <Text className="title">Settings</Text>

      <TouchableOpacity
        className="p-4 border-b border-[var(--border)]"
        onPress={() => router.push('/settings/profile')}
      >
        <Text className="text-base">Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="p-4 border-b border-[var(--border)]"
        onPress={() => router.push('/settings/account')}
      >
        <Text className="text-base">Account</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="p-4 border-b border-[var(--border)]"
        onPress={() => router.push('/settings/portfolio')}
      >
        <Text className="text-base">Portfolio</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}