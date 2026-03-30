import { AppText } from '@/components/AppText';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';

interface DuringTripMapHeaderProps {
  tripName: string;
  onEndTrip: () => void;
  ending: boolean;
}

export function DuringTripMapHeader({
  tripName,
  onEndTrip,
  ending
}: DuringTripMapHeaderProps) {
  return (
    <View className="absolute left-0 right-0 top-0 z-10 flex-row items-center justify-between px-4 pb-3 pt-14">
      <View className="flex-row items-center gap-2">
        <TouchableOpacity
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full bg-colors-surface-background"
        >
          <Ionicons name="chevron-back" size={22} color="#111" />
        </TouchableOpacity>
        <View className="rounded-2xl bg-colors-surface-background px-3 py-1.5 shadow-sm">
          <AppText
            variant="subtitle"
            className="font-semibold"
            numberOfLines={1}
          >
            {tripName}
          </AppText>
        </View>
      </View>

      <TouchableOpacity
        onPress={onEndTrip}
        disabled={ending}
        className="rounded-full bg-red-500 px-5 py-2.5"
      >
        <AppText variant="body" className="font-semibold text-white">
          {ending ? 'Ending…' : 'End Trip'}
        </AppText>
      </TouchableOpacity>
    </View>
  );
}
