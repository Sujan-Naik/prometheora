import { View, FlatList } from 'react-native';
import { Text } from '@/components/ThemedText';

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

    axios.get<IProject[]>(`${process.env.EXPO_PUBLIC_API_URL}/projects/creator/${handle}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setProjects(res.data);
        console.log(projects)
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

    <View className="page-container" style={{height: '100vh' as any}}>
      <View className="header">
        <Text className="header-title">Projects for {handle}</Text>
      </View>
      <FlatList
        data={projects}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <ProjectCard project={item}/>
        )}
      />
    </View>
  );
}