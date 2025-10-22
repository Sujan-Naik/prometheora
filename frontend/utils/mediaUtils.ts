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
  let file: any;

  // On native (iOS/Android)
  if (fileUri.startsWith('file://') || fileUri.startsWith('content://')) {
    file = { uri: fileUri, name: fileName, type: mimeType };
  } else {
    // On web: convert to a File rather than Blob (Blob.name is read-only)
    const blob = await (await fetch(fileUri)).blob();
    file = new File([blob], fileName, { type: mimeType });
  }

  formData.append('file', file);

  if (options.userId) formData.append('userId', String(options.userId));
  if (options.projectId) formData.append('projectId', String(options.projectId));
  if (options.postId) formData.append('postId', String(options.postId));
  if (options.caption) formData.append('caption', options.caption);
  if (options.order !== undefined) formData.append('order', String(options.order));

  try {
    const response = await fetch(`${API_URL}/media/upload`, {
      method: 'POST',
      body: formData,
      // no Content-Type header
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Upload failed:', response.status, text);
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