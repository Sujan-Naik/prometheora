import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ThemedText';
import { ITier } from '@/types/prisma';

interface TierCardProps {
  tier: ITier;
  isSubscribed?: boolean;
  onSubscribe?: () => void;
  onManage?: () => void;
}

export default function TierCard({ tier, isSubscribed = false, onSubscribe, onManage }: TierCardProps) {
  return (
    <View className="card" style={{ borderColor: isSubscribed ? 'var(--success-color)' : 'var(--secondary-color)' }}>
      {isSubscribed && (
        <View className="absolute top-3 right-3 tag bg-success">
          <Text className="tag-text">✓ ACTIVE</Text>
        </View>
      )}
      <Text className="section-title">{tier.name}</Text>
      <View className="flex-row items-baseline mb-3">
        <Text className="text-4xl font-bold" style={{ color: 'var(--primary-color)' }}>${tier.price}</Text>
        <Text className="subtitle ml-1">/ month</Text>
      </View>
      <Text className="content-text mb-4">{tier.benefits}</Text>
      {isSubscribed ? (
        onManage && (
          <TouchableOpacity
            onPress={onManage}
            className="action-button"
            style={{
              backgroundColor: 'var(--background-color)',
              borderColor: 'var(--primary-color)',
              borderWidth: 1
            }}
          >
            <Text className="action-button-text" style={{ color: 'var(--primary-color)' }}>Manage Subscription</Text>
          </TouchableOpacity>
        )
      ) : (
        onSubscribe && (
          <TouchableOpacity onPress={onSubscribe} className="button">
            <Text className="button-text">Subscribe Now</Text>
          </TouchableOpacity>
        )
      )}
      {tier.creator && (
        <Text className="status-text mt-2 text-center">
          Supporting @{tier.creator.handle || 'anonymous'}
        </Text>
      )}
    </View>
  );
}