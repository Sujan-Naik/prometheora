import React, { useState } from 'react';
import { View, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ThemedText';

import { pickMedia, uploadMediaToS3, deleteMedia, type MediaRecord } from '@/utils/mediaUtils';

interface PickMediaProps {
  onMediaUploaded?: (media: MediaRecord) => void;
  onMediaDeleted?: (id: number) => void;
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
      onMediaDeleted?.(uploadedMedia.id);
    } catch (err) {
      console.error('Error deleting media:', err);
      setError('Failed to delete media.');
    }
  };

  return (
    <View className="media-container items-center" key={refreshKey}>
      {uploadedMedia ? (
        <>
          <Image
            key={uploadedMedia.id + '-' + refreshKey}
            source={{ uri: uploadedMedia.url + `?v=${Date.now()}` }}
            className="w-48 h-48 rounded-lg mt-2"
          />
          <TouchableOpacity
            className="button bg-error"
            onPress={handleDeleteMedia}
          >
            <Text className="button-text">Delete</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          className={`button ${uploading ? 'button-disabled' : ''}`}
          style={buttonStyle}
          onPress={handlePickMedia}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator color="var(--header-text-color)" />
          ) : (
            <Text className="button-text" style={textStyle}>
              {buttonText}
            </Text>
          )}
        </TouchableOpacity>
      )}
      {error && <Text className="error-text">{error}</Text>}
    </View>
  );
}