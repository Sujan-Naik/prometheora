// app/_layout.tsx
import { Stack } from 'expo-router';
import { FC } from 'react';

const Layout: FC = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="auth/login" options={{ title: 'Login' }} />
      <Stack.Screen name="auth/signup" options={{ title: 'Signup' }} />
      <Stack.Screen name="creator/[handle]" options={{ title: 'Creator Profile' }} />
      <Stack.Screen name="creator/create-post" options={{ title: 'Create Post' }} />
      <Stack.Screen name="creator/create-tier" options={{ title: 'Create Tier' }} />
      <Stack.Screen name="patron/subscriptions" options={{ title: 'Subscriptions' }} />
      <Stack.Screen name="patron/payments" options={{ title: 'Payments' }} />
      <Stack.Screen name="blog/index" options={{ title: 'Blog' }} />
      <Stack.Screen name="blog/[slug]" options={{ title: 'Blog Post' }} />
      <Stack.Screen name="blog/create" options={{ title: 'Create Blog' }} />
      <Stack.Screen name="settings/profile" options={{ title: 'Profile' }} />
      <Stack.Screen name="settings/account" options={{ title: 'Account' }} />
    </Stack>
  );
};

export default Layout;