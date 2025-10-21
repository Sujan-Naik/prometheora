import { useState } from 'react';
import { Tabs, TabSlot, TabList, TabTrigger } from 'expo-router/ui';
import { TabButton } from '@/components/TabButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStatus } from '@/hooks/useAuthStatus';
import { useTabBarHeight } from '@/context/TabBarHeightContext';

export default function TabsContent() {
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAuthStatus();
  const { setOuterTabBarHeight } = useTabBarHeight();
  const [measured, setMeasured] = useState(false);

  if (isAuthenticated === null) return null;

  return (
    <Tabs key={isAuthenticated ? 'auth' : 'unauth'}>
      <TabSlot />

      <TabList
        style={{ paddingBottom: insets.bottom, opacity: measured ? 1 : 0, bottom: 0 }}
          className="tab-list tab-list-web"
        onLayout={(e) => {
          setOuterTabBarHeight(e.nativeEvent.layout.height);
          if (!measured) setMeasured(true);
        }}
      >
        <TabTrigger name="home" href="/" asChild>
          <TabButton icon="🏠">Home</TabButton>
        </TabTrigger>

        {isAuthenticated && (
          <>
            <TabTrigger name="blog" href="/blog" asChild>
              <TabButton icon="📝">Blog</TabButton>
            </TabTrigger>
            <TabTrigger name="patron" href="/patron" asChild>
              <TabButton icon="❤️">Patron</TabButton>
            </TabTrigger>
            <TabTrigger name="creator" href="/creator" asChild>
              <TabButton icon="✨">Creator</TabButton>
            </TabTrigger>
            <TabTrigger name="profile" href="/profile" asChild>
              <TabButton icon="👤">Profile</TabButton>
            </TabTrigger>
            <TabTrigger name="settings" href="/settings" asChild>
              <TabButton icon="⚙️">Settings</TabButton>
            </TabTrigger>
          </>
        )}
      </TabList>
    </Tabs>
  );
}