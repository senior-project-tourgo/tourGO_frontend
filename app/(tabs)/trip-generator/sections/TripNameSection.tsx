import { AppTextInput } from '@/components/AppTextInput';

type TripNameSectionProps = {
  itineraryName: string;
  setItineraryName: (name: string) => void;
  submitted: boolean;
};

export default function TripNameSection({
  itineraryName,
  setItineraryName,
  submitted
}: TripNameSectionProps) {
  const isInvalid = submitted && !itineraryName.trim();

  return (
    <AppTextInput
      label="Trip Name"
      placeholder="e.g. Weekend in Pokhara"
      value={itineraryName}
      onChangeText={setItineraryName}
      required
      error={isInvalid ? 'Itinerary name is required' : undefined}
    />
  );
}
