import { TabTriggerSlotProps } from 'expo-router/ui';
import { Pressable, Text } from 'react-native';

export type TabButtonProps = TabTriggerSlotProps & { icon: string; children: string };

export function TabButton({ icon, children, isFocused, ...props }: TabButtonProps) {
  return (
    <Pressable {...props} className={`tab-button ${isFocused ? 'tab-button-focused' : ''}`}>
      <Text className="tab-icon">{icon}</Text>
      <Text className={`tab-label ${isFocused ? 'tab-label-focused' : ''}`}>{children}</Text>
    </Pressable>
  );
}