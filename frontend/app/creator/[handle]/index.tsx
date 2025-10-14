import { View, Text, Button } from 'react-native';
import { useLocalSearchParams, Link } from 'expo-router';

export default function CreatorProfile() {
  const { handle } = useLocalSearchParams();
  return (
    <View>
      <Text>Creator Profile: {handle}</Text>
      <Link href={`/creator/${handle}/posts`}>View Posts</Link>
      <Link href={`/creator/${handle}/tiers`}>View Support Tiers</Link>
    </View>
  );
}