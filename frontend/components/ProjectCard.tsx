import { View, Text, TouchableOpacity, Image, Linking } from 'react-native';
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
    [Visibility.PUBLIC]: { icon: '🌐', label: 'Public', color: 'bg-success' },
    [Visibility.PATRON_ONLY]: { icon: '💎', label: 'Patron Only', color: 'bg-warning' },
    [Visibility.FOLLOWER_ONLY]: { icon: '👥', label: 'Followers', color: 'bg-blue-500' },
    [Visibility.PRIVATE]: { icon: '🔒', label: 'Private', color: 'bg-neutral' },
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
                <Text className="section-title text-blue-500">{project.title}</Text>
              </TouchableOpacity>
            </Link>
          ) : (
            <Text className="section-title">{project.title}</Text>
          )}
          <View className={`tag ${visInfo.color}`}>
            <Text className="tag-text">{visInfo.icon} {visInfo.label}</Text>
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
              <Text className="action-button-text text-blue-500">💻 Code</Text>
            </TouchableOpacity>
          )}
          {project.demoUrl && (
            <TouchableOpacity
              onPress={() => openExternal(project.demoUrl)}
              className="action-button bg-secondary"
            >
              <Text className="action-button-text text-success">🚀 Demo</Text>
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