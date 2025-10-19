import { View, TextInput, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { IUser } from "@/types/prisma";
import UserCard from "@/components/UserCard";
import LoadingScreen from '@/components/LoadingScreen';

export default function AccountSettings() {
  const [user, setUser] = useState<IUser | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const token = useRequireAuth();

  useEffect(() => {
    if (!token) return;

    axios.get<IUser>(`${process.env.EXPO_PUBLIC_API_URL}/user/account`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setUser(res.data);
      setEmail(res.data.email);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [token]);

  const handleUpdate = () => {
    if (!token) return;

    axios.patch<IUser>(`${process.env.EXPO_PUBLIC_API_URL}/user/account`, { email, password }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setUser(res.data);
      router.back();
    })
    .catch(err => console.error(err));
  };

  if (loading) {
    return <LoadingScreen message="Loading account..." />;
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <View className="container">
          {user && <UserCard user={user} />}

          <Text className="title">Update Account</Text>
          
          <View className="input-container">
            <Text className="input-label">Email</Text>
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              className="input"
            />
          </View>

          <View className="input-container">
            <Text className="input-label">New Password</Text>
            <TextInput
              placeholder="New Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              className="input"
            />
          </View>

          <TouchableOpacity className="button" onPress={handleUpdate}>
            <Text className="button-text">Update</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
