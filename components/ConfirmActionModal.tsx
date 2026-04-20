import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import colors from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps, ReactNode } from 'react';
import { Modal, Pressable, View } from 'react-native';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

interface ConfirmActionModalProps {
  visible: boolean;
  icon: IoniconName;
  iconContainerClassName?: string;
  title: string;
  message: ReactNode;
  cancelLabel?: string;
  confirmLabel: string;
  /** When set, shown instead of a spinner while `pending` (e.g. "Ending…"). */
  confirmPendingLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
  pending?: boolean;
}

export function ConfirmActionModal({
  visible,
  icon,
  iconContainerClassName = colors.status.error,
  title,
  message,
  cancelLabel = 'Cancel',
  confirmLabel,
  confirmPendingLabel,
  onCancel,
  onConfirm,
  pending = false
}: ConfirmActionModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable
        className="flex-1 items-center justify-center bg-black/55 p-6"
        onPress={onCancel}
      >
        <Pressable
          className="w-full gap-3 rounded-2xl bg-colors-surface-background p-6"
          onPress={() => {}}
        >
          <View className="items-center pb-1">
            <View
              className={`h-14 w-14 items-center justify-center rounded-full ${iconContainerClassName}`}
            >
              <Ionicons name={icon} size={26} color={colors.status.error} />
            </View>
          </View>

          <AppText variant="subtitle" className="text-center font-semibold">
            {title}
          </AppText>

          <AppText variant="muted" className="text-center">
            {message}
          </AppText>

          <View className="mt-1 flex-row gap-2.5">
            <Button
              title={cancelLabel}
              onPress={onCancel}
              disabled={pending}
              className="h-14 flex-1 border border-slate-200 bg-white"
              textColor={colors.text.DEFAULT}
            />
            <Button
              title={pending ? confirmPendingLabel || '' : confirmLabel}
              onPress={onConfirm}
              isLoading={pending && !confirmPendingLabel}
              disabled={pending}
              className="flex-1 bg-colors-status-error font-semibold"
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
