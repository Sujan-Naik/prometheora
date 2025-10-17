import { Tabs, TabSlot, TabList, TabTrigger, TabTriggerSlotProps } from 'expo-router/ui';
import { Text, Pressable } from 'react-native';
import {TabButton} from "@/components/TabButton";

export default function SettingsLayout() {
  return (
    <Tabs>
      <TabSlot />
      <TabList className="tab-list tab-list-web tab-list-native">
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

