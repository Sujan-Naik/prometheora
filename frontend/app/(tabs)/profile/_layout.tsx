import { UserProvider } from "../../../hooks/UserContext";
import { Tabs, TabSlot, TabList, TabTrigger } from "expo-router/ui";
import { TabButton } from "@/components/TabButton";

export default function ProfileLayout() {
  return (
    <UserProvider>
      <Tabs>
        <TabSlot />

        {/* Hidden TabList for the dynamic route - registers it but doesn't show */}
        <TabList style={{ display: 'none' }}>
          <TabTrigger name="profile-handle" href="/profile/[handle]" />
        </TabList>

        {/* Visible TabList for your actual tabs */}
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