import { Stack } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { TabBarHeightProvider } from "@/context/TabBarHeightContext";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import LoadingScreen from "@/components/LoadingScreen";
import '../global.css'

export default function RootLayout() {
  const { isAuthenticated } = useAuthStatus();

  if (isAuthenticated === null) {
    return <LoadingScreen />;
  }

  return (
    <TabBarHeightProvider>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }} className="bg-[var(--background)]">
          <View style={{ flex: 1 }}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="auth/login" />
              <Stack.Screen name="auth/signup" />
              <Stack.Screen name="(public)" />
            </Stack>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </TabBarHeightProvider>
  );
}
