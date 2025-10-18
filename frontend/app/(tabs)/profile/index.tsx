// app/profile/index.tsx
import {FlatList, ScrollView, Text} from "react-native";
import { useUser } from "./UserContext";
import UserCard from "@/components/UserCard";
import ProjectCard from "@/components/ProjectCard";

export default function ProfileScreen() {
  const { user, loading } = useUser();

  if (loading) return <Text>Loading...</Text>;
  if (!user) return <Text>No user found</Text>;

  return (
    <ScrollView className="container">
      <Text className="title">Profile Dashboard</Text>
      <UserCard user={user} />

        <FlatList
        data={user.portfolioItems}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <ProjectCard project={item.project!} />
        )}
      />
    </ScrollView>
  );
}