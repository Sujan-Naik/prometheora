import { View, Text } from 'react-native';
import { Link } from 'expo-router';

export default function BlogIndex() {
  return (
    <View>
      <Text>Blog</Text>
      <Link href="/blog/first-post">Go to Example Post</Link>
    </View>
  );
}