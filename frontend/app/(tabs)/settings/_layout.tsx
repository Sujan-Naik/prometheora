import { useRef } from 'react';
import { View } from 'react-native';
import { Tabs, TabSlot, TabList, TabTrigger } from 'expo-router/ui';
import { TabButton } from '@/components/TabButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTabBarHeight } from '@/context/TabBarHeightContext';

export default function SettingsLayout() {
  const insets = useSafeAreaInsets();
  const { outerTabBarHeight } = useTabBarHeight();
  const hasMeasured = useRef(false);

  return (
    <Tabs>
      <View><TabSlot /></View>
      <TabList
        className="tab-list tab-list-web"
        style={{ bottom: outerTabBarHeight, paddingBottom: insets.bottom }}
        onLayout={() => {
          if (hasMeasured.current) return;
          hasMeasured.current = true;
        }}
      >
        <TabTrigger name="settings-home" href="/(tabs)/settings" asChild>
          <TabButton icon="⚙️">General</TabButton>
        </TabTrigger>
        <TabTrigger name="settings-account" href="/(tabs)/settings/account" asChild>
          <TabButton icon="👤">Account</TabButton>
        </TabTrigger>
        <TabTrigger name="settings-portfolio" href="/(tabs)/settings/portfolio" asChild>
          <TabButton icon="🖼️">Portfolio</TabButton>
        </TabTrigger>
        <TabTrigger name="settings-profile" href="/(tabs)/settings/profile" asChild>
          <TabButton icon="📄">Profile</TabButton>
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}