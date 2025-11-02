import { useRef } from 'react';
import { View } from 'react-native';
import { Tabs, TabSlot, TabList, TabTrigger } from 'expo-router/ui';
import { useLocalSearchParams } from 'expo-router';
import { TabButton } from '@/components/TabButton';
import { useTabBarHeight } from '@/context/TabBarHeightContext';

export default function HandleLayout() {
  const { handle } = useLocalSearchParams();
  const { getTotalHeight, setHeight } = useTabBarHeight();
  const hasMeasured = useRef(false);

  return (
    <Tabs>
      <View style={{flex: 1}}><TabSlot /></View>
      <TabList
        className="tab-list tab-list-web"
        style={{ bottom: getTotalHeight('profile') }}
        onLayout={(e) => {
          if (!hasMeasured.current) {
            setHeight('handle', e.nativeEvent.layout.height);
            hasMeasured.current = true;
          }
        }}
      >
        <TabTrigger name="handle-home" href={`/profile/${handle}`} asChild>
          <TabButton className={"font-sans"} icon="👤">Profile</TabButton>
        </TabTrigger>
        <TabTrigger name="handle-about" href={`/profile/${handle}/about`} asChild>
          <TabButton className={"font-sans"} icon="ℹ️">About</TabButton>
        </TabTrigger>
        <TabTrigger name="handle-posts" href={`/profile/${handle}/posts`} asChild>
          <TabButton className={"font-sans"} icon="📰">Posts</TabButton>
        </TabTrigger>
        <TabTrigger name="handle-tiers" href={`/profile/${handle}/tiers`} asChild>
          <TabButton className={"font-sans"} icon="⭐">Tiers</TabButton>
        </TabTrigger>
        <TabTrigger name="handle-portfolio" href={`/profile/${handle}/portfolio`} asChild>
          <TabButton className={"font-sans"} icon="🖼️">Portfolio</TabButton>
        </TabTrigger>
        <TabTrigger name="handle-projects" href={`/profile/${handle}/projects`} asChild>
          <TabButton className={"font-sans"} icon="📁">Projects</TabButton>
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}