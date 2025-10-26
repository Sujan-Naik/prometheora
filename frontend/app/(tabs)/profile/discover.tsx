import {View, TextInput, ScrollView, TouchableOpacity, RefreshControl} from 'react-native';
import { Text } from '@/components/ThemedText';

import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import UserCard from '@/components/UserCard';
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

  const fetchCreators = useCallback(async (searchQuery: string, currentOffset: number, append = false) => {
    if (isFetchingRef.current || !token) {
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    isFetchingRef.current = true;

    if (append) {
      setLoadingMore(true);
    } else {
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
    } catch (err) {
      if (axios.isCancel(err)) {
        return;
      }
      console.error('Failed to fetch creators:', err);
      setError('Failed to load creators. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
      isFetchingRef.current = false;
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    fetchCreators('', 0);
  }, [token, fetchCreators]);

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

  if (loading && !refreshing && creators.length === 0) {
    return <LoadingScreen message="Finding creators..." />;
  }

  return (
    <View className="page-container">
      <ScrollView
        style={{ height: '100vh' as any }}
        contentContainerStyle={{ alignItems: 'center' }}
        className="basic-container"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View className="basic-container">
          <Text className="title">Discover Creators</Text>
          <Text className="subtitle">Find amazing creators to follow</Text>

          <TextInput
            className="input"
            placeholder="Search creators..."
            value={search}
            onChangeText={handleSearchChange}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
            style={{ marginVertical: 20, width: '100%' }}
          />

          {error && (
            <Text className="subtitle" style={{ color: 'red', textAlign: 'center', marginBottom: 20 }}>
              {error}
            </Text>
          )}

          {creators.length === 0 && !loading && (
            <Text className="subtitle" style={{ textAlign: 'center', marginVertical: 20 }}>
              {search.trim() ? 'No creators found matching your search' : 'No creators found'}
            </Text>
          )}

          {creators.map(creator => (
            <TouchableOpacity
              key={creator.id}
              onPress={() => router.push(`/(tabs)/profile/${creator.handle}`)}
            >
              <UserCard user={creator} />
            </TouchableOpacity>
          ))}

          {hasMore && !loadingMore && (
            <TouchableOpacity
              className="card"
              onPress={handleLoadMore}
              disabled={loadingMore || loading}
            >
              <Text className="subtitle" style={{ textAlign: 'center' }}>
                Load More
              </Text>
            </TouchableOpacity>
          )}

          {loadingMore && (
            <Text className="subtitle" style={{ textAlign: 'center', marginVertical: 20 }}>
              Loading more...
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
