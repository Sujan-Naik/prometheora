// app/(tabs)/creator/[handle]/projects/_layout.tsx
import { Stack } from 'expo-router';

export default function ProjectsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Projects' }} />
      <Stack.Screen name="[projectId]" options={{ title: 'Project Details' }} />
    </Stack>
  );
}