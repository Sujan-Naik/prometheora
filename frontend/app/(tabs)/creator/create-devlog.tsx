import { View, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useMyProjects } from "@/hooks/useMyProjects";
import { IDevlog } from "@/types/prisma";
import LoadingScreen from '@/components/LoadingScreen';
import { Text } from '@/components/ThemedText';

export default function CreateDevlog() {
  const { projects, loading: projectsLoading } = useMyProjects();
  const [projectId, setProjectId] = useState<number | null>(null);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [version, setVersion] = useState<string>('');
  const [buildLink, setBuildLink] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const token = useRequireAuth();

  // Set first project as default when projects load
  if (projects.length > 0 && projectId === null) {
    setProjectId(projects[0].id);
  }

  const handleCreate = () => {
    if (!token || !projectId) return;

    setLoading(true);
    axios.post<IDevlog>(`${process.env.EXPO_PUBLIC_API_URL}/devlogs`,
      { projectId, title, content, version, buildLink },
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

  if (projectsLoading || loading) {
    return <LoadingScreen message={loading ? "Creating devlog..." : "Loading projects..."} />;
  }

  if (projects.length === 0) {
    return (
      <View className="page-container">
        <View className="basic-container">
          <Text className="title">No Projects Found</Text>
          <Text>You need to create a project before you can create a devlog.</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="page-container">
      <ScrollView style={{ height: '100vh' as any }} contentContainerStyle={{alignItems: "center"}} className="basic-container">
        <View style={{width: '100%'}} className="basic-container">
          <Text className="title">Create Devlog</Text>

          <View className="input-container">
            <Text className="input-label">Project</Text>
            <View className="picker-container">
              <Picker
                selectedValue={projectId}
                onValueChange={(value) => setProjectId(value)}
                style={{backgroundColor: 'inherit', color: 'var(--text-color)'}}
              >
                {projects.map(project => (
                  <Picker.Item key={project.id} label={project.title} value={project.id} />
                ))}
              </Picker>
            </View>
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