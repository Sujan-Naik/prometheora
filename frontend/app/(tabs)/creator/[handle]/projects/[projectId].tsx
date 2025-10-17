// app/(tabs)/creator/[handle]/projects/[projectId].tsx
import {View, Text, FlatList, Button, ScrollView} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRequireAuth } from "@/hooks/useRequireAuth";
import {IProject} from "@/types/prisma";
import ProjectCard from "@/components/ProjectCard";
import DevlogCard from "@/components/DevlogCard";


export default function ProjectDetail() {
  const { handle, projectId } = useLocalSearchParams<{ handle: string; projectId: string }>();
  const [project, setProject] = useState<IProject | null>(null);
  const [isFollowed, setIsFollowed] = useState<boolean>(false);
  const token = useRequireAuth();

  useEffect(() => {
    if (!token) {
      return;
    }
    axios.get<IProject>(`EXPO_PUBLIC_API_URL/projects/${projectId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setProject(res.data);
        setIsFollowed(res!.data!.followers!.length > 0);
      })
      .catch(err => console.error(err));
  }, [projectId, token]);

  const handleFollow = () => {
    if (!token) {
      return;
    }
    const method = isFollowed ? 'delete' : 'post';
    axios[method](`EXPO_PUBLIC_API_URL/projects/${projectId}/follow`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => setIsFollowed(!isFollowed))
      .catch(err => console.error(err));
  };

  return (
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
      {project && (
        <>
          <ProjectCard project={project} />
          <Text>Devlogs:</Text>
          <FlatList
            data={project.devlogs}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <DevlogCard devlog={item}/>
            )}
          />
        </>
      )}
    </ScrollView>
  );
}