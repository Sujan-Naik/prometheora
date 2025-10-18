// app/creator/create-post.tsx
import { View, TextInput, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { IPost } from "@/types/prisma";
import PickMedia from '@/components/PickMedia';
import DisplayMedia from '@/components/DisplayMedia';
import { MediaRecord } from '@/utils/mediaUtils';

export default function CreatePost() {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [quotedProjectId, setQuotedProjectId] = useState<string>('');
  const [media, setMedia] = useState<MediaRecord[]>([]);
  const router = useRouter();
  const token = useRequireAuth();

  const handleMediaUploaded = (newMedia: MediaRecord) => {
    setMedia([...media, newMedia]);
  };

  const handleCreate = async () => {
    if (!token) {
      return;
    }

    try {
      const response = await axios.post<IPost>(
        `${process.env.EXPO_PUBLIC_API_URL}/posts`,
        {
          title,
          content,
          isPaid,
          quotedProjectId: quotedProjectId ? parseInt(quotedProjectId) : undefined
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const postId = response.data.id;

      // Link all uploaded media to the post
      if (media.length > 0) {
        await Promise.all(
          media.map((m, index) =>
            axios.put(
              `${process.env.EXPO_PUBLIC_API_URL}/media/${m.id}`,
              { order: index },
              { headers: { Authorization: `Bearer ${token}` } }
            )
          )
        );
      }

      Alert.alert('Success', 'Post created successfully!');
      router.back();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to create post');
    }
  };

  return (
        <ScrollView style={{ height: "100vh" as any }} className="container">

      <Text className="title">Create Post</Text>

      <View className="mb-4">
        <TextInput
          placeholder="Post Title"
          value={title}
          onChangeText={setTitle}
          className="input"
        />

        <TextInput
          placeholder="What's on your mind?"
          value={content}
          onChangeText={setContent}
          multiline
          className="input h-36"
        />

        <TextInput
          placeholder="Quoted Project ID (optional)"
          value={quotedProjectId}
          onChangeText={setQuotedProjectId}
          keyboardType="numeric"
          className="input"
        />

        <TouchableOpacity
          onPress={() => setIsPaid(!isPaid)}
          className={`p-4 rounded-lg mb-2 ${isPaid ? 'bg-[var(--success)]' : 'bg-[var(--border)]'} items-center`}
        >
          <Text className={`font-semibold text-lg ${isPaid ? 'text-white' : 'text-[var(--text-secondary)]'}`}>
            {isPaid ? '💰 Paid Post' : '🆓 Free Post'}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="mb-4">
        <Text className="section-title">Media</Text>
        <PickMedia
          onMediaUploaded={handleMediaUploaded}
          buttonText="Add Photo/Video"
        />

        {media.map((item) => (
          <DisplayMedia
            key={item.id}
            media={item}
            showCaption={false}
          />
        ))}
      </View>

      <TouchableOpacity
        className="button"
        onPress={handleCreate}
      >
        <Text className="button-text">Publish Post</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}