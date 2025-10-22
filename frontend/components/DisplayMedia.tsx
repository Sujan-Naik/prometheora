import React from 'react';
import { View, Image, TouchableOpacity, Text, Modal, useWindowDimensions } from 'react-native';
import { Video, ResizeMode, Audio } from 'expo-av';
import { IMedia } from '@/types/prisma';

interface DisplayMediaProps {
  media: IMedia;
  width?: number | string;
  height?: number;
  maxHeight?: number; // Add maxHeight prop
  aspectRatio?: number;
  showCaption?: boolean;
  resizeMode?: 'cover' | 'contain' | 'stretch';
  onPress?: () => void;
}

export default function DisplayMedia({
  media,
  width = "100%",
  height,
  maxHeight, // Will default to 30% of screen height if not provided
  aspectRatio,
  showCaption = true,
  resizeMode = 'cover',
  onPress,
}: DisplayMediaProps) {
  const [sound, setSound] = React.useState<Audio.Sound>();
  const [expanded, setExpanded] = React.useState(false);
  const [calculatedAspectRatio, setCalculatedAspectRatio] = React.useState<number | undefined>(aspectRatio);
  const windowDimensions = useWindowDimensions();

  // Default maxHeight to 30% of viewport height
  const effectiveMaxHeight = maxHeight ?? windowDimensions.height * 0.3;

  // Calculate aspect ratio from image dimensions
  React.useEffect(() => {
    if (media.type === 'image' && media.url && !aspectRatio) {
      Image.getSize(
        media.url,
        (imgWidth, imgHeight) => {
          setCalculatedAspectRatio(imgWidth / imgHeight);
        },
        () => {
          setCalculatedAspectRatio(16 / 9); // Fallback aspect ratio
        }
      );
    }
  }, [media.url, media.type, aspectRatio]);

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
    // For expanded view, use full window dimensions
    if (isExpanded) {
      const expandedWidth = windowDimensions.width;
      const expandedHeight = calculatedAspectRatio
        ? expandedWidth / calculatedAspectRatio
        : windowDimensions.height * 0.75;

      const displayStyle = {
        width: expandedWidth,
        height: Math.min(expandedHeight, windowDimensions.height * 0.9),
      };

      switch (media.type) {
        case 'image':
          return (
            <Image
              source={{ uri: media.url }}
              className="media-preview"
              style={displayStyle}
              resizeMode={resizeMode}
            />
          );
        case 'video':
          return (
            <Video
              source={{ uri: media.url }}
              className="media-preview"
              style={displayStyle}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              isLooping
            />
          );
      }
    }

    // For normal view, use aspectRatio style prop with maxHeight constraint
    const normalStyle: any = { width };

    if (height) {
      normalStyle.height = Math.min(height, effectiveMaxHeight);
    } else if (calculatedAspectRatio) {
      normalStyle.aspectRatio = calculatedAspectRatio;
      normalStyle.maxHeight = effectiveMaxHeight;
    } else {
      normalStyle.height = Math.min(300, effectiveMaxHeight); // Fallback height
    }

    switch (media.type) {
      case 'image':
        return (
          <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
            <Image
              source={{ uri: media.url }}
              className="media-preview"
              style={normalStyle}
              resizeMode={resizeMode}
            />
          </TouchableOpacity>
        );
      case 'video':
        return (
          <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
            <Video
              source={{ uri: media.url }}
              className="media-preview"
              style={normalStyle}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              isLooping
            />
          </TouchableOpacity>
        );
      case 'audio':
        return (
          <TouchableOpacity
            className="audio-container"
            style={{ width, height: 100 } as any}
            onPress={playAudio}
          >
            <Text className="text-4xl mb-2">🎵</Text>
            <Text className="text-base text-gray-800">Tap to play audio</Text>
          </TouchableOpacity>
        );
      default:
        return (
          <View className="file-container" style={{ width, height: 100 } as any}>
            <Text className="text-4xl mb-2">📄</Text>
            <Text className="text-sm text-gray-600 text-center">
              File: {media.url.split('/').pop()}
            </Text>
          </View>
        );
    }
  };

  return (
    <View className="media-container">
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