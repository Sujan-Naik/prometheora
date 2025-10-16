// app/blog/_layout.tsx
import { Tabs, TabSlot, TabList, TabTrigger, TabTriggerSlotProps } from 'expo-router/ui';
import { Text, Pressable } from 'react-native';
import { useAdmin } from '@/hooks/useAdmin';

export default function BlogLayout() {
  const isAdmin = useAdmin();

  return (
    <Tabs>
      <TabSlot />
      <TabList className="tab-list tab-list-web tab-list-native">
        <TabTrigger name="blog-home" href="/blog" asChild>
          <TabButton icon="📰">All Posts</TabButton>
        </TabTrigger>

        {isAdmin && (
          <>
            <TabTrigger name="blog-create" href="/blog/create" asChild>
              <TabButton icon="✏️">Create</TabButton>
            </TabTrigger>
            <TabTrigger name="blog-drafts" href="/blog/drafts" asChild>
              <TabButton icon="📄">Drafts</TabButton>
            </TabTrigger>
          </>
        )}
      </TabList>
    </Tabs>
  );
}

type TabButtonProps = TabTriggerSlotProps & { icon: string; children: string };

function TabButton({ icon, children, isFocused, ...props }: TabButtonProps) {
  return (
    <Pressable {...props} className={`tab-button ${isFocused ? 'tab-button-focused' : ''}`}>
      <Text className="tab-icon">{icon}</Text>
      <Text className={`tab-label ${isFocused ? 'tab-label-focused' : ''}`}>{children}</Text>
    </Pressable>
  );
}
