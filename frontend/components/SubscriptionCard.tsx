import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ThemedText';

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
    <View className="card" style={{ borderColor: isActive ? 'var(--success-color)' : 'var(--secondary-color)' }}>
      <View className="card-header">
        <View className="flex-1">
          <Text className="section-title">{subscription.tier?.name || 'Unknown Tier'}</Text>
          {subscription.tier?.creator && (
            <Text className="subtitle">
              Supporting @{subscription.tier.creator.handle || 'anonymous'}
            </Text>
          )}
        </View>
        <View className={`tag ${isActive ? 'bg-success' : 'bg-neutral'}`}>
          <Text className="tag-text">{isActive ? '✓ ACTIVE' : '✕ ENDED'}</Text>
        </View>
      </View>

      <View className="quoted-container">
        <View className="flex-row justify-between mb-2">
          <Text className="status-text">Monthly Price</Text>
          <Text className="text-sm font-semibold text-blue-500">
            ${subscription.tier?.price || 0}/mo
          </Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="status-text">Started</Text>
          <Text className="status-text">{startDate}</Text>
        </View>
        {endDate && (
          <View className="flex-row justify-between mb-2">
            <Text className="status-text">Ended</Text>
            <Text className="status-text">{endDate}</Text>
          </View>
        )}
        <View className="flex-row justify-between">
          <Text className="status-text">Total Paid</Text>
          <Text className="text-sm font-semibold text-success">
            ${totalPayments.toFixed(2)}
          </Text>
        </View>
      </View>

      {subscription.tier?.benefits && (
        <View className="benefit-container">
          <Text className="status-text mb-1">✨ Benefits</Text>
          <Text className="text-sm text-gray-800">{subscription.tier.benefits}</Text>
        </View>
      )}

      <View className="action-container">
        {onViewCreator && (
          <TouchableOpacity onPress={onViewCreator} className="action-button bg-blue-500">
            <Text className="action-button-text text-white">View Creator</Text>
          </TouchableOpacity>
        )}
        {isActive && onCancel && (
          <TouchableOpacity
            onPress={onCancel}
            className="action-button border border-error"
            style={{ backgroundColor: 'var(--background-color)' }}
          >
            <Text className="action-button-text text-error">Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}