// components/PostCard.tsx
import {View, Text, TouchableOpacity, Button} from 'react-native';
import { IPost } from '@/types/prisma';
import DisplayMedia from './DisplayMedia';
import {TabTrigger} from "expo-router/ui";
import {TabButton} from "@/components/TabButton";
import {router} from "expo-router";

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
    <View className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#000', marginBottom: 4 }}>
            {post.title}
          </Text>
          {post.creator && (
            <Text style={{ fontSize: 12, color: '#666' }}>
              by @{post.creator.handle || 'anonymous'} • {createdDate}
            </Text>
          )}
        </View>
        {post.isPaid && (
          <View
            style={{
              backgroundColor: '#34c759',
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 12,
              marginLeft: 8,
            }}
          >
            <Text style={{ fontSize: 10, color: '#fff', fontWeight: '600' }}>💰 PAID</Text>
          </View>
        )}
      </View>

      <Text
        style={{ fontSize: 14, color: '#333', marginTop: 12, lineHeight: 20 }}
        numberOfLines={4}
      >
        {post.content}
      </Text>

      {post.quotedProject && (
        <View
          style={{
            marginTop: 12,
            padding: 12,
            backgroundColor: '#f5f5f5',
            borderRadius: 8,
            borderLeftWidth: 3,
            borderLeftColor: '#007aff',
          }}
        >
          <Text style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>
            📦 Quoted Project
          </Text>
            <Button title={post.quotedProject.title} onPress={() => router.push(`/(tabs)/creator/${post.creator?.handle!}/projects/${post!.quotedProject!.id}`)} />

        </View>
      )}

      {post.media && post.media.length > 0 && (
        <View style={{ marginTop: 12 }}>
          {post.media.slice(0, 1).map((media) => (
            <DisplayMedia key={media.id} media={media} showCaption={false} height={200} />
          ))}
          {post.media.length > 1 && (
            <Text style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
              +{post.media.length - 1} more
            </Text>
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