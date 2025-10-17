// app/patron/followed-projects.tsx
import { View, Text, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRequireAuth } from "@/hooks/useRequireAuth";
import {IDevlog} from "@/types/prisma";
import ProjectCard from "@/components/ProjectCard";
import DevlogCard from "@/components/DevlogCard";

export default function FollowedProjectsFeed() {
  const [feed, setFeed] = useState<IDevlog[]>([]);
  const token = useRequireAuth();

  useEffect(() => {
    if (!token) {
      return;
    }
    axios.get<IDevlog[]>('http://localhost:3000/projects/followed/feed', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setFeed(res.data))
      .catch(err => console.error(err));
  }, [token]);

  return (
    <View style={{ flex: 1 }}>
      <Text>Followed Projects Feed</Text>
      <FlatList
        data={feed}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <DevlogCard devlog={item} />
        )}
      />
    </View>
  );
}