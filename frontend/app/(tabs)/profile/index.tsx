import { FlatList, Text, View } from "react-native";
import { useUser } from "../../../hooks/UserContext";
import UserCard from "@/components/UserCard";
import ProjectCard from "@/components/ProjectCard";
import LoadingScreen from "@/components/LoadingScreen";

export default function ProfileScreen() {
  const { user, loading } = useUser();

  if (loading) return <LoadingScreen message="Loading profile..." />;
  if (!user) return (
    <View className="error-container">
      <Text className="error-text">No user found</Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }} >
      <View className="basic-container ">
        <Text className="title">Your Private Profile Dashboard</Text>
        <UserCard user={user} />

        <Text className="section-title">Your portfolio projects!</Text>
        <FlatList
          data={user.portfolioItems}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <ProjectCard project={item.project!} />
          )}
        />
      </View>
    </View>
  );
}
