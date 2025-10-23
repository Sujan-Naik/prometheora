import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { useState, useEffect, useCallback, useRef } from 'react';
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
  const [error, setError] = useState<string | null>(null);
  const token = useRequireAuth();
  const router = useRouter();
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const abortControllerRef = useRef<AbortController | undefined>(undefined);
  const isFetchingRef = useRef(false);
  const lastQueryRef = useRef<string>('');

  const fetchCreators = useCallback(async (searchQuery: string, currentOffset: number, append = false) => {
    const queryKey = `${searchQuery}-${currentOffset}-${append}`;

    if (isFetchingRef.current) {
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    isFetchingRef.current = true;

    if (append) {
      setLoadingMore(true);
    } else if (currentOffset === 0) {
      setLoading(true);
    }

    setError(null);

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
          signal: abortControllerRef.current.signal,
        },
      );

      if (append) {
        setCreators(prev => [...prev, ...response.data.creators]);
      } else {
        setCreators(response.data.creators);
      }

      setHasMore(currentOffset + response.data.creators.length < response.data.total);
      lastQueryRef.current = queryKey;
    } catch (err) {
      if (axios.isCancel(err)) {
        return;
      }
      console.error('Failed to fetch creators:', err);
      setError('Failed to load creators. Pull to refresh.');
      setHasMore(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
      isFetchingRef.current = false;
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    const initialFetch = async () => {
      await fetchCreators('', 0);
    };
    initialFetch();
  }, [token]);

  const handleSearchChange = (text: string) => {
    setSearch(text);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setOffset(0);
      setHasMore(true);
      fetchCreators(text, 0);
    }, 500);
  };

  const handleRefresh = useCallback(() => {
    if (isFetchingRef.current) return;
    setRefreshing(true);
    setOffset(0);
    setHasMore(true);
    setError(null);
    fetchCreators(search, 0);
  }, [search, fetchCreators]);

  const handleLoadMore = useCallback(() => {
    if (isFetchingRef.current || !hasMore || loadingMore || loading || error) {
      return;
    }
    const newOffset = offset + 20;
    setOffset(newOffset);
    fetchCreators(search, newOffset, true);
  }, [search, offset, loadingMore, hasMore, loading, error, fetchCreators]);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  if (loading && creators.length === 0 && !error) {
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
          onChangeText={handleSearchChange}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      {error && (
        <View style={{ padding: 20, paddingTop: 0 }}>
          <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
        </View>
      )}
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
              {error ? 'Pull down to try again' : search.trim() ? 'No creators found matching your search' : 'No creators found'}
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