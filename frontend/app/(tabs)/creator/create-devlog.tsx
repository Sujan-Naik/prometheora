import { View, TextInput, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { IDevlog } from "@/types/prisma";
import LoadingScreen from '@/components/LoadingScreen';

export default function CreateDevlog() {
  const [projectId, setProjectId] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [version, setVersion] = useState<string>('');
  const [buildLink, setBuildLink] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const token = useRequireAuth();

  const handleCreate = () => {
    if (!token) return;

    setLoading(true);
    axios.post<IDevlog>(`${process.env.EXPO_PUBLIC_API_URL}/devlogs`,
      { projectId: parseInt(projectId), title, content, version, buildLink },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(() => {
        setLoading(false);
        router.back();
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  if (loading) {
    return <LoadingScreen message="Creating devlog..." />;
  }

  return (
    <View className="page-container">
      <ScrollView style={{ height: '100vh' as any }} contentContainerStyle={{alignItems: "center"}} className="basic-container">
        <View style={{width: '100%'}} className="basic-container">
          <Text className="title">Create Devlog</Text>

          <View className="input-container">
            <Text className="input-label">Project ID</Text>
            <TextInput
              placeholder="Project ID"
              value={projectId}
              onChangeText={setProjectId}
              keyboardType="numeric"
              className="input"
            />
          </View>

          <View className="input-container">
            <Text className="input-label">Title</Text>
            <TextInput
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
              className="input"
            />
          </View>

          <View className="input-container">
            <Text className="input-label">Content</Text>
            <TextInput
              placeholder="Content"
              value={content}
              onChangeText={setContent}
              multiline
              className="input-multiline input-tall"
            />
          </View>

          <View className="input-container">
            <Text className="input-label">Version</Text>
            <TextInput
              placeholder="Version"
              value={version}
              onChangeText={setVersion}
              className="input"
            />
          </View>

          <View className="input-container">
            <Text className="input-label">Build Link</Text>
            <TextInput
              placeholder="Build Link"
              value={buildLink}
              onChangeText={setBuildLink}
              className="input"
            />
          </View>

          <TouchableOpacity className="button" onPress={handleCreate}>
            <Text className="button-text">Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}