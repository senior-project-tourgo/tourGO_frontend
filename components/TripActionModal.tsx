import { AppText } from '@/components/AppText';
import colors from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, View } from 'react-native';

interface Props {
  visible: boolean;
  tripName: string;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function TripActionModal({
  visible,
  tripName,
  onClose,
  onEdit,
  onDelete
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* Dim backdrop */}
      <Pressable
        className="flex-1"
        style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
        onPress={onClose}
      />

      {/* Sheet */}
      <View className="rounded-t-3xl bg-colors-surface-background px-6 pb-10 pt-5">
        {/* Header */}
        <View className="mb-5 flex-row items-center justify-between">
          <AppText
            variant="subtitle"
            className="flex-1 font-semibold"
            numberOfLines={1}
          >
            {tripName}
          </AppText>
          <Pressable
            onPress={onClose}
            hitSlop={12}
            className="ml-3 h-8 w-8 items-center justify-center rounded-full bg-colors-surface-muted"
          >
            <Ionicons name="close" size={18} color={colors.text.DEFAULT} />
          </Pressable>
        </View>

        {/* Edit */}
        <Pressable
          onPress={onEdit}
          className="mb-3 flex-row items-center gap-3 rounded-2xl bg-colors-surface-muted px-4 py-4"
        >
          <View
            className="h-9 w-9 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.brand.neutrals }}
          >
            <Ionicons
              name="create-outline"
              size={18}
              color={colors.brand.secondary}
            />
          </View>
          <View className="flex-1">
            <AppText className="font-semibold">Edit Trip</AppText>
            <AppText variant="muted">Change name or places</AppText>
          </View>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={colors.brand.secondary}
          />
        </Pressable>

        {/* Delete */}
        <Pressable
          onPress={onDelete}
          className="flex-row items-center gap-3 rounded-2xl bg-red-50 px-4 py-4"
        >
          <View className="h-9 w-9 items-center justify-center rounded-full bg-red-100">
            <Ionicons
              name="trash-outline"
              size={18}
              color={colors.status.error}
            />
          </View>
          <View className="flex-1">
            <AppText
              className="font-semibold"
              style={{ color: colors.status.error }}
            >
              Delete Trip
            </AppText>
            <AppText variant="muted">This cannot be undone</AppText>
          </View>
        </Pressable>
      </View>
    </Modal>
  );
}
