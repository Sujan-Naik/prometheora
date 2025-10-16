// app/creator/create-project.tsx
import { View, TextInput, Button, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useRequireAuth } from "@/hooks/useRequireAuth";
import {IProject, Visibility} from "@/types/prisma";


export default function CreateProject() {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [repoUrl, setRepoUrl] = useState<string>('');
  const [demoUrl, setDemoUrl] = useState<string>('');
  const [media, setMedia] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [visibility, setVisibility] = useState<Visibility>(Visibility.PATRON_ONLY);
  const router = useRouter();
  const token = useRequireAuth();

  const handleCreate = () => {
    if (!token) {
      return;
    }
    axios.post<IProject>('http://localhost:3000/projects', { title, description, repoUrl, demoUrl, media, status, visibility }, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => router.back())
      .catch(err => console.error(err));
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Create Project</Text>
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} />
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} multiline />
      <TextInput placeholder="Repo URL" value={repoUrl} onChangeText={setRepoUrl} />
      <TextInput placeholder="Demo URL" value={demoUrl} onChangeText={setDemoUrl} />
      <TextInput placeholder="Media (JSON)" value={media} onChangeText={setMedia} />
      <TextInput placeholder="Status" value={status} onChangeText={setStatus} />
      <Picker
        selectedValue={visibility}
        onValueChange={(itemValue) => setVisibility(itemValue as Visibility)}
      >
        <Picker.Item label="Public" value={Visibility.PUBLIC} />
        <Picker.Item label="Patron Only" value={Visibility.PATRON_ONLY} />
        <Picker.Item label="Follower Only" value={Visibility.FOLLOWER_ONLY} />
        <Picker.Item label="Private" value={Visibility.PRIVATE} />
      </Picker>
      <Button title="Submit" onPress={handleCreate} />
    </View>
  );
}