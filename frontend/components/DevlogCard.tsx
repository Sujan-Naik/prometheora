import { View, TouchableOpacity, Linking } from 'react-native';
import { Text } from '@/components/ThemedText';

import { Href, Link } from 'expo-router';
import { IDevlog } from '@/types/prisma';

interface DevlogCardProps {
  devlog: IDevlog;
  onPress?: () => void;
}

export default function DevlogCard({ devlog, onPress }: DevlogCardProps) {
  const createdDate = new Date(devlog.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleBuildLink = () => {
    if (devlog.buildLink) {
      Linking.openURL(devlog.buildLink);
    }
  };

  const content = (
    <View className="card">
      <View className="card-header">
        <View className="flex-1">
          <Text className="section-title">{devlog.title}</Text>
          <Text className="date-text">{createdDate}</Text>
        </View>
        {devlog.version && (
          <View className="tag bg-blue-500">
            <Text className="tag-text">{devlog.version}</Text>
          </View>
        )}
      </View>

      <Text className="content-text" numberOfLines={4}>
        {devlog.content}
      </Text>

      {devlog.buildLink && (
        <TouchableOpacity onPress={handleBuildLink} className="button bg-success">
          <Text className="button-text">🚀 Download Build</Text>
        </TouchableOpacity>
      )}

      {devlog.project && (
        <Text className="status-text mt-2">📦 {devlog.project.title}</Text>
      )}
    </View>
  );

  if (devlog.project?.creator?.handle && !onPress) {
    return (
      <Link
        href={`/(tabs)/profile/${devlog.project.creator.handle}/projects/${devlog.project.id}` as Href}
        asChild
      >
        <TouchableOpacity activeOpacity={0.7}>{content}</TouchableOpacity>
      </Link>
    );
  }

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}