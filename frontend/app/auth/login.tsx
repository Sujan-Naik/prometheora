// app/auth/login.tsx
import { View, TextInput, Button, Text } from 'react-native';
import {useEffect, useState} from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useAuthStatus} from "@/hooks/useAuthStatus";

interface LoginResponse {
  access_token: string;
}

export default function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();


  const { isAuthenticated } = useAuthStatus();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/'); // Redirect if already logged in
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    axios.post<LoginResponse>('EXPO_PUBLIC_API_URL/auth/login', { email, password })
      .then(async res => {
        await AsyncStorage.setItem('token', res.data.access_token);
        router.push('/');
      })
      .catch(err => console.error(err));
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text>Login</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}