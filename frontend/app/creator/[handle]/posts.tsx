import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function CreatorPosts() {
  const { handle } = useLocalSearchParams();
  return (
    <View>
      <Text>{handle}'s Posts</Text>
    </View>
  );
}