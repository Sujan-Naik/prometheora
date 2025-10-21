import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TabBarHeights = {
  outer: number;
  profile: number;
  handle: number;
};

const TabBarHeightContext = createContext<{
  heights: TabBarHeights;
  setHeight: (level: keyof TabBarHeights, height: number) => void;
  getTotalHeight: (upToLevel: keyof TabBarHeights) => number;
}>({
  heights: { outer: 0, profile: 0, handle: 0 },
  setHeight: () => {},
  getTotalHeight: () => 0,
});

export function TabBarHeightProvider({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  const [heights, setHeights] = useState<TabBarHeights>({
    outer: insets.bottom,
    profile: 0,
    handle: 0,
  });

  // Update outer height when insets change
  useEffect(() => {
    setHeights(prev => ({ ...prev, outer: insets.bottom }));
  }, [insets.bottom]);

  const setHeight = (level: keyof TabBarHeights, height: number) => {
    setHeights(prev => ({ ...prev, [level]: height }));
  };

  const getTotalHeight = (upToLevel: keyof TabBarHeights) => {
    switch (upToLevel) {
      case 'outer':
        return heights.outer;
      case 'profile':
        return heights.outer + heights.profile;
      case 'handle':
        return heights.outer + heights.profile + heights.handle;
      default:
        return 0;
    }
  };

  return (
    <TabBarHeightContext.Provider value={{ heights, setHeight, getTotalHeight }}>
      {children}
    </TabBarHeightContext.Provider>
  );
}

export const useTabBarHeight = () => useContext(TabBarHeightContext);