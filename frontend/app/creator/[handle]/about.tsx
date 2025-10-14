import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function CreatorAbout() {
  const { handle } = useLocalSearchParams();
  return (
    <View>
      <Text>About {handle}</Text>
    </View>
  );
}