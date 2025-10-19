import { Stack } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import '@/global.css';
import { View } from 'react-native';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }} className="bg-[var(--background)]">
        <View style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="auth" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
