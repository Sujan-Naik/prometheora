import { TabTriggerSlotProps } from 'expo-router/ui';
import { Pressable } from 'react-native';
import { Text } from '@/components/ThemedText';


export type TabButtonProps = TabTriggerSlotProps & { icon: string; children: string };

export function TabButton({ icon, children, isFocused, ...props }: TabButtonProps) {
  return (
    <Pressable {...props} className={`tab-button ${isFocused ? 'tab-button-focused' : ''}`}>
      <Text className="tab-icon">{icon}</Text>
      <Text className={`tab-label ${isFocused ? 'tab-label-focused' : ''}`}>{children}</Text>
    </Pressable>
  );
}