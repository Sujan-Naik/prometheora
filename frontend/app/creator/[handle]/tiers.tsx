import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function CreatorTiers() {
  const { handle } = useLocalSearchParams();
  return (
    <View>
      <Text>{handle}'s Support Tiers</Text>
    </View>
  );
}