// app/settings/profile.tsx
import { View, TextInput, Button, Text, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { IUser } from '@/types/prisma';

export default function ProfileSettings() {
  const [bio, setBio] = useState('');
  const [media, setMedia] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const token = useRequireAuth();

  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const { data } = await axios.get<IUser>('http://localhost:3000/user/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBio(data.bio || '');
        setMedia(data.media || '');
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };

    fetchProfile();
  }, [token]);

  const handleUpdate = async () => {
    if (!token) return;
    setLoading(true);

    try {
      await axios.patch<IUser>(
        'http://localhost:3000/user/profile',
        { bio, media },
        { headers: { Authorization: `Bearer ${token}` } }
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

  return (
    <View style={{ flex: 1, padding: 20, gap: 10 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Update Profile</Text>

      <TextInput
        placeholder="Bio"
        value={bio}
        onChangeText={setBio}
        multiline
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8 }}
      />

      <TextInput
        placeholder="Media (JSON)"
        value={media}
        onChangeText={setMedia}
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8 }}
      />

      <Button title={loading ? 'Updating...' : 'Update'} onPress={handleUpdate} disabled={loading} />
    </View>
  );
}