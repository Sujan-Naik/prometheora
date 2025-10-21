import React from 'react';
import { View, Image, TouchableOpacity, Text, Modal, Dimensions } from 'react-native';
import { Video, ResizeMode, Audio } from 'expo-av';
import { IMedia } from '@/types/prisma';

interface DisplayMediaProps {
  media: IMedia;
  width?: number;
  height?: number;
  showCaption?: boolean;
  resizeMode?: 'cover' | 'contain' | 'stretch';
  onPress?: () => void;
}

export default function DisplayMedia({
  media,
  width = Dimensions.get('window').width,
  height = 300,
  showCaption = true,
  resizeMode = 'cover',
  onPress,
}: DisplayMediaProps) {
  const [sound, setSound] = React.useState<Audio.Sound>();
  const [expanded, setExpanded] = React.useState(false);
  const [expandedSize, setExpandedSize] = React.useState<{ width: number; height: number }>({
    width,
    height: Dimensions.get('window').height * 0.75,
  });

  React.useEffect(() => {
    if (media.type === 'image' && media.url) {
      Image.getSize(
        media.url,
        (imgWidth, imgHeight) => {
          const screenWidth = Dimensions.get('window').width;
          const ratio = imgHeight / imgWidth;
          setExpandedSize({
            width: screenWidth,
            height: screenWidth * ratio,
          });
        },
        () =>
          setExpandedSize({
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height * 0.75,
          })
      );
    }
  }, [media.url, media.type]);

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
    const displayWidth = isExpanded ? expandedSize.width : width;
    const displayHeight = isExpanded ? expandedSize.height : height;

    switch (media.type) {
      case 'image':
        return (
          <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
            <Image
              source={{ uri: media.url }}
              className="media-preview"
              style={{ width: displayWidth, height: displayHeight }}
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
              style={{ width: displayWidth, height: displayHeight }}
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
            style={{ width, height: 100 }}
            onPress={playAudio}
          >
            <Text className="text-4xl mb-2">🎵</Text>
            <Text className="text-base text-gray-800">Tap to play audio</Text>
          </TouchableOpacity>
        );

      default:
        return (
          <View className="file-container" style={{ width, height: 100 }}>
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