import React from 'react';
import {View, Image, TouchableOpacity, Modal, useWindowDimensions, Platform} from 'react-native';
import { Video, ResizeMode, Audio } from 'expo-av';
import { Text } from '@/components/ThemedText';

import { IMedia } from '@/types/prisma';

interface DisplayMediaProps {
  media: IMedia;
  height?: number | string;
  width?: number;
  maxWidth?: number; // Add maxWidth prop
  aspectRatio?: number;
  showCaption?: boolean;
  resizeMode?: 'cover' | 'contain' | 'stretch';
  onPress?: () => void;
}

export default function DisplayMedia({
  media,
  height = "100%",
  width,
  maxWidth, // Will default to 30% of screen width if not provided
  aspectRatio,
  showCaption = true,
  resizeMode = 'cover',
  onPress,
}: DisplayMediaProps) {
  const [sound, setSound] = React.useState<Audio.Sound>();
  const [expanded, setExpanded] = React.useState(false);
  const [calculatedAspectRatio, setCalculatedAspectRatio] = React.useState<number | undefined>(aspectRatio);
  const windowDimensions = useWindowDimensions();

  // Default maxWidth to 30% of viewport width

  let effectiveMaxWidth = maxWidth ?? windowDimensions.width * 0.1;

      if (Platform.OS !== 'web') {
        effectiveMaxWidth = maxWidth ?? windowDimensions.width;
      }

  // Calculate aspect ratio from image dimensions
  React.useEffect(() => {
    if (media.type === 'image' && media.url && !aspectRatio) {
      Image.getSize(
        media.url,
        (imgWidth, imgHeight) => {
          setCalculatedAspectRatio( imgWidth / imgHeight);
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
      // const expandedHeight = windowDimensions.height;
      // const expandedWidth = calculatedAspectRatio
      //   ? expandedHeight / calculatedAspectRatio
      //   : windowDimensions.width * 0.75;

      let expandedWidth = windowDimensions.width;
      // const expandedHeight = calculatedAspectRatio ? expandedWidth / calculatedAspectRatio : windowDimensions.width * 0.75;
      let expandedHeight = expandedWidth / calculatedAspectRatio!;



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
              // className="media-preview"
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

    // For normal view, use aspectRatio style prop with maxWidth constraint
    const normalStyle: any = { height };

    if (width) {
      normalStyle.width = Math.min(width, effectiveMaxWidth);
    } else if (calculatedAspectRatio) {
      normalStyle.aspectRatio = calculatedAspectRatio;
      normalStyle.maxWidth = effectiveMaxWidth;
    } else {
      normalStyle.width = Math.min(300, effectiveMaxWidth); // Fallback width
    }

    switch (media.type) {
      case 'image':
        return (
          <TouchableOpacity onPress={handlePress} activeOpacity={0.8} className={'flex-row justify-center'}>
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
            style={{ height, width: 100 } as any}
            onPress={playAudio}
          >
            <Text className="text-4xl mb-2">🎵</Text>
            <Text className="text-base text-gray-800">Tap to play audio</Text>
          </TouchableOpacity>
        );
      default:
        return (
          <View className="file-container" style={{ height, width: 100 } as any}>
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