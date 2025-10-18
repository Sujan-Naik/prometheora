// components/UserCard.tsx
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router';
import { IUser } from '@/types/prisma';

interface UserCardProps {
  user: IUser;
  showBio?: boolean;
  onPress?: () => void;
}

export default function UserCard({ user, showBio = true, onPress }: UserCardProps) {
  const profileImage = user.media?.[0]?.url;
  const roles = user.userRoles?.map(r => r.role) || [];

  const content = (
    <View className="bg-white rounded-lg p-4 mb-3 border border-gray-200">
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {profileImage ? (
          <Image
            source={{ uri: profileImage }}
            style={{ width: 60, height: 60, borderRadius: 30, marginRight: 12 }}
          />
        ) : (
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: '#e0e0e0',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 12,
            }}
          >
            <Text style={{ fontSize: 24 }}>👤</Text>
          </View>
        )}

        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#000' }}>
            {user.handle || 'Anonymous'}
          </Text>
          <Text style={{ fontSize: 14, color: '#666', marginTop: 2 }}>
            {user.email}
          </Text>
          {roles.length > 0 && (
            <View style={{ flexDirection: 'row', marginTop: 4, gap: 4 }}>
              {roles.map((role, idx) => (
                <View
                  key={idx}
                  style={{
                    backgroundColor: role === 'ADMIN' ? '#ff3b30' : role === 'CREATOR' ? '#007aff' : '#34c759',
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 12,
                  }}
                >
                  <Text style={{ fontSize: 10, color: '#fff', fontWeight: '600' }}>
                    {role}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>

      {showBio && user.bio && (
        <Text style={{ marginTop: 12, fontSize: 14, color: '#333', lineHeight: 20 }}>
          {user.bio}
        </Text>
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