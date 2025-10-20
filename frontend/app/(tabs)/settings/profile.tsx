import { View, TextInput, Text, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { IUser } from '@/types/prisma';
import PickMedia from '@/components/PickMedia';
import DisplayMedia from '@/components/DisplayMedia';
import { MediaRecord, fetchMedia, deleteMedia } from '@/utils/mediaUtils';
import LoadingScreen from '@/components/LoadingScreen';

export default function ProfileSettings() {
  const [bio, setBio] = useState('');
  const [media, setMedia] = useState<MediaRecord[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const router = useRouter();
  const token = useRequireAuth();

  useEffect(() => {
    if (!token) return;
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get<IUser>(
          `${process.env.EXPO_PUBLIC_API_URL}/user/profile`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setBio(data.bio || '');
        setUserId(data.id);

        const userMedia = await fetchMedia({ userId: data.id });
        setMedia(userMedia);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handleUpdate = async () => {
    if (!token) return;
    setLoading(true);
    try {
      await axios.patch<IUser>(
        `${process.env.EXPO_PUBLIC_API_URL}/user/profile`,
        { bio },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      Alert.alert('Success', 'Profile updated successfully!');
      router.back();
    } catch (err) {
      console.error('Profile update failed:', err);
      Alert.alert('Error', 'Unable to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleMediaUploaded = (newMedia: MediaRecord) => {
    setMedia(prev => [newMedia, ...prev]);
  };

  const handleMediaDeleted = (id: number) => {
    setMedia(prev => prev.filter(m => m.id !== id));
  };

  const handleDeleteMedia = async (mediaId: number) => {
    try {
      await deleteMedia(mediaId);
      setMedia(prev => prev.filter(m => m.id !== mediaId));
    } catch {
      Alert.alert('Error', 'Failed to delete media');
    }
  };

  if (initialLoading) {
    return <LoadingScreen message="Loading profile..." />;
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ height: '100vh' as any }} className="container">
        <View className="container">
          <Text className="title">Update Profile</Text>

          <View className="input-container">
            <Text className="input-label">Bio</Text>
            <TextInput
              placeholder="Tell people about yourself..."
              value={bio}
              onChangeText={setBio}
              multiline
              className="input-multiline input-tall"
            />
          </View>

          <View className="input-container">
            <Text className="input-label">Media</Text>
            {userId && (
              <PickMedia
                userId={userId}
                onMediaUploaded={handleMediaUploaded}
                onMediaDeleted={handleMediaDeleted}
                buttonText="Add Photo/Video"
              />
            )}

            {media.map(item => (
              <View key={item.id} className="media-container">
                <DisplayMedia media={item} showCaption />
                <TouchableOpacity
                  onPress={() => handleDeleteMedia(item.id)}
                  className="button-error"
                >
                  <Text className="button-text">Delete</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <TouchableOpacity
            className={loading ? 'button button-disabled' : 'button'}
            onPress={handleUpdate}
            disabled={loading}
          >
            <Text className="button-text">
              {loading ? 'Updating...' : 'Update Profile'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}