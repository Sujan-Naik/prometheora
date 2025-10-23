import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router';
import { Role, IMedia, IUserRole } from '@/types/prisma';

interface UserCardData {
  id: number;
  handle?: string | null;
  bio?: string | null;
  media?: IMedia[] | null;
  userRoles?: IUserRole[] | null;
}

interface UserCardProps {
  user: UserCardData;
  showBio?: boolean;
  onPress?: () => void;
}

export default function UserCard({ user, showBio = true, onPress }: UserCardProps) {
  const profileImage = user.media?.[0]?.url;
  const roles = user.userRoles?.map(r => r.role) || [];

  const content = (
    <View className="card">
      <View className="flex-row items-center">
        {profileImage ? (
          <Image source={{ uri: profileImage }} className="profile-image" />
        ) : (
          <View className="placeholder-image">
            <Text className="text-2xl">👤</Text>
          </View>
        )}

        <View className="flex-1">
          <Text className="text-lg font-semibold text-black">
            {user.handle || 'Anonymous'}
          </Text>
          {roles.length > 0 && (
            <View className="flex-row mt-1 gap-1">
              {roles.map((role, idx) => (
                <View
                  key={idx}
                  className={`role-tag ${
                    role === Role.ADMIN ? 'bg-error' : role === Role.CREATOR ? 'bg-blue-500' : 'bg-success'
                  }`}
                >
                  <Text className="tag-text">{role}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>

      {showBio && user.bio && (
        <Text className="content-text">{user.bio}</Text>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  if (user.handle) {
    return (
      <Link href={`/(tabs)/profile/${user.handle}`} asChild>
        <TouchableOpacity activeOpacity={0.7}>
          {content}
        </TouchableOpacity>
      </Link>
    );
  }

  return content;
}