import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl || process.env.EXPO_PUBLIC_API_URL;

export interface MediaRecord {
  id: number;
  url: string;
  type?: string;
  caption?: string;
  order?: number;
  createdAt: string;
  userId?: number;
  projectId?: number;
  postId?: number;
}

export interface PickMediaOptions {
  mediaTypes?: 'images' | 'videos' | 'all';
  allowsMultipleSelection?: boolean;
  quality?: number;
}

/**
 * Pick media from the device's library
 */
export async function pickMedia(options: PickMediaOptions = {}): Promise<ImagePicker.ImagePickerAsset[] | null> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (status !== 'granted') {
    alert('Sorry, we need camera roll permissions to make this work!');
    return null;
  }

  const mediaTypeMap = {
    images: ImagePicker.MediaTypeOptions.Images,
    videos: ImagePicker.MediaTypeOptions.Videos,
    all: ImagePicker.MediaTypeOptions.All,
  };

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: mediaTypeMap[options.mediaTypes || 'all'],
    allowsMultipleSelection: options.allowsMultipleSelection || false,
    quality: options.quality || 0.8,
  });

  if (!result.canceled) {
    return result.assets;
  }

  return null;
}

/**
 * Pick any document/file from the device
 */
export async function pickDocument(): Promise<DocumentPicker.DocumentPickerAsset | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type: '*/*',
    copyToCacheDirectory: true,
  });

  if (!result.canceled && result.assets.length > 0) {
    return result.assets[0];
  }

  return null;
}

/**
 * Upload media to S3 via backend
 */
export async function uploadMediaToS3(
  fileUri: string,
  fileName: string,
  mimeType: string,
  options: {
    userId?: number;
    projectId?: number;
    postId?: number;
    caption?: string;
    order?: number;
  } = {},
): Promise<MediaRecord> {
  const formData = new FormData();

  // Create file object for upload
  const file = {
    uri: fileUri,
    type: mimeType,
    name: fileName,
  } as any;

  formData.append('file', file);

  if (options.userId) formData.append('userId', options.userId.toString());
  if (options.projectId) formData.append('projectId', options.projectId.toString());
  if (options.postId) formData.append('postId', options.postId.toString());
  if (options.caption) formData.append('caption', options.caption);
  if (options.order !== undefined) formData.append('order', options.order.toString());

  try {
    const response = await fetch(`${API_URL}/media/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading media:', error);
    throw error;
  }
}

/**
 * Save a media record to the backend (when URL already exists)
 */
export async function saveMediaRecord(data: {
  url: string;
  type?: string;
  caption?: string;
  order?: number;
  userId?: number;
  projectId?: number;
  postId?: number;
}): Promise<MediaRecord> {
  try {
    const response = await fetch(`${API_URL}/media`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to save media record: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving media record:', error);
    throw error;
  }
}

/**
 * Fetch media records from the backend
 */
export async function fetchMedia(filters?: {
  userId?: number;
  projectId?: number;
  postId?: number;
}): Promise<MediaRecord[]> {
  const params = new URLSearchParams();
  if (filters?.userId) params.append('userId', filters.userId.toString());
  if (filters?.projectId) params.append('projectId', filters.projectId.toString());
  if (filters?.postId) params.append('postId', filters.postId.toString());

  try {
    const response = await fetch(`${API_URL}/media?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch media: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching media:', error);
    throw error;
  }
}

/**
 * Delete a media record
 */
export async function deleteMedia(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/media/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete media: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting media:', error);
    throw error;
  }
}

/**
 * Update media metadata
 */
export async function updateMedia(
  id: number,
  data: { caption?: string; order?: number },
): Promise<MediaRecord> {
  try {
    const response = await fetch(`${API_URL}/media/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update media: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating media:', error);
    throw error;
  }
}