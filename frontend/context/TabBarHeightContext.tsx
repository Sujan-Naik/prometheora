import { createContext, useContext, useState, ReactNode } from 'react';

const TabBarHeightContext = createContext<{
  outerTabBarHeight: number;
  setOuterTabBarHeight: (height: number) => void;
}>({
  outerTabBarHeight: 56,
  setOuterTabBarHeight: () => {},
});

export function TabBarHeightProvider({ children }: { children: ReactNode }) {
  const [outerTabBarHeight, setOuterTabBarHeight] = useState(56);


  return (
    <TabBarHeightContext.Provider value={{ outerTabBarHeight, setOuterTabBarHeight }}>
      {children}
    </TabBarHeightContext.Provider>
  );
}

export const useTabBarHeight = () => useContext(TabBarHeightContext);