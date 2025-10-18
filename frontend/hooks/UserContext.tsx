// app/profile/UserContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { IUser } from "@/types/prisma";

interface UserContextValue {
  user: IUser | null;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
  loading: boolean;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const token = useRequireAuth();
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    axios
      .get(`${process.env.EXPO_PUBLIC_API_URL}/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setUser(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
};