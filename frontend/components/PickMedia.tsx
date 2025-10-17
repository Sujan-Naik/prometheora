import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { pickMedia, uploadMediaToS3, type MediaRecord } from '@/utils/mediaUtils';

interface PickMediaProps {
  onMediaUploaded?: (media: MediaRecord) => void;
  userId?: number;
  projectId?: number;
  postId?: number;
  mediaTypes?: 'images' | 'videos' | 'all';
  buttonText?: string;
  buttonStyle?: object;
  textStyle?: object;
}

export default function PickMedia({
  onMediaUploaded,
  userId,
  projectId,
  postId,
  mediaTypes = 'all',
  buttonText = 'Pick Media',
  buttonStyle,
  textStyle,
}: PickMediaProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePickMedia = async () => {
    try {
      setError(null);
      setUploading(true);

      const assets = await pickMedia({
        mediaTypes,
        allowsMultipleSelection: false,
        quality: 0.8,
      });

      if (assets && assets.length > 0) {
        const asset = assets[0];

        // Upload to S3
        const mediaRecord = await uploadMediaToS3(
          asset.uri,
          asset.fileName || `media-${Date.now()}`,
          asset.type === 'image' ? 'image/jpeg' : 'video/mp4',
          {
            userId,
            projectId,
            postId,
          }
        );

        if (onMediaUploaded) {
          onMediaUploaded(mediaRecord);
        }
      }
    } catch (err) {
      console.error('Error picking/uploading media:', err);
      setError('Failed to upload media. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, buttonStyle, uploading && styles.buttonDisabled]}
        onPress={handlePickMedia}
        disabled={uploading}
      >
        {uploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={[styles.buttonText, textStyle]}>{buttonText}</Text>
        )}
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    marginTop: 8,
    fontSize: 14,
  },
});