import { View, TextInput, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import LoadingScreen from '@/components/LoadingScreen';
import { Text } from '@/components/ThemedText';

interface LoginResponse {
  access_token: string;
}

export default function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();
  const { isAuthenticated } = useAuthStatus();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid email or password');
      }

      if (data.access_token) {
        await AsyncStorage.setItem('token', data.access_token);
        router.push('/');
      } else {
        throw new Error('Login failed. Please try again.');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Unable to connect to server. Please check your internet connection.';
      setError(errorMessage);
      Alert.alert('Login Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen message="Logging in..." />;
  }

  return (
    <View className="page-container">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="basic-container">
          <Text className="title">Login</Text>
          {error ? <Text className="error-text">{error}</Text> : null}

          <View className="input-container">
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!loading}
              className="input"
            />
          </View>

          <View className="input-container">
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
              className="input"
            />
          </View>

          <TouchableOpacity className="button" onPress={handleLogin} disabled={loading}>
            <Text className="button-text">Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
