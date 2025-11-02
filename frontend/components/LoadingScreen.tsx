import { View, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ThemedText';

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message = 'Loading...' }: LoadingScreenProps) {
  return (
    <View className="loading-container">
      <ActivityIndicator size="large" color="var(--primary-color)" />
      <Text className="loading-text">{message}</Text>
    </View>
  );
}