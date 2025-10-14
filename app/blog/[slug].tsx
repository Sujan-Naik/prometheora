import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function BlogPost() {
  const { slug } = useLocalSearchParams();
  return (
    <View>
      <Text>Blog Post: {slug}</Text>
    </View>
  );
}