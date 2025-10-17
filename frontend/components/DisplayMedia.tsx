import React from 'react';
import { View, Image, StyleSheet, Text, Dimensions, TouchableOpacity } from 'react-native';
import { Video, ResizeMode , Audio } from 'expo-av';
import {IMedia} from "@/types/prisma";

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

  React.useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const playAudio = async () => {
    if (media.type === 'audio') {
      const { sound: audioSound } = await Audio.Sound.createAsync(
        { uri: media.url },
        { shouldPlay: true }
      );
      setSound(audioSound);
    }
  };

  const renderMedia = () => {
    switch (media.type) {
      case 'image':
        return (
          <TouchableOpacity onPress={onPress} activeOpacity={onPress ? 0.7 : 1}>
            <Image
              source={{ uri: media.url }}
              style={[styles.media, { width, height }]}
              resizeMode={resizeMode}
            />
          </TouchableOpacity>
        );

      case 'video':
        return (
          <Video
            source={{ uri: media.url }}
            style={[styles.media, { width, height }]}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            isLooping
          />
        );

      case 'audio':
        return (
          <TouchableOpacity
            style={[styles.audioContainer, { width, height: 100 }]}
            onPress={playAudio}
          >
            <Text style={styles.audioIcon}>🎵</Text>
            <Text style={styles.audioText}>Tap to play audio</Text>
          </TouchableOpacity>
        );

      default:
        return (
          <View style={[styles.fileContainer, { width, height: 100 }]}>
            <Text style={styles.fileIcon}>📄</Text>
            <Text style={styles.fileText}>File: {media.url.split('/').pop()}</Text>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      {renderMedia()}
      {showCaption && media.caption && (
        <Text style={styles.caption}>{media.caption}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  media: {
    borderRadius: 8,
  },
  audioContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  audioText: {
    fontSize: 16,
    color: '#333',
  },
  fileContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  fileIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  fileText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  caption: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    paddingHorizontal: 4,
  },
});