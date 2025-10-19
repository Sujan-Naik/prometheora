import { Tabs, TabSlot, TabList, TabTrigger } from 'expo-router/ui';
import { useLocalSearchParams } from 'expo-router';
import { TabButton } from "@/components/TabButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HandleLayout() {
  const { handle } = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  return (
    <Tabs>
      <TabSlot />
      <TabList className="tab-list tab-list-web tab-list-native">
        <TabTrigger name="index" href={`/(tabs)/profile/${handle}`} asChild>
          <TabButton icon="👤">Profile</TabButton>
        </TabTrigger>
        <TabTrigger name="about" href={`/(tabs)/profile/${handle}/about`} asChild>
          <TabButton icon="ℹ️">About</TabButton>
        </TabTrigger>
        <TabTrigger name="posts" href={`/(tabs)/profile/${handle}/posts`} asChild>
          <TabButton icon="📰">Posts</TabButton>
        </TabTrigger>
        <TabTrigger name="tiers" href={`/(tabs)/profile/${handle}/tiers`} asChild>
          <TabButton icon="⭐">Tiers</TabButton>
        </TabTrigger>
        <TabTrigger name="portfolio" href={`/(tabs)/profile/${handle}/portfolio`} asChild>
          <TabButton icon="🖼️">Portfolio</TabButton>
        </TabTrigger>
        <TabTrigger name="projects" href={`/(tabs)/profile/${handle}/projects`} asChild>
          <TabButton icon="📁">Projects</TabButton>
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}