import { View, TouchableOpacity, Image, Linking } from 'react-native';
import { Text } from '@/components/ThemedText';

import { Href, Link } from 'expo-router';
import { IProject, Visibility } from '@/types/prisma';

interface ProjectCardProps {
  project: IProject;
  onPress?: () => void;
}

export default function ProjectCard({ project, onPress }: ProjectCardProps) {
  const thumbnail = project.media?.[0]?.url;
  const followerCount = project.followers?.length || 0;

  const visibilityConfig = {
    [Visibility.PUBLIC]: { icon: '🌐', label: 'Public' },
    [Visibility.PATRON_ONLY]: { icon: '💎', label: 'Patron Only' },
    [Visibility.FOLLOWER_ONLY]: { icon: '👥', label: 'Followers'},
    [Visibility.PRIVATE]: { icon: '🔒', label: 'Private'},
  };

  const visInfo = visibilityConfig[project.visibility];

  const openExternal = (url?: string | null | undefined) => {
    if (url) Linking.openURL(url);
  };

  return (
    <View className="basic-container">
      {thumbnail && (
        <Image source={{ uri: thumbnail }} className="media-preview" resizeMode="cover" />
      )}

      <View className="p-4">
        <View className="card-header">
          {project.creator?.handle ? (
            <Link href={`/profile/${project.creator.handle}/projects/${project.id}` as Href}>
              <TouchableOpacity activeOpacity={0.7}>
                <Text className="section-title ">{project.title}</Text>
              </TouchableOpacity>
            </Link>
          ) : (
            <Text className="section-title">{project.title}</Text>
          )}
          <View className={`tag`}>
            <Text className="tag-text ">{visInfo.icon} {visInfo.label}</Text>
          </View>
        </View>

        <Text className="content-text" numberOfLines={3}>
          {project.description}
        </Text>

        <View className="flex-row mt-3 gap-3">
          {project.status && (
            <View className="flex-row items-center">
              <Text className="status-text">📊 {project.status}</Text>
            </View>
          )}
          {followerCount > 0 && (
            <View className="flex-row items-center">
              <Text className="status-text">
                ❤️ {followerCount} follower{followerCount !== 1 ? 's' : ''}
              </Text>
            </View>
          )}
        </View>

        <View className="action-container">
          {project.repoUrl && (
            <TouchableOpacity
              onPress={() => openExternal(project.repoUrl)}
              className="action-button bg-secondary"
            >
              <Text className="action-button-text section-title">💻 Code</Text>
            </TouchableOpacity>
          )}
          {project.demoUrl && (
            <TouchableOpacity
              onPress={() => openExternal(project.demoUrl)}
              className="action-button bg-secondary"
            >
              <Text className="action-button-text section-title">🚀 Demo</Text>
            </TouchableOpacity>
          )}
        </View>

        {project.creator && (
          <Text className="status-text mt-2">
            by @{project.creator.handle || 'anonymous'}
          </Text>
        )}
      </View>
    </View>
  );
}