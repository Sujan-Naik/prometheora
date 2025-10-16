// app/settings/profile.tsx
import { View, TextInput, Button, Text } from 'react-native';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useRequireAuth } from "@/hooks/useRequireAuth";

interface Profile {
  bio: string;
  media: string;
}

interface UpdateProfileResponse {
  // Updated user object
}

export default function ProfileSettings() {
  const [bio, setBio] = useState<string>('');
  const [media, setMedia] = useState<string>('');
  const router = useRouter();
  const token = useRequireAuth();

  useEffect(() => {
    if (!token) {
      return;
    }
    // Fetch current profile if needed
    axios.get<Profile>('http://localhost:3000/user/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setBio(res.data.bio);
        setMedia(res.data.media);
      })
      .catch(err => console.error(err));
  }, [token]);

  const handleUpdate = () => {
    if (!token) {
      return;
    }
    axios.patch<UpdateProfileResponse>('http://localhost:3000/user/profile', { bio, media }, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => router.back())
      .catch(err => console.error(err));
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Update Profile</Text>
      <TextInput placeholder="Bio" value={bio} onChangeText={setBio} multiline />
      <TextInput placeholder="Media (JSON)" value={media} onChangeText={setMedia} />
      <Button title="Update" onPress={handleUpdate} />
    </View>
  );
}