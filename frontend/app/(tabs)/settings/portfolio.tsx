// app/settings/portfolio.tsx
import { View, Text, FlatList, TextInput, Button } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useRequireAuth } from "@/hooks/useRequireAuth";

interface Project {
  id: number;
  title: string;
}

interface PortfolioItem {
  id: number;
  projectId: number;
  order: number;
  caption?: string;
  project: Project;
}

export default function EditPortfolio() {
  const [projects, setProjects] = useState<Project[]>([]); // Available projects
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [caption, setCaption] = useState<string>('');
  const router = useRouter();
  const token = useRequireAuth();

  useEffect(() => {
    if (!token) {
      return;
    }
    // Fetch user's projects
    axios.get<Project[]>('http://localhost:3000/projects/creator/myhandle', { // Replace 'myhandle' with actual
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setProjects(res.data))
      .catch(err => console.error(err));

    // Fetch current portfolio
    axios.get<PortfolioItem[]>('http://localhost:3000/portfolio/myhandle', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setPortfolio(res.data))
      .catch(err => console.error(err));
  }, [token]);

  const handleAdd = () => {
    if (!token || !selectedProjectId) return;
    axios.post('http://localhost:3000/portfolio', { projectId: selectedProjectId, caption }, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setPortfolio([...portfolio, res.data]))
      .catch(err => console.error(err));
  };

  const handleUpdateOrder = () => {
    if (!token) return;
    const items = portfolio.map((item, index) => ({ id: item.id, order: index + 1 }));
    axios.patch('http://localhost:3000/portfolio/order', { items }, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => alert('Order updated'))
      .catch(err => console.error(err));
  };

  const handleRemove = (itemId: number) => {
    if (!token) return;
    axios.delete(`http://localhost:3000/portfolio/${itemId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => setPortfolio(portfolio.filter(item => item.id !== itemId)))
      .catch(err => console.error(err));
  };

  // Add drag-and-drop for ordering if using a library like react-native-draggable-flatlist

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Edit Portfolio</Text>
      <Text>Select Project to Add:</Text>
      <FlatList
        data={projects}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <Button title={item.title} onPress={() => setSelectedProjectId(item.id)} />
        )}
      />
      <TextInput placeholder="Caption" value={caption} onChangeText={setCaption} />
      <Button title="Add to Portfolio" onPress={handleAdd} />
      <Text>Current Portfolio:</Text>
      <FlatList
        data={portfolio}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.project.title} - {item.caption}</Text>
            <Button title="Remove" onPress={() => handleRemove(item.id)} />
          </View>
        )}
      />
      <Button title="Update Order" onPress={handleUpdateOrder} />
    </View>
  );
}