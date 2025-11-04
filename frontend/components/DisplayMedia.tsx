import React from 'react';
import {View, Image, TouchableOpacity, Modal, useWindowDimensions, Platform} from 'react-native';
import { Video, ResizeMode, Audio, AVPlaybackStatus } from 'expo-av';
import { Text } from '@/components/ThemedText';

import { IMedia } from '@/types/prisma';

interface DisplayMediaProps {
  media: IMedia;
  maxWidth?: number;
  aspectRatio?: number;
  showCaption?: boolean;
  resizeMode?: 'cover' | 'contain' | 'stretch';
  onPress?: () => void;
}

export default function DisplayMedia({
  media,
  maxWidth,
  aspectRatio,
  showCaption = true,
  resizeMode = 'cover',
  onPress,
}: DisplayMediaProps) {
  const [sound, setSound] = React.useState<Audio.Sound>();
  const [expanded, setExpanded] = React.useState(false);
  const [calculatedAspectRatio, setCalculatedAspectRatio] = React.useState<number | undefined>(aspectRatio);
  const windowDimensions = useWindowDimensions();
  const videoRef = React.useRef<Video>(null);

  // Calculate aspect ratio from image dimensions
  React.useEffect(() => {
    if (media.type === 'image' && media.url && !aspectRatio) {
      Image.getSize(
        media.url,
        (imgWidth, imgHeight) => {
          setCalculatedAspectRatio(imgWidth / imgHeight);
        },
        () => {
          setCalculatedAspectRatio(16 / 9);
        }
      );
    }
  }, [media.url, media.type, aspectRatio]);

  // Get video dimensions when video loads
  const handleVideoLoad = (status: AVPlaybackStatus) => {
    if (status.isLoaded && !aspectRatio && !calculatedAspectRatio) {
      // Try to get natural size if available (web)
      const statusAny = status as any;
      if (statusAny.naturalSize?.width && statusAny.naturalSize?.height) {
        setCalculatedAspectRatio(statusAny.naturalSize.width / statusAny.naturalSize.height);
      } else {
        // Fallback to 16:9 for native or if dimensions not available
        setCalculatedAspectRatio(16 / 9);
      }
    }
  };

  React.useEffect(() => {
    return () => {
      if (sound) sound.unloadAsync().catch(() => {});
    };
  }, [sound]);

  const playAudio = async () => {
    if (media.type === 'audio') {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: media.url },
        { shouldPlay: true }
      );
      setSound(newSound);
    }
  };

  const handlePress = () => {
    if (media.type === 'image' || media.type === 'video') {
      setExpanded(true);
    } else if (onPress) {
      onPress();
    }
  };

  const renderMedia = (isExpanded = false) => {
    if (isExpanded) {
      let expandedWidth = windowDimensions.width;
      let expandedHeight = expandedWidth / (calculatedAspectRatio || 16/9);

      let displayStyle = {
        height: expandedHeight,
        width: Math.min(expandedWidth, windowDimensions.width)
      };

      if (calculatedAspectRatio && calculatedAspectRatio < 1){
        expandedHeight = windowDimensions.height;
        expandedWidth = expandedHeight * calculatedAspectRatio;

        displayStyle = {
          width: expandedWidth,
          height: Math.min(expandedHeight, windowDimensions.height)
        }
      }

      switch (media.type) {
        case 'image':
          return (
            <Image
              source={{ uri: media.url }}
              style={displayStyle}
              resizeMode={resizeMode}
            />
          );
        case 'video':
          return (
            <Video
              ref={videoRef}
              source={{ uri: media.url }}
              style={displayStyle}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              isLooping
              onLoad={handleVideoLoad}
            />
          );
      }
    }

    // For normal view - YouTube style: full width, auto height based on aspect ratio
    const normalStyle: any = {
      width: '100%',
    };

    if (calculatedAspectRatio) {
      normalStyle.aspectRatio = calculatedAspectRatio;
    } else {
      // Default fallback while loading
      normalStyle.aspectRatio = 16 / 9;
    }

    switch (media.type) {
      case 'image':
        return (
          <TouchableOpacity onPress={handlePress} activeOpacity={0.8} style={{ width: '100%' }}>
            <Image
              source={{ uri: media.url }}
              style={normalStyle}
              resizeMode={resizeMode}
            />
          </TouchableOpacity>
        );
      case 'video':
        return (
          <TouchableOpacity onPress={handlePress} activeOpacity={0.8} style={{ width: '100%' }}>
            <Video
              ref={videoRef}
              source={{ uri: media.url }}
              style={normalStyle}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              isLooping
              onLoad={handleVideoLoad}
            />
          </TouchableOpacity>
        );
      case 'audio':
        return (
          <TouchableOpacity
            className="audio-container"
            style={{ height: 100, width: '100%' } as any}
            onPress={playAudio}
          >
            <Text className="text-4xl mb-2">🎵</Text>
            <Text className="text-base text-gray-800">Tap to play audio</Text>
          </TouchableOpacity>
        );
      default:
        return (
          <View className="file-container" style={{ height: 100, width: '100%' } as any}>
            <Text className="text-4xl mb-2">📄</Text>
            <Text className="text-sm text-gray-600 text-center">
              File: {media.url.split('/').pop()}
            </Text>
          </View>
        );
    }
  };

  return (
    <View className="media-container" style={{ width: '100%',  }}>
      {renderMedia()}
      {showCaption && media.caption && (
        <Text className="content-text">{media.caption}</Text>
      )}
      <Modal visible={expanded} transparent animationType="fade">
        <View className="modal-background">
          <TouchableOpacity className="modal-close" onPress={() => setExpanded(false)}>
            <Text className="close-text">✕</Text>
          </TouchableOpacity>
          {renderMedia(true)}
        </View>
      </Modal>
    </View>
  );
}