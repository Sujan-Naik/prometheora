import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Text } from '@/components/ThemedText';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    router.replace('/auth/login');
  };

  return (
    <TouchableOpacity className="button bg-error" onPress={handleLogout} activeOpacity={0.7}>
      <Text className="button-text">Logout</Text>
    </TouchableOpacity>
  );
}