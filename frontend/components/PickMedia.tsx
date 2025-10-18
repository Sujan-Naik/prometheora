import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import {
  pickMedia,
  uploadMediaToS3,
  deleteMedia,
  type MediaRecord,
} from '@/utils/mediaUtils';

interface PickMediaProps {
  onMediaUploaded?: (media: MediaRecord) => void;
  onMediaDeleted?: (id: number) => void;     // 👈 new prop
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
  onMediaDeleted,
  userId,
  projectId,
  postId,
  mediaTypes = 'all',
  buttonText = 'Pick Media',
  buttonStyle,
  textStyle,
}: PickMediaProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadedMedia, setUploadedMedia] = useState<MediaRecord | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
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

        const media = await uploadMediaToS3(
          asset.uri,
          asset.fileName || `media-${Date.now()}`,
          asset.type === 'image' ? 'image/jpeg' : 'video/mp4',
          {
            userId,
            projectId,
            postId,
          }
        );

        setUploadedMedia(media);
        onMediaUploaded?.(media);
      }
    } catch (err) {
      console.error('Error picking/uploading media:', err);
      setError('Failed to upload media. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteMedia = async () => {
    if (!uploadedMedia) return;
    try {
      await deleteMedia(uploadedMedia.id);
      setUploadedMedia(null);
      setRefreshKey(prev => prev + 1);
      onMediaDeleted?.(uploadedMedia.id);     // 👈 inform parent
    } catch (err) {
      console.error('Error deleting media:', err);
      setError('Failed to delete media.');
    }
  };

  return (
    <View style={styles.container} key={refreshKey}>
      {uploadedMedia ? (
        <>
          <Image
            key={uploadedMedia.id + '-' + refreshKey}
            source={{ uri: uploadedMedia.url + `?v=${Date.now()}` }}
            style={styles.preview}
          />
          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={handleDeleteMedia}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </>
      ) : (
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
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  preview: {
    width: 180,
    height: 180,
    borderRadius: 10,
    marginVertical: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 8,
    fontSize: 14,
  },
});