import { View, TouchableOpacity, Linking, Platform } from 'react-native';
import { Text } from '@/components/ThemedText';
import { Href, Link } from 'expo-router';
import { IProject, Visibility } from '@/types/prisma';
import { WebView } from 'react-native-webview';
import { useState } from 'react';
import DisplayMedia from '@/components/DisplayMedia';

interface ProjectCardProps {
  project: IProject;
  onPress?: () => void;
}

export default function ProjectCard({ project, onPress }: ProjectCardProps) {
  const [showEmbed, setShowEmbed] = useState(false);
  const thumbnail = project.media?.[0];
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

  // Check if URL is an itch.io embed URL
  const isItchEmbed = project.demoUrl?.includes('itch.io/embed');

  console.log(thumbnail)
  return (
    <View className="basic-container" >
          {thumbnail && (
            <DisplayMedia
        media={thumbnail}
        height={thumbnail.type === 'video' ? 250 : 'auto'}
        aspectRatio={16/9} // Force aspect ratio for videos
        resizeMode="cover"
        showCaption={false}
      />
          )}
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
              onPress={() => isItchEmbed ? setShowEmbed(!showEmbed) : openExternal(project.demoUrl)}
              className="action-button bg-secondary"
            >
              <Text className="action-button-text section-title">
                🚀 {isItchEmbed ? (showEmbed ? 'Hide Game' : 'Play Game') : 'Demo'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Itch.io embed - different for web vs native */}
        {isItchEmbed && showEmbed && project.demoUrl && (
          <View className="mt-4" style={{ width: '100%', maxWidth: 1200, aspectRatio: 16/9, alignSelf: 'center' }}>
            {Platform.OS === 'web' ? (
              <iframe
                key={project.demoUrl}
                src={project.demoUrl}
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
                style={{ border: 'none', display: 'block' }}
              />
            ) : (
              <WebView
                key={project.demoUrl}
                source={{ uri: project.demoUrl }}
                style={{ width: '100%', aspectRatio: 16/9 }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                scalesPageToFit={true}
                scrollEnabled={true}
                allowsFullscreenVideo={true}
                allowsInlineMediaPlayback={true}
                mediaPlaybackRequiresUserAction={false}
                mixedContentMode="always"
                originWhitelist={['*']}
              />
            )}
          </View>
        )}

        {project.creator && (
          <Text className="status-text mt-2">
            by @{project.creator.handle || 'anonymous'}
          </Text>
        )}
      </View>
  );
}