import { Tabs, TabSlot, TabList, TabTrigger, TabTriggerSlotProps } from 'expo-router/ui';
import { useLocalSearchParams } from 'expo-router';
import { Text, Pressable } from 'react-native';

export default function HandleLayout() {
  const { handle } = useLocalSearchParams(); // gets the dynamic route param

  return (
    <Tabs>
      <TabSlot />
      <TabList className="tab-list tab-list-web tab-list-native">
        <TabTrigger name="index" href={`/(tabs)/creator/${handle}`} asChild>
          <TabButton icon="👤">Profile</TabButton>
        </TabTrigger>

        <TabTrigger name="about" href={`/(tabs)/creator/${handle}/about`} asChild>
          <TabButton icon="ℹ️">About</TabButton>
        </TabTrigger>

        <TabTrigger name="posts" href={`/(tabs)/creator/${handle}/posts`} asChild>
          <TabButton icon="📰">Posts</TabButton>
        </TabTrigger>

        <TabTrigger name="tiers" href={`/(tabs)/creator/${handle}/tiers`} asChild>
          <TabButton icon="⭐">Tiers</TabButton>
        </TabTrigger>

        <TabTrigger name="portfolio" href={`/(tabs)/creator/${handle}/portfolio`} asChild>
          <TabButton icon="🖼️">Portfolio</TabButton>
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}

type TabButtonProps = TabTriggerSlotProps & { icon: string; children: string };

function TabButton({ icon, children, isFocused, ...props }: TabButtonProps) {
  return (
    <Pressable {...props} className={`tab-button ${isFocused ? 'tab-button-focused' : ''}`}>
      <Text className="tab-icon">{icon}</Text>
      <Text className={`tab-label ${isFocused ? 'tab-label-focused' : ''}`}>{children}</Text>
    </Pressable>
  );
}