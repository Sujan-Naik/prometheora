import { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import axios from 'axios';
import { Tabs, TabSlot, TabList, TabTrigger } from 'expo-router/ui';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { TabButton } from "@/components/TabButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CreatorLayout() {
  const token = useRequireAuth();
  const [handle, setHandle] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    axios
      .get(`${process.env.EXPO_PUBLIC_API_URL}/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setHandle(res.data.handle))
      .catch(console.error);
  }, [token]);

  console.log(handle);
  const insets = useSafeAreaInsets();

  // if (!handle) {
  //   return (
  //     <View className="flex-1 items-center justify-center">
  //       <Text className="loading-text">Loading...</Text>
  //     </View>
  //   );
  // }

  return (
    <Tabs>
      <TabSlot />
      <TabList
        className="tab-list tab-list-web tab-list-native"
      >
        <TabTrigger name="creator-home" href="/(tabs)/creator" asChild>
          <TabButton icon="🎨">Create</TabButton>
        </TabTrigger>

        <TabTrigger name="creator-create-post" href="/(tabs)/creator/create-post" asChild>
          <TabButton icon="📝">Post</TabButton>
        </TabTrigger>

        <TabTrigger name="creator-create-devlog" href="/(tabs)/creator/create-devlog" asChild>
          <TabButton icon="💻">Devlog</TabButton>
        </TabTrigger>

        <TabTrigger name="creator-create-project" href="/(tabs)/creator/create-project" asChild>
          <TabButton icon="🚀">Project</TabButton>
        </TabTrigger>

        <TabTrigger name="creator-create-tier" href="/(tabs)/creator/create-tier" asChild>
          <TabButton icon="⭐">Tier</TabButton>
        </TabTrigger>

        {/*{handle && (*/}
        {/*  <TabTrigger*/}
        {/*    name="creator-profile"*/}
        {/*    href={`/(tabs)/profile/${handle}`}*/}
        {/*    asChild*/}
        {/*  >*/}
        {/*    <TabButton icon="👤">Profile</TabButton>*/}
        {/*  </TabTrigger>*/}
        {/*)}*/}
      </TabList>
    </Tabs>
  );
}