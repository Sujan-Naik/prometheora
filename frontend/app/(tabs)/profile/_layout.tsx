import { useRef } from 'react';
import { View } from 'react-native';
import { UserProvider } from '@/hooks/UserContext';
import { Tabs, TabSlot, TabList, TabTrigger } from 'expo-router/ui';
import { TabButton } from '@/components/TabButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTabBarHeight } from '@/context/TabBarHeightContext';

export default function ProfileLayout() {
  const insets = useSafeAreaInsets();
  const { outerTabBarHeight } = useTabBarHeight();
  const hasMeasured = useRef(false);

  return (
    <UserProvider>
      <Tabs>
        <View><TabSlot /></View>

        <TabList style={{ display: 'none' }}>
          <TabTrigger name="[handle]" href="/profile/[handle]" />
        </TabList>

        <TabList
          className="tab-list tab-list-web"
          style={{ bottom: outerTabBarHeight, paddingBottom: insets.bottom }}
          onLayout={() => {
            if (hasMeasured.current) return;
            hasMeasured.current = true;
          }}
        >
          <TabTrigger name="profile-home" href="/profile" asChild>
            <TabButton icon="🎨">Create</TabButton>
          </TabTrigger>
          <TabTrigger name="profile-discover" href="/profile/discover" asChild>
            <TabButton icon="🧭">Discover</TabButton>
          </TabTrigger>
        </TabList>
      </Tabs>
    </UserProvider>
  );
}