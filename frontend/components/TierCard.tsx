// components/TierCard.tsx
import { View, Text, TouchableOpacity } from 'react-native';
import { ITier } from '@/types/prisma';

interface TierCardProps {
  tier: ITier;
  isSubscribed?: boolean;
  onSubscribe?: () => void;
  onManage?: () => void;
}

export default function TierCard({ tier, isSubscribed = false, onSubscribe, onManage }: TierCardProps) {
  return (
    <View className="bg-white rounded-lg p-4 mb-4 border-2" style={{ borderColor: isSubscribed ? '#34c759' : '#e0e0e0' }}>
      {isSubscribed && (
        <View
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            backgroundColor: '#34c759',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
          }}
        >
          <Text style={{ fontSize: 10, color: '#fff', fontWeight: '600' }}>✓ ACTIVE</Text>
        </View>
      )}

      <Text style={{ fontSize: 24, fontWeight: '700', color: '#000', marginBottom: 8 }}>
        {tier.name}
      </Text>

      <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 12 }}>
        <Text style={{ fontSize: 32, fontWeight: '700', color: '#007aff' }}>
          ${tier.price}
        </Text>
        <Text style={{ fontSize: 14, color: '#666', marginLeft: 4 }}>/ month</Text>
      </View>

      <Text style={{ fontSize: 14, color: '#333', lineHeight: 20, marginBottom: 16 }}>
        {tier.benefits}
      </Text>

      {isSubscribed ? (
        onManage && (
          <TouchableOpacity
            onPress={onManage}
            style={{
              backgroundColor: '#fff',
              borderWidth: 1,
              borderColor: '#007aff',
              padding: 12,
              borderRadius: 8,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#007aff', fontSize: 14, fontWeight: '600' }}>
              Manage Subscription
            </Text>
          </TouchableOpacity>
        )
      ) : (
        onSubscribe && (
          <TouchableOpacity
            onPress={onSubscribe}
            className="button"
          >
            <Text className="button-text">Subscribe Now</Text>
          </TouchableOpacity>
        )
      )}

      {tier.creator && (
        <Text style={{ fontSize: 12, color: '#999', marginTop: 8, textAlign: 'center' }}>
          Supporting @{tier.creator.handle || 'anonymous'}
        </Text>
      )}
    </View>
  );
}