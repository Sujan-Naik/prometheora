import { View, TouchableOpacity, Button } from 'react-native';
import { Text } from '@/components/ThemedText';

import { IPost } from '@/types/prisma';
import DisplayMedia from './DisplayMedia';
import { router } from 'expo-router';

interface PostCardProps {
  post: IPost;
  onPress?: () => void;
}

export default function PostCard({ post, onPress }: PostCardProps) {
  const createdDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const content = (
    <View className="card">
      <View className="card-header">
        <View className="flex-1">
          <Text className="section-title">{post.title}</Text>
          {post.creator && (
            <Text className="date-text">
              by @{post.creator.handle || 'anonymous'} • {createdDate}
            </Text>
          )}
        </View>
        {post.isPaid && (
          <View className="tag bg-success">
            <Text className="tag-text">💰 PAID</Text>
          </View>
        )}
      </View>

      <Text className="content-text" numberOfLines={4}>
        {post.content}
      </Text>

      {post.quotedProject && (
        <View className="quoted-container">
          <Text className="status-text mb-1">📦 Quoted Project</Text>
          <Button
            title={post.quotedProject.title}
            onPress={() => router.push(`/profile/${post.creator?.handle!}/projects/${post.quotedProject!.id}`)}
          />
        </View>
      )}

      {post.media && post.media.length > 0 && (
        <View className="mt-3">
          {post.media.slice(0, 1).map((media) => (
            <DisplayMedia key={media.id} media={media} showCaption={false} />
          ))}
          {post.media.length > 1 && (
            <Text className="status-text mt-1">+{post.media.length - 1} more</Text>
          )}
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}