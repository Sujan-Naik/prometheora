import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="blog/index" options={{ title: 'Blog' }} />
      <Tabs.Screen name="creator/[handle]/index" options={{ title: 'Creator' }} />
      <Tabs.Screen name="patron/subcriptions" options={{ title: 'Subs' }} />
      <Tabs.Screen name="settings/profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}