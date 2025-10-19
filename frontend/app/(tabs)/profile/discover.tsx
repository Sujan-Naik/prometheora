import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import LoadingScreen from '@/components/LoadingScreen';

interface Creator {
  id: number;
  handle: string;
  bio: string | null;
  createdAt: string;
  _count: {
    posts: number;
    projects: number;
    tiers: number;
  };
}

interface DiscoverResponse {
  creators: Creator[];
  total: number;
  limit: number;
  offset: number;
}

export default function Discover() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const token = useRequireAuth();
  const router = useRouter();

  const fetchCreators = async (searchQuery?: string, refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);

    try {
      const params = searchQuery ? { search: searchQuery, limit: 20 } : { limit: 20 };
      const response = await axios.get<DiscoverResponse>(
        `${process.env.EXPO_PUBLIC_API_URL}/creators`,
        {
          params,
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setCreators(response.data.creators);
    } catch (err) {
      console.error('Failed to fetch creators:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchCreators();
  }, [token]);

  const handleSearch = () => {
    fetchCreators(search);
  };

  if (loading) {
    return <LoadingScreen message="Finding creators..." />;
  }

  return (
    <View className="flex-1">
      <View className="header">
        <Text className="header-title">Discover Creators</Text>
        <Text className="header-subtitle">Find amazing creators to follow</Text>
      </View>

      <View className="container">
        <View className="input-container">
          <TextInput
            className="input"
            placeholder="Search creators..."
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>

        <FlatList
          data={creators}
          keyExtractor={item => item.id.toString()}
          refreshing={refreshing}
          onRefresh={() => fetchCreators(search, true)}
          ListEmptyComponent={
            <View className="empty-state-container">
              <Text className="not-found-text">No creators found</Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              className="card"
              onPress={() => router.push(`/(tabs)/profile/${item.handle}`)}
            >
              <Text className="section-title">@{item.handle}</Text>
              {item.bio && <Text className="subtitle">{item.bio}</Text>}
              <View className="flex-row justify-around mt-3">
                <View className="items-center">
                  <Text className="text-lg font-bold">{item._count.posts}</Text>
                  <Text className="subtitle">Posts</Text>
                </View>
                <View className="items-center">
                  <Text className="text-lg font-bold">{item._count.projects}</Text>
                  <Text className="subtitle">Projects</Text>
                </View>
                <View className="items-center">
                  <Text className="text-lg font-bold">{item._count.tiers}</Text>
                  <Text className="subtitle">Tiers</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}