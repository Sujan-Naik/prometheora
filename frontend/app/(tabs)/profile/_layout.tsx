// app/profile/_layout.tsx
import { UserProvider } from "../../../hooks/UserContext";
import { Tabs, TabSlot, TabList, TabTrigger } from "expo-router/ui";
import { TabButton } from "@/components/TabButton";

export default function ProfileLayout() {
  return (
    <UserProvider>
      <Tabs>
        <TabSlot />
        <TabList className="tab-list">
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