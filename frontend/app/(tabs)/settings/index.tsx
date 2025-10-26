import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from '@/components/ThemedText';

import { useRouter } from 'expo-router';
import LogoutButton from "@/components/Logout";

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <View className="page-container">
      <ScrollView style={{ height: '100vh' as any }} contentContainerStyle={{alignItems: "center"}} className="basic-container">
        <View style={{width: '100%'}} className="basic-container">
          <Text className="title">Settings</Text>

          <TouchableOpacity
            className="settings-item"
            onPress={() => router.push('/settings/profile')}
          >
            <Text className="settings-item-text">Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="settings-item"
            onPress={() => router.push('/settings/account')}
          >
            <Text className="settings-item-text">Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="settings-item"
            onPress={() => router.push('/settings/portfolio')}
          >
            <Text className="settings-item-text">Portfolio</Text>
          </TouchableOpacity>

          <LogoutButton/>
        </View>
      </ScrollView>
    </View>
  );
}