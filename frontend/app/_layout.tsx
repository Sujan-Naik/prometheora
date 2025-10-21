import { Stack } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import '@/global.css';
import { View } from 'react-native';
import {TabBarHeightProvider} from "@/context/TabBarHeightContext";

export default function RootLayout() {
  return (
      <TabBarHeightProvider>
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }} className="bg-[var(--background)]">
        <View style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="auth/login" />
            <Stack.Screen name="auth/signup" />
          </Stack>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
        </TabBarHeightProvider>
  );
}
