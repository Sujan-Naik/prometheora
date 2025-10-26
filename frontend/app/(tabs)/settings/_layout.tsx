import { useRef } from 'react';
import { View } from 'react-native';
import { Tabs, TabSlot, TabList, TabTrigger } from 'expo-router/ui';
import { TabButton } from '@/components/TabButton';
import { useTabBarHeight } from '@/context/TabBarHeightContext';

export default function SettingsLayout() {
  const { getTotalHeight } = useTabBarHeight();
  const hasMeasured = useRef(false);

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
        <TabTrigger name="settings-home" href="/(tabs)/settings" asChild>
          <TabButton className={"font-sans"} icon="⚙️">General</TabButton>
        </TabTrigger>
        <TabTrigger name="settings-account" href="/(tabs)/settings/account" asChild>
          <TabButton className={"font-sans"} icon="👤">Account</TabButton>
        </TabTrigger>
        <TabTrigger name="settings-portfolio" href="/(tabs)/settings/portfolio" asChild>
          <TabButton className={"font-sans"} icon="🖼️">Portfolio</TabButton>
        </TabTrigger>
        <TabTrigger name="settings-profile" href="/(tabs)/settings/profile" asChild>
          <TabButton className={"font-sans"} icon="📄">Profile</TabButton>
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}