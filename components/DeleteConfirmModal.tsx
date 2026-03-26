import { Modal, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/AppText';
import type { Trip } from '@/features/trip/trip.types';

export function DeleteConfirmModal({
  trip,
  onCancel,
  onConfirm,
  deleting
}: {
  trip: Trip | null;
  onCancel: () => void;
  onConfirm: () => void;
  deleting: boolean;
}) {
  return (
    <Modal
      visible={!!trip}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 24
        }}
        onPress={onCancel}
      >
        <Pressable
          style={{
            width: '100%',
            backgroundColor: '#fff',
            borderRadius: 20,
            padding: 24,
            gap: 12
          }}
          onPress={() => {}}
        >
          <View style={{ alignItems: 'center', paddingBottom: 4 }}>
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: '#fee2e2',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Ionicons name="trash-outline" size={26} color="#ef4444" />
            </View>
          </View>

          <AppText variant="subtitle" className="text-center font-semibold">
            Delete Trip?
          </AppText>
          <AppText variant="muted" className="text-center">
            &quot;{trip?.itineraryName}&quot; will be permanently deleted. This
            cannot be undone.
          </AppText>

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
            <Pressable
              onPress={onCancel}
              style={{
                flex: 1,
                borderRadius: 12,
                borderWidth: 1.5,
                borderColor: '#e2e8f0',
                paddingVertical: 12,
                alignItems: 'center'
              }}
            >
              <AppText className="font-semibold">Cancel</AppText>
            </Pressable>
            <Pressable
              onPress={onConfirm}
              disabled={deleting}
              style={{
                flex: 1,
                borderRadius: 12,
                backgroundColor: deleting ? '#fca5a5' : '#ef4444',
                paddingVertical: 12,
                alignItems: 'center'
              }}
            >
              <AppText style={{ color: '#fff' }} className="font-semibold">
                {deleting ? 'Deleting...' : 'Delete'}
              </AppText>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
