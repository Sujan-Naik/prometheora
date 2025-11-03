// hooks/useMyProjects.ts
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRequireAuth } from '@/hooks/useRequireAuth';

interface Project {
  id: number;
  title: string;
  description: string;
  status: string;
  createdAt: string;
}

export const useMyProjects = () => {
  const token = useRequireAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    axios
      .get(`${process.env.EXPO_PUBLIC_API_URL}/creators/me/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setProjects(res.data))
      .catch(err => {
        console.error(err);
        setError('Failed to load projects');
      })
      .finally(() => setLoading(false));
  }, [token]);

  return { projects, loading, error };
};