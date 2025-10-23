import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
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
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const token = useRequireAuth();
  const router = useRouter();

  const fetchCreators = async (searchQuery: string, currentOffset: number, append = false) => {
    if (append) {
      setLoadingMore(true);
    } else if (currentOffset === 0) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    try {
      const params: any = { limit: 20, offset: currentOffset };
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      const response = await axios.get<DiscoverResponse>(
        `${process.env.EXPO_PUBLIC_API_URL}/creators`,
        {
          params,
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (append) {
        setCreators(prev => [...prev, ...response.data.creators]);
      } else {
        setCreators(response.data.creators);
      }

      setHasMore(currentOffset + response.data.creators.length < response.data.total);
    } catch (err) {
      console.error('Failed to fetch creators:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchCreators('', 0);
  }, [token]);

  useEffect(() => {
    if (!token) return;

    const delaySearch = setTimeout(() => {
      setOffset(0);
      fetchCreators(search, 0);
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [search, token]);

  const handleRefresh = useCallback(() => {
    setOffset(0);
    fetchCreators(search, 0);
  }, [search, token]);

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      const newOffset = offset + 20;
      setOffset(newOffset);
      fetchCreators(search, newOffset, true);
    }
  }, [search, offset, loadingMore, hasMore, token]);

  if (loading) {
    return <LoadingScreen message="Finding creators..." />;
  }

  return (
    <View className="page-container">
      <View className="header">
        <Text className="header-title">Discover Creators</Text>
        <Text className="header-subtitle">Find amazing creators to follow</Text>
      </View>
      <View style={{ padding: 20 }}>
        <TextInput
          className="input"
          placeholder="Search creators..."
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      <FlatList
        data={creators}
        keyExtractor={item => item.id.toString()}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={{ padding: 20 }}
        ListEmptyComponent={
          <View className="empty-state-container">
            <Text className="not-found-text">
              {search.trim() ? 'No creators found matching your search' : 'No creators found'}
            </Text>
          </View>
        }
        ListFooterComponent={
          loadingMore ? (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text className="subtitle">Loading more...</Text>
            </View>
          ) : null
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
  );
}