import { useRef } from 'react';
import { View } from 'react-native';
import { Tabs, TabSlot, TabList, TabTrigger } from 'expo-router/ui';
import { TabButton } from '@/components/TabButton';
import { useTabBarHeight } from '@/context/TabBarHeightContext';

export default function PatronLayout() {
  const { getTotalHeight } = useTabBarHeight();
  const hasMeasured = useRef(false);

  return (
    <Tabs>
      <View><TabSlot /></View>
      <TabList
        className="tab-list tab-list-web"
        style={{ bottom: getTotalHeight('outer') }}
        onLayout={() => {
          if (hasMeasured.current) return;
          hasMeasured.current = true;
        }}
      >
        <TabTrigger name="patron-home" href="/(tabs)/patron" asChild>
          <TabButton icon="🎁">Overview</TabButton>
        </TabTrigger>
        <TabTrigger name="patron-followed" href="/(tabs)/patron/followed-projects" asChild>
          <TabButton icon="📦">Followed</TabButton>
        </TabTrigger>
        <TabTrigger name="patron-subscriptions" href="/(tabs)/patron/subscriptions" asChild>
          <TabButton icon="💳">Subscriptions</TabButton>
        </TabTrigger>
        <TabTrigger name="patron-payments" href="/(tabs)/patron/payments" asChild>
          <TabButton icon="💰">Payments</TabButton>
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}