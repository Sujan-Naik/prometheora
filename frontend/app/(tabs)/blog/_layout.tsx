import { Stack } from 'expo-router';
import { Text } from 'react-native';
import { useAdmin } from '@/hooks/useAdmin';

export default function BlogLayout() {
  const { isAdmin } = useAdmin();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: 'var(--primary)',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Blog Posts',
          headerRight: isAdmin ? () => (
            <Text className="text-white mr-2.5">✏️ Admin</Text>
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