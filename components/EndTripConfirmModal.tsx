import { AppText } from '@/components/AppText';
import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, View } from 'react-native';

interface EndTripConfirmModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  ending: boolean;
}

export function EndTripConfirmModal({
  visible,
  onCancel,
  onConfirm,
  ending
}: EndTripConfirmModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: 'rgba(0,0,0,0.55)', padding: 24 }}
        onPress={onCancel}
      >
        <Pressable
          className="w-full rounded-2xl bg-white p-6"
          style={{ gap: 12 }}
          onPress={() => {}}
        >
          <View className="items-center pb-1">
            <View className="h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <Ionicons name="flag-outline" size={26} color="#ef4444" />
            </View>
          </View>
          <AppText variant="subtitle" className="text-center font-semibold">
            End Trip?
          </AppText>
          <AppText variant="muted" className="text-center">
            This will complete your trip and show a summary. You won&apos;t be
            able to check in after this.
          </AppText>
          <View className="mt-1 flex-row gap-2">
            <Pressable
              onPress={onCancel}
              className="flex-1 items-center rounded-xl border border-slate-200 py-3"
              style={{ borderWidth: 1.5 }}
            >
              <AppText className="font-semibold">Cancel</AppText>
            </Pressable>
            <Pressable
              onPress={onConfirm}
              disabled={ending}
              className="flex-1 items-center rounded-xl bg-red-500 py-3"
            >
              <AppText className="font-semibold text-white">
                {ending ? 'Ending…' : 'End Trip'}
              </AppText>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
