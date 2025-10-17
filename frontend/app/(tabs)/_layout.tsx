import { Tabs, TabSlot, TabList, TabTrigger, TabTriggerSlotProps } from 'expo-router/ui';
import { Text, Pressable } from 'react-native';
import {TabButton} from "@/components/TabButton";

export default function TabsLayout() {
  return (
    <Tabs>
      <TabSlot />

      <TabList className="tab-list tab-list-web tab-list-native">
        <TabTrigger name="blog" href="/(tabs)/blog" asChild>
          <TabButton icon="📝">Blog</TabButton>
        </TabTrigger>

        <TabTrigger name="patron" href="/(tabs)/patron" asChild>
          <TabButton icon="❤️">Patron</TabButton>
        </TabTrigger>

        <TabTrigger name="creator" href="/(tabs)/creator" asChild>
          <TabButton icon="✨">Creator</TabButton>
        </TabTrigger>

        <TabTrigger name="settings" href="/(tabs)/settings" asChild>
          <TabButton icon="⚙️">Settings</TabButton>
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}



