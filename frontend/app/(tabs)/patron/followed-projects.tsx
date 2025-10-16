// app/patron/followed-projects.tsx
import { View, Text, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRequireAuth } from "@/hooks/useRequireAuth";

interface Devlog {
  id: number;
  title: string;
  content: string;
  version?: string;
  buildLink?: string;
  createdAt: string;
  project: { title: string };
}

export default function FollowedProjectsFeed() {
  const [feed, setFeed] = useState<Devlog[]>([]);
  const token = useRequireAuth();

  console.log('followed projects')
  useEffect(() => {
    if (!token) {
      return;
    }
    axios.get<Devlog[]>('http://localhost:3000/projects/followed/feed', {
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
          <View>
            <Text>{item.project.title}: {item.title} ({item.version})</Text>
            <Text>{item.content}</Text>
            {item.buildLink && <Text>Build: {item.buildLink}</Text>}
            <Text>{item.createdAt}</Text>
          </View>
        )}
      />
    </View>
  );
}