// app/creator/create-devlog.tsx
import { View, TextInput, Button, Text } from 'react-native';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useRequireAuth } from "@/hooks/useRequireAuth";
import {IDevlog} from "@/types/prisma";


export default function CreateDevlog() {
  const [projectId, setProjectId] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [version, setVersion] = useState<string>('');
  const [buildLink, setBuildLink] = useState<string>('');
  const router = useRouter();
  const token = useRequireAuth();

  const handleCreate = () => {
    if (!token) {
      return;
    }
    axios.post<IDevlog>('EXPO_PUBLIC_API_URL/devlogs', { projectId: parseInt(projectId), title, content, version, buildLink }, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => router.back())
      .catch(err => console.error(err));
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Create Devlog</Text>
      <TextInput placeholder="Project ID" value={projectId} onChangeText={setProjectId} keyboardType="numeric" />
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} />
      <TextInput placeholder="Content" value={content} onChangeText={setContent} multiline />
      <TextInput placeholder="Version" value={version} onChangeText={setVersion} />
      <TextInput placeholder="Build Link" value={buildLink} onChangeText={setBuildLink} />
      <Button title="Submit" onPress={handleCreate} />
    </View>
  );
}