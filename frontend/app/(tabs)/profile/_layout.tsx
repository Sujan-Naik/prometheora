import { useRef } from 'react';
import { View } from 'react-native';
import { UserProvider } from '@/hooks/UserContext';
import { Tabs, TabSlot, TabList, TabTrigger } from 'expo-router/ui';
import { TabButton } from '@/components/TabButton';
import { useTabBarHeight } from '@/context/TabBarHeightContext';

export default function ProfileLayout() {
  const { getTotalHeight, setHeight } = useTabBarHeight();
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
          style={{ bottom: getTotalHeight('outer') }}
          onLayout={(e) => {
            if (!hasMeasured.current) {
              setHeight('profile', e.nativeEvent.layout.height);
              hasMeasured.current = true;
            }
          }}
        >
          <TabTrigger name="profile-home" href="/profile" asChild>
            <TabButton icon="🎨">Your Profile</TabButton>
          </TabTrigger>
          <TabTrigger name="profile-discover" href="/profile/discover" asChild>
            <TabButton icon="🧭">Discover</TabButton>
          </TabTrigger>
        </TabList>
      </Tabs>
    </UserProvider>
  );
}