import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import axios from 'axios';
import { Tabs, TabSlot, TabList, TabTrigger } from 'expo-router/ui';
import { TabButton } from '@/components/TabButton';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useTabBarHeight } from '@/context/TabBarHeightContext';

export default function CreatorLayout() {
  const token = useRequireAuth();
  const [handle, setHandle] = useState<string | null>(null);
  const { getTotalHeight } = useTabBarHeight();
  const hasMeasured = useRef(false);

  useEffect(() => {
    if (!token) return;
    axios
      .get(`${process.env.EXPO_PUBLIC_API_URL}/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setHandle(res.data.handle))
      .catch(console.error);
  }, [token]);

  return (
    <Tabs>
      <View style={{flex: 1}}><TabSlot /></View>
      <TabList
        className="tab-list tab-list-web"
        style={{ bottom: getTotalHeight('outer') }}
        onLayout={() => {
          if (hasMeasured.current) return;
          hasMeasured.current = true;
        }}
      >
        <TabTrigger name="create-home" href="/(tabs)/creator" asChild>
          <TabButton icon="🎨">Create</TabButton>
        </TabTrigger>
        <TabTrigger name="create-post" href="/(tabs)/creator/create-post" asChild>
          <TabButton icon="📝">Post</TabButton>
        </TabTrigger>
        <TabTrigger name="create-devlog" href="/(tabs)/creator/create-devlog" asChild>
          <TabButton icon="💻">Devlog</TabButton>
        </TabTrigger>
        <TabTrigger name="create-project" href="/(tabs)/creator/create-project" asChild>
          <TabButton icon="🚀">Project</TabButton>
        </TabTrigger>
        <TabTrigger name="create-tier" href="/(tabs)/creator/create-tier" asChild>
          <TabButton icon="⭐">Tier</TabButton>
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}