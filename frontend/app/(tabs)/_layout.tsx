import { useState, useRef } from 'react';
import { Tabs, TabSlot, TabList, TabTrigger } from 'expo-router/ui';
import { TabButton } from '@/components/TabButton';
import { useAuthStatus } from '@/hooks/useAuthStatus';
import { useTabBarHeight } from '@/context/TabBarHeightContext';

export default function TabsContent() {
  const { isAuthenticated } = useAuthStatus();
  const { setHeight } = useTabBarHeight();
  const [measured, setMeasured] = useState(false);
  const hasMeasured = useRef(false);

  if (isAuthenticated) {
      return (
          <Tabs key={isAuthenticated ? 'auth' : 'unauth'}>
              <TabSlot/>

              <TabList
                  style={{opacity: measured ? 1 : 0, bottom: 0}}
                  className="tab-list tab-list-web"
                  onLayout={(e) => {
                      if (!hasMeasured.current) {
                          setHeight('outer', e.nativeEvent.layout.height);
                          hasMeasured.current = true;
                          setMeasured(true);
                      }
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
  else{
      return (
          <Tabs key={isAuthenticated ? 'auth' : 'unauth'}>
              <TabSlot/>

              <TabList
                  style={{opacity: measured ? 1 : 0, bottom: 0}}
                  className="tab-list tab-list-web"
                  onLayout={(e) => {
                      if (!hasMeasured.current) {
                          setHeight('outer', e.nativeEvent.layout.height);
                          hasMeasured.current = true;
                          setMeasured(true);
                      }
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
}