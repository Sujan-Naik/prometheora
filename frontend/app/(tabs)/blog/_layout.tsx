import { Stack } from 'expo-router';
import { Text } from '@/components/ThemedText';
import { useAdmin } from '@/hooks/useAdmin';

export default function BlogLayout() {
  const { isAdmin } = useAdmin();

  console.log(isAdmin)
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Blog Posts',
          headerRight: isAdmin ? () => (
            <Text className="font-sans">✏️ Admin</Text>
          ) : undefined
        }}
      />
      <Stack.Screen
        name="[slug]"
        options={{
          title: 'Blog Post',
          headerBackTitle: 'Back'
        }}
      />
      {isAdmin && (
        <Stack.Screen
          name="create"
          options={{
            title: 'Create Blog Post',
            presentation: 'modal'
          }}
        />
      )}
    </Stack>
  );
}