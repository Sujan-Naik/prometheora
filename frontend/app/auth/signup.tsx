// app/auth/signup.tsx
import { View, TextInput, Button, Text } from 'react-native';
import {useEffect, useState} from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useAuthStatus} from "@/hooks/useAuthStatus";

enum Role {
  CREATOR = 'CREATOR',
  PATRON = 'PATRON',
}

interface SignupResponse {
  id: number;
  email: string;
  // etc.
}

export default function Signup() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [handle, setHandle] = useState<string>('');
  const [roles, setRoles] = useState<Role[]>([Role.PATRON]); // or toggle for creator
  const router = useRouter();

  const { isAuthenticated } = useAuthStatus();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/'); // Redirect if already logged in
    }
  }, [isAuthenticated]);


  const handleSignup = () => {
    axios.post<SignupResponse>('EXPO_PUBLIC_API_URL/auth/signup', { email, password, handle, roles })
      .then(res => router.push('/auth/login'))
      .catch(err => console.error(err));
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text>Signup</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <TextInput placeholder="Handle (for creators)" value={handle} onChangeText={setHandle} />
      <Button title="Signup" onPress={handleSignup} />
    </View>
  );
}