import { Tabs, TabSlot, TabList, TabTrigger, TabTriggerSlotProps } from 'expo-router/ui';
import {Text, Pressable, View} from 'react-native';
import {TabButton} from "@/components/TabButton";
import {useSafeAreaInsets} from "react-native-safe-area-context";

export default function TabsLayout() {
   const insets = useSafeAreaInsets();

  return (
    <Tabs>
      <TabSlot />
      <View style={{ paddingBottom: insets.bottom }}>
      <TabSlot />

      <TabList className="tab-list tab-list-web tab-list-native">
        <TabTrigger name="home" href="/" asChild>
          <TabButton icon="📝">Home</TabButton>
        </TabTrigger>
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
      </View>
    </Tabs>
  );
}



