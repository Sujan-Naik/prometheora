import { View, ActivityIndicator, Text } from 'react-native';

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