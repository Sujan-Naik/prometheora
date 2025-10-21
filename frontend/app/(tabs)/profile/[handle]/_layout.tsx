import { useRef } from 'react';
import { View } from 'react-native';
import { Tabs, TabSlot, TabList, TabTrigger } from 'expo-router/ui';
import { useLocalSearchParams } from 'expo-router';
import { TabButton } from '@/components/TabButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTabBarHeight } from '@/context/TabBarHeightContext';

export default function HandleLayout() {
  const { handle } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { outerTabBarHeight } = useTabBarHeight();
  const hasMeasured = useRef(false);

  return (
    <Tabs>
      <View><TabSlot /></View>
      <TabList
        className="tab-list tab-list-web"
        style={{ bottom: outerTabBarHeight * 2, paddingBottom: insets.bottom }}
        onLayout={(e) => {
          if (hasMeasured.current) return;
          hasMeasured.current = true;
          // keep if you ever want to record height
          // e.nativeEvent.layout.height;
        }}
      >
        <TabTrigger name="handle-home" href={`/(tabs)/profile/${handle}`} asChild>
          <TabButton icon="👤">Profile</TabButton>
        </TabTrigger>
        <TabTrigger name="handle-about" href={`/(tabs)/profile/${handle}/about`} asChild>
          <TabButton icon="ℹ️">About</TabButton>
        </TabTrigger>
        <TabTrigger name="handle-posts" href={`/(tabs)/profile/${handle}/posts`} asChild>
          <TabButton icon="📰">Posts</TabButton>
        </TabTrigger>
        <TabTrigger name="handle-tiers" href={`/(tabs)/profile/${handle}/tiers`} asChild>
          <TabButton icon="⭐">Tiers</TabButton>
        </TabTrigger>
        <TabTrigger name="handle-portfolio" href={`/(tabs)/profile/${handle}/portfolio`} asChild>
          <TabButton icon="🖼️">Portfolio</TabButton>
        </TabTrigger>
        <TabTrigger name="handle-projects" href={`/(tabs)/profile/${handle}/projects`} asChild>
          <TabButton icon="📁">Projects</TabButton>
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}