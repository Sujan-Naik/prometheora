// app/settings/account.tsx
import {View, TextInput, Button, Text, ScrollView} from 'react-native';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { IUser } from "@/types/prisma";
import UserCard from "@/components/UserCard";

export default function AccountSettings() {
  const [user, setUser] = useState<IUser | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    })
    .catch(err => console.error(err));
  }, [token]);

  const handleUpdate = () => {
    if (!token) return;

    axios.patch<IUser>(`${process.env.EXPO_PUBLIC_API_URL}/user/account`, { email, password }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setUser(res.data); // update local user data
      router.back();
    })
    .catch(err => console.error(err));
  };

  return (
      <ScrollView style={{ height: "100vh" as any }} className="container">
      {user && <UserCard user={user} />}

      <Text className="title">Update Account</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        className="input"
      />
      <TextInput
        placeholder="New Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="input"
      />
      <Button title="Update" onPress={handleUpdate} />
      </ScrollView>
  );
}