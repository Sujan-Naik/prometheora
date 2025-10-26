import { View, FlatList, ScrollView } from 'react-native';
import { Text } from '@/components/ThemedText';

import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { IProject } from "@/types/prisma";
import ProjectCard from "@/components/ProjectCard";
import DevlogCard from "@/components/DevlogCard";
import LoadingScreen from '@/components/LoadingScreen';

export default function ProjectDetail() {
  const { handle, projectId } = useLocalSearchParams<{ handle: string; projectId: string }>();
  const [project, setProject] = useState<IProject | null>(null);
  const [isFollowed, setIsFollowed] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const token = useRequireAuth();

  useEffect(() => {
    if (!token) return;

    axios.get<IProject>(`${process.env.EXPO_PUBLIC_API_URL}/projects/${projectId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setProject(res.data);
        if (res.data.followers) {
          setIsFollowed(res.data.followers.length > 0);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [projectId, token]);



  const handleFollow = () => {
    if (!token) return;

    const method = isFollowed ? 'delete' : 'post';
    axios[method](`${process.env.EXPO_PUBLIC_API_URL}/projects/${projectId}/follow`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => setIsFollowed(!isFollowed))
      .catch(err => console.error(err));
  };

  if (loading) {
    return <LoadingScreen message="Loading project..." />;
  }

  return (
    <View className="page-container">
      <ScrollView style={{ height: '100vh' as any}} className="basic-container" >
        <View className="basic-container">
          {project && (
            <>
              <View className="header">
                <Text className="header-title">{project.title} by {handle}</Text>
              </View>

              <ProjectCard project={project} />

              <Text className="section-title">Devlogs:</Text>
              <FlatList
                data={project.devlogs}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                  <DevlogCard devlog={item}/>
                )}
              />
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
