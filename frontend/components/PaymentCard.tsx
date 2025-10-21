import { View, Text } from 'react-native';
import { IPayment } from '@/types/prisma';

interface PaymentCardProps {
  payment: IPayment;
}

export default function PaymentCard({ payment }: PaymentCardProps) {
  const paymentDate = new Date(payment.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View className="card">
      <View className="card-header">
        <View className="flex-1 flex-row items-center">
          <Text className="text-2xl mr-2">💳</Text>
          <Text className="section-title text-success">${payment.amount.toFixed(2)}</Text>
        </View>
        <View className="tag bg-success">
          <Text className="tag-text">✓ PAID</Text>
        </View>
      </View>
      <Text className="date-text">{paymentDate}</Text>

      {payment.subscription && (
        <View className="quoted-container">
          <Text className="status-text mb-1">For Subscription</Text>
          <Text className="text-sm font-semibold text-black">
            {payment.subscription.tier?.name || 'Unknown Tier'}
          </Text>
          {payment.subscription.tier?.creator && (
            <Text className="status-text mt-1">
              @{payment.subscription.tier.creator.handle || 'anonymous'}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}