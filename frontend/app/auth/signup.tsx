import { View, TextInput, Text, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStatus } from "@/hooks/useAuthStatus";
import LoadingScreen from '@/components/LoadingScreen';

enum Role {
  CREATOR = 'CREATOR',
  PATRON = 'PATRON',
}

interface SignupResponse {
  id: number;
  email: string;
}

export default function Signup() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [handle, setHandle] = useState<string>('');
  const [roles, setRoles] = useState<Role[]>([Role.PATRON]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();
  const { isAuthenticated } = useAuthStatus();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated]);

  const handleSignup = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({ email, password, handle, roles }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed. Please try again.');
      }

      Alert.alert(
        'Success',
        'Account created successfully! Please login.',
        [{ text: 'OK', onPress: () => router.push('/auth/login') }]
      );
    } catch (err: any) {
      const errorMessage = err.message || 'Unable to connect to server. Please check your internet connection.';
      setError(errorMessage);
      Alert.alert('Signup Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen message="Creating account..." />;
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="container">
          <Text className="title">Signup</Text>
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

          <View className="input-container">
            <TextInput
              placeholder="Handle (optional)"
              value={handle}
              onChangeText={setHandle}
              autoCapitalize="none"
              editable={!loading}
              className="input"
            />
          </View>

          <TouchableOpacity className="button" onPress={handleSignup} disabled={loading}>
            <Text className="button-text">Signup</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}