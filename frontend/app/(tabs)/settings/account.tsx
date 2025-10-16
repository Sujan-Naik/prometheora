// app/settings/account.tsx
import { View, TextInput, Button, Text } from 'react-native';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useRequireAuth } from "@/hooks/useRequireAuth";

interface Account {
  email: string;
}

interface UpdateAccountResponse {
  // Updated user object
}

export default function AccountSettings() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();
  const token = useRequireAuth();

  useEffect(() => {
    if (!token) {
      return;
    }
    // Fetch current email if needed
    axios.get<Account>('http://localhost:3000/user/account', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setEmail(res.data.email))
      .catch(err => console.error(err));
  }, [token]);

  const handleUpdate = () => {
    if (!token) {
      return;
    }
    axios.patch<UpdateAccountResponse>('http://localhost:3000/user/account', { email, password }, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => router.back())
      .catch(err => console.error(err));
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Update Account</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="New Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Update" onPress={handleUpdate} />
    </View>
  );
}