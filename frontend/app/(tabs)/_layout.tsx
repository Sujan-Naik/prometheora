import { Tabs, TabSlot, TabList, TabTrigger } from 'expo-router/ui';
import { TabButton } from "@/components/TabButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs>
      <TabSlot />
      <TabList
        className="tab-list tab-list-web tab-list-native"
        style={{ paddingBottom: insets.bottom }}
      >
        <TabTrigger name="home" href="/" asChild>
          <TabButton icon="📝">Home</TabButton>
        </TabTrigger>
        <TabTrigger name="blog" href="/blog" asChild>
          <TabButton icon="📝">Blog</TabButton>
        </TabTrigger>
        <TabTrigger name="patron" href="/patron" asChild>
          <TabButton icon="❤️">Patron</TabButton>
        </TabTrigger>
        <TabTrigger name="creator" href="/creator" asChild>
          <TabButton icon="✨">Creator</TabButton>
        </TabTrigger>
        <TabTrigger name="profile" href="/profile" asChild>
          <TabButton icon="👤">Profile</TabButton>
        </TabTrigger>
        <TabTrigger name="settings" href="/settings" asChild>
          <TabButton icon="⚙️">Settings</TabButton>
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}