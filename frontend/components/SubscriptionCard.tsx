// components/SubscriptionCard.tsx
import { View, Text, TouchableOpacity } from 'react-native';
import { ISubscription } from '@/types/prisma';

interface SubscriptionCardProps {
  subscription: ISubscription;
  onCancel?: () => void;
  onViewCreator?: () => void;
}

export default function SubscriptionCard({ subscription, onCancel, onViewCreator }: SubscriptionCardProps) {
  const startDate = new Date(subscription.startDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const endDate = subscription.endDate
    ? new Date(subscription.endDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  const isActive = !subscription.endDate || new Date(subscription.endDate) > new Date();
  const totalPayments = subscription.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;

  return (
    <View className="bg-white rounded-lg p-4 mb-4 border-2" style={{ borderColor: isActive ? '#34c759' : '#e0e0e0' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#000', marginBottom: 4 }}>
            {subscription.tier?.name || 'Unknown Tier'}
          </Text>
          {subscription.tier?.creator && (
            <Text style={{ fontSize: 14, color: '#666' }}>
              Supporting @{subscription.tier.creator.handle || 'anonymous'}
            </Text>
          )}
        </View>
        <View
          style={{
            backgroundColor: isActive ? '#34c759' : '#8e8e93',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
          }}
        >
          <Text style={{ fontSize: 10, color: '#fff', fontWeight: '600' }}>
            {isActive ? '✓ ACTIVE' : '✕ ENDED'}
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 12, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ fontSize: 12, color: '#666' }}>Monthly Price</Text>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#007aff' }}>
            ${subscription.tier?.price || 0}/mo
          </Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ fontSize: 12, color: '#666' }}>Started</Text>
          <Text style={{ fontSize: 12, color: '#333' }}>{startDate}</Text>
        </View>
        {endDate && (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ fontSize: 12, color: '#666' }}>Ended</Text>
            <Text style={{ fontSize: 12, color: '#333' }}>{endDate}</Text>
          </View>
        )}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 12, color: '#666' }}>Total Paid</Text>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#34c759' }}>
            ${totalPayments.toFixed(2)}
          </Text>
        </View>
      </View>

      {subscription.tier?.benefits && (
        <View style={{ marginTop: 12, padding: 12, backgroundColor: '#fff8e1', borderRadius: 8 }}>
          <Text style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>✨ Benefits</Text>
          <Text style={{ fontSize: 13, color: '#333' }}>{subscription.tier.benefits}</Text>
        </View>
      )}

      <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
        {onViewCreator && (
          <TouchableOpacity
            onPress={onViewCreator}
            style={{
              flex: 1,
              backgroundColor: '#007aff',
              padding: 12,
              borderRadius: 8,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>
              View Creator
            </Text>
          </TouchableOpacity>
        )}
        {isActive && onCancel && (
          <TouchableOpacity
            onPress={onCancel}
            style={{
              flex: 1,
              backgroundColor: '#fff',
              borderWidth: 1,
              borderColor: '#ff3b30',
              padding: 12,
              borderRadius: 8,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#ff3b30', fontSize: 14, fontWeight: '600' }}>
              Cancel
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}