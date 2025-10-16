import { Tabs, TabSlot, TabList, TabTrigger, TabTriggerSlotProps } from 'expo-router/ui';
import { Text, Pressable } from 'react-native';

export default function PatronLayout() {
  return (
    <Tabs>
      <TabSlot />
      <TabList className="tab-list tab-list-web tab-list-native">
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

type TabButtonProps = TabTriggerSlotProps & { icon: string; children: string; };

function TabButton({ icon, children, isFocused, ...props }: TabButtonProps) {
  return (
    <Pressable {...props} className={`tab-button ${isFocused ? 'tab-button-focused' : ''}`}>
      <Text className="tab-icon">{icon}</Text>
      <Text className={`tab-label ${isFocused ? 'tab-label-focused' : ''}`}>{children}</Text>
    </Pressable>
  );
}
