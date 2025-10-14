// hooks/useRequireAuth.ts
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export function useRequireAuth(redirectTo: string = '/auth/login') {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      if (!storedToken) {
        console.warn('Not authenticated');
        router.replace('/');
        return;
      }
      setToken(storedToken);
    };
    checkAuth();
  }, [redirectTo, router]);

  return token;
}