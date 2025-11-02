import { FlatList, View } from "react-native";
import { Text } from '@/components/ThemedText';

import { useUser } from "../../../hooks/UserContext";
import UserCard from "@/components/UserCard";
import ProjectCard from "@/components/ProjectCard";
import LoadingScreen from "@/components/LoadingScreen";
import {Link} from "expo-router";

export default function ProfileScreen() {
  const { user, loading } = useUser();

  if (loading) return <LoadingScreen message="Loading profile..." />;
  if (!user) return (
    <View className="error-container">
      <Text className="error-text">No user found</Text>
    </View>
  );

  console.log(user.portfolioItems)
  return (
    <View style={{ flex: 1 }} className={"page-container"} >
      <View className="basic-container ">
        <Text className="title">Your Private Profile Dashboard</Text>
        <UserCard user={user} />

        <Text className="section-title">To-do</Text>
        {/*{user.portfolioItems?.length===0 && <Text>Add more in*/}
        {/*  <Link href={"/settings/portfolio"}>your portfolio settings</Link></Text>*/}
        {/*}*/}
        {/*<FlatList*/}
        {/*  data={user.portfolioItems}*/}
        {/*  keyExtractor={item => item.id.toString()}*/}
        {/*  renderItem={({ item }) => (*/}
        {/*    <ProjectCard project={item.project!} />*/}
        {/*  )}*/}
        {/*/>*/}
      </View>
    </View>
  );
}
