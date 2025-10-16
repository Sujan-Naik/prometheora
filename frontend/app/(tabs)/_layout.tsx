import { Tabs, TabSlot, TabList, TabTrigger, TabTriggerSlotProps } from 'expo-router/ui';
import { Text, Pressable } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs>
      <TabSlot />

      <TabList className="tab-list tab-list-web tab-list-native">
        <TabTrigger name="blog" href="/(tabs)/blog" asChild>
          <TabButton icon="📝">Blog</TabButton>
        </TabTrigger>

        <TabTrigger name="patron" href="/(tabs)/patron" asChild>
          <TabButton icon="❤️">Patron</TabButton>
        </TabTrigger>

        <TabTrigger name="creator" href="/(tabs)/creator" asChild>
          <TabButton icon="✨">Creator</TabButton>
        </TabTrigger>

        <TabTrigger name="settings" href="/(tabs)/settings" asChild>
          <TabButton icon="⚙️">Settings</TabButton>
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}

type TabButtonProps = TabTriggerSlotProps & {
  icon: string;
  children: string;
};

function TabButton({ icon, children, isFocused, ...props }: TabButtonProps) {
  return (
    <Pressable
      {...props}
      className={`tab-button ${isFocused ? 'tab-button-focused' : ''}`}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
    >
      <Text className="tab-icon">{icon}</Text>
      <Text className={`tab-label ${isFocused ? 'tab-label-focused' : ''}`}>
        {children}
      </Text>
    </Pressable>
  );
}
