import { View, FlatList, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from '@/components/ThemedText';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { IPortfolioItem, IProject } from "@/types/prisma";
import LoadingScreen from '@/components/LoadingScreen';

export default function EditPortfolio() {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [portfolio, setPortfolio] = useState<IPortfolioItem[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [caption, setCaption] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const token = useRequireAuth();

  useEffect(() => {
    if (!token) return;
    
    axios.get<IProject[]>(`${process.env.EXPO_PUBLIC_API_URL}/projects/creator/myhandle`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setProjects(res.data))
      .catch(err => console.error(err));

    axios.get<IPortfolioItem[]>(`${process.env.EXPO_PUBLIC_API_URL}/portfolio/myhandle`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setPortfolio(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [token]);

  const handleAdd = () => {
    if (!token || !selectedProjectId) return;
    axios.post(`${process.env.EXPO_PUBLIC_API_URL}/portfolio`, { projectId: selectedProjectId, caption }, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setPortfolio([...portfolio, res.data]))
      .catch(err => console.error(err));
  };

  const handleUpdateOrder = () => {
    if (!token) return;
    const items = portfolio.map((item, index) => ({ id: item.id, order: index + 1 }));
    axios.patch(`${process.env.EXPO_PUBLIC_API_URL}/portfolio/order`, { items }, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => alert('Order updated'))
      .catch(err => console.error(err));
  };

  const handleRemove = (itemId: number) => {
    if (!token) return;
    axios.delete(`${process.env.EXPO_PUBLIC_API_URL}/portfolio/${itemId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => setPortfolio(portfolio.filter(item => item.id !== itemId)))
      .catch(err => console.error(err));
  };

  if (loading) {
    return <LoadingScreen message="Loading portfolio..." />;
  }

  return (
    <View className="page-container">
      <ScrollView style={{ height: '100vh' as any }} contentContainerStyle={{alignItems: "center"}} className="basic-container">
        <View style={{width: '100%'}} className="basic-container">
          <Text className="title">Edit Portfolio</Text>
          
          <Text className="section-title">Select Project to Add:</Text>
          <FlatList
            data={projects}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity 
                className="button-secondary" 
                onPress={() => setSelectedProjectId(item.id)}
              >
                <Text className="button-secondary-text">{item.title}</Text>
              </TouchableOpacity>
            )}
          />
          
          <View className="input-container">
            <Text className="input-label">Caption</Text>
            <TextInput 
              placeholder="Caption" 
              value={caption} 
              onChangeText={setCaption} 
              className="input" 
            />
          </View>
          
          <TouchableOpacity className="button" onPress={handleAdd}>
            <Text className="button-text">Add to Portfolio</Text>
          </TouchableOpacity>
          
          <Text className="section-title">Current Portfolio:</Text>
          <FlatList
            data={portfolio}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <View className="card">
                <Text className="text-base">{item.project!.title} - {item.caption}</Text>
                <TouchableOpacity 
                  className="button-error" 
                  onPress={() => handleRemove(item.id)}
                >
                  <Text className="button-text">Remove</Text>
                </TouchableOpacity>
              </View>
            )}
          />
          
          <TouchableOpacity className="button" onPress={handleUpdateOrder}>
            <Text className="button-text">Update Order</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
