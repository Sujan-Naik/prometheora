// app/creator/[handle]/projects/index.tsx
import { View, Text, FlatList } from 'react-native';
import { useLocalSearchParams, Link } from 'expo-router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRequireAuth } from "@/hooks/useRequireAuth";

interface Project {
  id: number;
  title: string;
  description: string;
  visibility: string;
  // etc.
}

export default function CreatorProjects() {
  const { handle } = useLocalSearchParams<{ handle: string }>();
  const [projects, setProjects] = useState<Project[]>([]);
  const token = useRequireAuth();

  useEffect(() => {
    if (!token) {
      return;
    }
    axios.get<Project[]>(`http://localhost:3000/projects/creator/${handle}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setProjects(res.data))
      .catch(err => console.error(err));
  }, [handle, token]);

  return (
    <View style={{ flex: 1 }}>
      <Text>Projects for {handle}</Text>
      <FlatList
        data={projects}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <Link href={`/creator/${handle}/projects/${item.id}`}>
            <Text>{item.title} ({item.visibility})</Text>
          </Link>
        )}
      />
    </View>
  );
}