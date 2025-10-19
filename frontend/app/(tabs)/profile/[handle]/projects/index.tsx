import { View, Text, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { IProject } from "@/types/prisma";
import ProjectCard from "@/components/ProjectCard";
import LoadingScreen from '@/components/LoadingScreen';

export default function CreatorProjects() {
  const { handle } = useLocalSearchParams<{ handle: string }>();
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const token = useRequireAuth();

  useEffect(() => {
    if (!token) return;

    axios.get<IProject[]>(`${process.env.EXPO_PUBLIC_API_URL}/projects/profile/${handle}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setProjects(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [handle, token]);

  if (loading) {
    return <LoadingScreen message="Loading projects..." />;
  }

  return (
    <View style={{ flex: 1 }}>
      <View className="header">
        <Text className="header-title">Projects for {handle}</Text>
      </View>
      <FlatList
        data={projects}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <ProjectCard project={item}/>
        )}
      />
    </View>
  );
}