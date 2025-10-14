import { View, Text, Button } from 'react-native';
import { Link } from 'expo-router';

export default function Home() {
  return (
    <View>
      <Text>Home / Discover</Text>
      <Link href="/creator/johndoe">View Example Creator</Link>
      <Link href="/blog">Go to Blog</Link>
    </View>
  );
}