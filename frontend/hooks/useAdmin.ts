// hooks/useAdmin.ts
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // align with useAuthStatus
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  sub: number;
  email: string;
  isAdmin?: boolean;
  exp?: number;
}

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          setIsAdmin(false);
          return;
        }

        const decoded: DecodedToken = jwtDecode(token);

        // optional: check expiry
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          setIsAdmin(false);
          await AsyncStorage.removeItem('token'); // expired
          return;
        }

        setIsAdmin(!!decoded.isAdmin);
      } catch (err) {
        console.error('Failed to decode token:', err);
        setIsAdmin(false);
      }
    })();
  }, []);

  return { isAdmin };
}