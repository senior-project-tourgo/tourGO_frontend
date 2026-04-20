import type { PlaceWithPromos } from '@/components/during-trip/DuringTripPlaceDetailSheet';
import colors from '@/theme/colors';
import { View } from 'react-native';

interface JourneyStepDotsProps {
  sortedPlaceData: PlaceWithPromos[];
  visitedIds: Set<string>;
  nextUnvisitedId: string | null;
}

export function JourneyStepDots({
  sortedPlaceData,
  visitedIds,
  nextUnvisitedId
}: JourneyStepDotsProps) {
  return (
    <View className="mb-2.5 flex-row items-center justify-center gap-1.5 px-4">
      {sortedPlaceData.map((pd, idx) => {
        const isVisited = visitedIds.has(pd.place.placeId);
        const isCurrent = pd.place.placeId === nextUnvisitedId;
        return (
          <View
            key={pd.place.placeId}
            className="items-center"
            style={{ gap: 2 }}
          >
            {idx > 0 && (
              <View
                style={{
                  position: 'absolute',
                  right: '50%',
                  top: isCurrent ? 4 : 3,
                  width: 6,
                  height: 2,
                  backgroundColor: isVisited
                    ? colors.status.success
                    : '#cbd5e1',
                  transform: [{ translateX: -6 }]
                }}
              />
            )}
            <View
              style={{
                width: isCurrent ? 12 : 8,
                height: isCurrent ? 12 : 8,
                borderRadius: 6,
                backgroundColor: isVisited
                  ? colors.status.success
                  : isCurrent
                    ? colors.brand.primary
                    : '#cbd5e1',
                borderWidth: isCurrent ? 2 : 0,
                borderColor: colors.surface.background
              }}
            />
          </View>
        );
      })}
    </View>
  );
}
