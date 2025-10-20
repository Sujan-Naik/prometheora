// components/ProjectCard.tsx
import { View, Text, TouchableOpacity, Image, Linking } from 'react-native';
import {Href, Link} from 'expo-router';
import { IProject, Visibility } from '@/types/prisma';

interface ProjectCardProps {
  project: IProject;
  onPress?: () => void;
}

export default function ProjectCard({ project, onPress }: ProjectCardProps) {
  const thumbnail = project.media?.[0]?.url;
  const followerCount = project.followers?.length || 0;

  const visibilityConfig = {
    [Visibility.PUBLIC]: { icon: '🌐', label: 'Public', color: '#34c759' },
    [Visibility.PATRON_ONLY]: { icon: '💎', label: 'Patron Only', color: '#ff9500' },
    [Visibility.FOLLOWER_ONLY]: { icon: '👥', label: 'Followers', color: '#007aff' },
    [Visibility.PRIVATE]: { icon: '🔒', label: 'Private', color: '#8e8e93' },
  };

  const visInfo = visibilityConfig[project.visibility];

  const openExternal = (url?: string | null | undefined) => {
    if (url) Linking.openURL(url);
  };

  return (
    <View className="bg-white rounded-lg overflow-hidden mb-4 border border-gray-200">
      {thumbnail && (
        <Image
          source={{ uri: thumbnail }}
          style={{ width: '100%', height: 200 }}
          resizeMode="cover"
        />
      )}

      <View style={{ padding: 16 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          {project.creator?.handle ? (
            <Link
  href={`/profile/${project.creator.handle}/projects/${project.id}` as Href}            >
              <TouchableOpacity activeOpacity={0.7}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: '700',
                    flex: 1,
                    color: '#007aff',
                  }}
                >
                  {project.title}
                </Text>
              </TouchableOpacity>
            </Link>
          ) : (
            <Text style={{ fontSize: 20, fontWeight: '700', flex: 1, color: '#000' }}>
              {project.title}
            </Text>
          )}

          <View
            style={{
              backgroundColor: visInfo.color,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 12,
              marginLeft: 8,
            }}
          >
            <Text style={{ fontSize: 10, color: '#fff', fontWeight: '600' }}>
              {visInfo.icon} {visInfo.label}
            </Text>
          </View>
        </View>

        <Text
          style={{ fontSize: 14, color: '#666', marginTop: 8, lineHeight: 20 }}
          numberOfLines={3}
        >
          {project.description}
        </Text>

        <View style={{ flexDirection: 'row', marginTop: 12, gap: 12 }}>
          {project.status && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 12, color: '#666' }}>📊 {project.status}</Text>
            </View>
          )}
          {followerCount > 0 && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 12, color: '#666' }}>
                ❤️ {followerCount} follower{followerCount !== 1 ? 's' : ''}
              </Text>
            </View>
          )}
        </View>

        <View style={{ flexDirection: 'row', marginTop: 12, gap: 8 }}>
          {project.repoUrl && (
            <TouchableOpacity
              onPress={() => openExternal(project.repoUrl)}
              style={{
                backgroundColor: '#f0f0f0',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 6,
              }}
            >
              <Text style={{ fontSize: 11, color: '#007aff' }}>💻 Code</Text>
            </TouchableOpacity>
          )}
          {project.demoUrl && (
            <TouchableOpacity
              onPress={() => openExternal(project.demoUrl)}
              style={{
                backgroundColor: '#f0f0f0',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 6,
              }}
            >
              <Text style={{ fontSize: 11, color: '#34c759' }}>🚀 Demo</Text>
            </TouchableOpacity>
          )}
        </View>

        {project.creator && (
          <Text style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
            by @{project.creator.handle || 'anonymous'}
          </Text>
        )}
      </View>
    </View>
  );
}
