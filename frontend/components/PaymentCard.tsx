// components/PaymentCard.tsx
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
    <View className="bg-white rounded-lg p-4 mb-3 border border-gray-200">
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Text style={{ fontSize: 24, marginRight: 8 }}>💳</Text>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#34c759' }}>
              ${payment.amount.toFixed(2)}
            </Text>
          </View>
          <Text style={{ fontSize: 12, color: '#666' }}>{paymentDate}</Text>
        </View>
        <View
          style={{
            backgroundColor: '#34c759',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
          }}
        >
          <Text style={{ fontSize: 10, color: '#fff', fontWeight: '600' }}>✓ PAID</Text>
        </View>
      </View>

      {payment.subscription && (
        <View
          style={{
            marginTop: 12,
            padding: 10,
            backgroundColor: '#f5f5f5',
            borderRadius: 8,
          }}
        >
          <Text style={{ fontSize: 12, color: '#666', marginBottom: 2 }}>For Subscription</Text>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#000' }}>
            {payment.subscription.tier?.name || 'Unknown Tier'}
          </Text>
          {payment.subscription.tier?.creator && (
            <Text style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
              @{payment.subscription.tier.creator.handle || 'anonymous'}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}