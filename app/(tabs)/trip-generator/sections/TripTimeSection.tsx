import { View } from 'react-native';
import { Accordion } from '@/components/Accordion';
import { AppText } from '@/components/AppText';
import DatePickerBar from '@/components/DatePickerBar';
import { TimePickerBar } from '@/components/TimePickerBar';
import { IconTile } from '@/components/IconTile';
import {
  TIME_WINDOW_OPTIONS,
  TIME_WINDOW_RANGES,
  type TimeWindowValue
} from '@/constants/timeOptions';

type TripTimeSectionProps = {
  tripDate: Date | null;
  setTripDate: (date: Date | null) => void;
  tripDateError?: string;
  setTripDateError: (error?: string) => void;
  startTime: Date | null;
  setStartTime: (date: Date | null) => void;
  endTime: Date | null;
  setEndTime: (date: Date | null) => void;
  timeWindow: TimeWindowValue | null;
  setTimeWindow: (value: TimeWindowValue | null) => void;
  timeWindowError?: string;
  setTimeWindowError: (error?: string) => void;
};

export default function TripTimeSection({
  tripDate,
  setTripDate,
  tripDateError,
  setTripDateError,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  timeWindow,
  setTimeWindow,
  timeWindowError,
  setTimeWindowError
}: TripTimeSectionProps) {
  const handleTimeWindowChange = (value: TimeWindowValue) => {
    setTimeWindow(value);
    setTimeWindowError(undefined);

    const range = TIME_WINDOW_RANGES[value];
    const start = new Date();
    const end = new Date();
    const [startH, startM] = range.start.split(':').map(Number);
    const [endH, endM] = range.end.split(':').map(Number);
    start.setHours(startH, startM, 0, 0);
    end.setHours(endH, endM, 0, 0);
    setStartTime(start);
    setEndTime(end);
  };

  const timeSummary =
    [
      timeWindow
        ? TIME_WINDOW_OPTIONS.find(o => o.value === timeWindow)?.label
        : startTime && endTime
          ? `${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – ${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
          : null,
      tripDate
        ? tripDate.toLocaleDateString([], { month: 'short', day: 'numeric' })
        : null
    ]
      .filter(Boolean)
      .join(' · ') || undefined;

  return (
    <Accordion
      icon="calendar-outline"
      title="When is your trip?"
      summary={timeSummary}
      completed={!!tripDate && (!!timeWindow || (!!startTime && !!endTime))}
    >
      <DatePickerBar
        label="Trip Date"
        value={tripDate}
        onChange={v => {
          setTripDate(v);
          setTripDateError(undefined);
        }}
        required
        error={tripDateError}
      />

      <View className="space-y-1.5">
        <AppText className="font-medium text-colors-text">
          Time of Day
          <AppText className="text-red-500"> *</AppText>
        </AppText>
        <View className="flex-row flex-wrap gap-2.5">
          {TIME_WINDOW_OPTIONS.map(option => (
            <IconTile
              key={option.value}
              icon={option.icon!}
              label={option.label}
              selected={timeWindow === option.value}
              onPress={() =>
                handleTimeWindowChange(option.value as TimeWindowValue)
              }
              width="47%"
            />
          ))}
        </View>
        {timeWindowError && (
          <AppText variant="caption" className="text-red-500">
            {timeWindowError}
          </AppText>
        )}
      </View>

      <View className="gap-1.5">
        <AppText className="text-secondary font-medium">
          Or set exact times
        </AppText>
        <View className="flex-row gap-2">
          <View className="flex-1">
            <TimePickerBar
              label="From"
              value={startTime ?? undefined}
              onChange={date => {
                setStartTime(date);
                setTimeWindow(null);
                if (endTime && date > endTime) setEndTime(date);
              }}
            />
          </View>
          <View className="flex-1">
            <TimePickerBar
              label="To"
              value={endTime ?? undefined}
              onChange={setEndTime}
              minimumDate={startTime ?? undefined}
            />
          </View>
        </View>
      </View>
    </Accordion>
  );
}
