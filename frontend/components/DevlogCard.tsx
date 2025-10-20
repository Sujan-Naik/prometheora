// components/DevlogCard.tsx
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import {Href, Link} from 'expo-router';  // Add this import
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
    <View className="bg-white rounded-lg p-4 mb-3 border border-gray-200">
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#000', marginBottom: 4 }}>
            {devlog.title}
          </Text>
          <Text style={{ fontSize: 12, color: '#666' }}>
            {createdDate}
          </Text>
        </View>
        {devlog.version && (
          <View
            style={{
              backgroundColor: '#007aff',
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 12,
              marginLeft: 8,
            }}
          >
            <Text style={{ fontSize: 10, color: '#fff', fontWeight: '600' }}>
              {devlog.version}
            </Text>
          </View>
        )}
      </View>

      <Text
        style={{ fontSize: 14, color: '#333', marginTop: 12, lineHeight: 20 }}
        numberOfLines={4}
      >
        {devlog.content}
      </Text>

      {devlog.buildLink && (
        <TouchableOpacity
          onPress={handleBuildLink}
          style={{
            marginTop: 12,
            backgroundColor: '#34c759',
            padding: 10,
            borderRadius: 8,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>
            🚀 Download Build
          </Text>
        </TouchableOpacity>
      )}

      {devlog.project && (
        <Text style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
          📦 {devlog.project.title}
        </Text>
      )}
    </View>
  );

  // If devlog has a project with creator handle, link to the project (similar to ProjectCard)
  if (devlog.project?.creator?.handle && !onPress) {
    return (
      <Link
        href={`/(tabs)/profile/${devlog.project.creator.handle}/projects/${devlog.project.id}` as Href}
        asChild
      >
        <TouchableOpacity activeOpacity={0.7}>
          {content}
        </TouchableOpacity>
      </Link>
    );
  }

  // Fallback to custom onPress or no link
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}