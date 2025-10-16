// app/creator/[handle]/projects/[projectId].tsx
import { View, Text, FlatList, Button } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRequireAuth } from "@/hooks/useRequireAuth";

interface Project {
  id: number;
  title: string;
  description: string;
  repoUrl?: string;
  demoUrl?: string;
  media?: string;
  status?: string;
  visibility: string;
  devlogs: Devlog[];
  followers: any[]; // For checking if followed
}

interface Devlog {
  id: number;
  title: string;
  content: string;
  version?: string;
  buildLink?: string;
  createdAt: string;
}

export default function ProjectDetail() {
  const { handle, projectId } = useLocalSearchParams<{ handle: string; projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [isFollowed, setIsFollowed] = useState<boolean>(false);
  const token = useRequireAuth();

  useEffect(() => {
    if (!token) {
      return;
    }
    axios.get<Project>(`http://localhost:3000/projects/${projectId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setProject(res.data);
        setIsFollowed(res.data.followers.length > 0);
      })
      .catch(err => console.error(err));
  }, [projectId, token]);

  const handleFollow = () => {
    if (!token) {
      return;
    }
    const method = isFollowed ? 'delete' : 'post';
    axios[method](`http://localhost:3000/projects/${projectId}/follow`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => setIsFollowed(!isFollowed))
      .catch(err => console.error(err));
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {project && (
        <>
          <Text>{project.title}</Text>
          <Text>{project.description}</Text>
          {/* Render other fields */}
          <Button title={isFollowed ? 'Unfollow' : 'Follow'} onPress={handleFollow} />
          <Text>Devlogs:</Text>
          <FlatList
            data={project.devlogs}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <View>
                <Text>{item.title} ({item.version})</Text>
                <Text>{item.content}</Text>
                {item.buildLink && <Text>Build: {item.buildLink}</Text>}
              </View>
            )}
          />
        </>
      )}
    </View>
  );
}