import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager
} from 'react-native';
import dayjs from 'dayjs';

type DropdownCalendarProps = {
  value?: Date;
  onChange?: (date: Date) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
};

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

export const DropdownCalendar: React.FC<DropdownCalendarProps> = ({
  value,
  onChange,
  placeholder = 'Select Date',
  minDate,
  maxDate
}) => {
  const today = dayjs();
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(
    value ? dayjs(value) : today
  );

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen(!isOpen);
  };

  const startOfMonth = currentMonth.startOf('month');
  const daysInMonth = currentMonth.daysInMonth();
  const startDay = startOfMonth.day();

  const dates = useMemo(() => {
    const arr: (dayjs.Dayjs | null)[] = [];

    for (let i = 0; i < startDay; i++) arr.push(null);
    for (let i = 1; i <= daysInMonth; i++) {
      arr.push(currentMonth.date(i));
    }

    return arr;
  }, [currentMonth, daysInMonth, startDay]);

  const isDisabled = (date: dayjs.Dayjs) => {
    if (minDate && date.isBefore(dayjs(minDate), 'day')) return true;
    if (maxDate && date.isAfter(dayjs(maxDate), 'day')) return true;
    return false;
  };

  const isSelected = (date: dayjs.Dayjs) => {
    return value && date.isSame(dayjs(value), 'day');
  };

  const handleSelect = (date: dayjs.Dayjs) => {
    onChange?.(date.toDate());
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen(false);
  };

  return (
    <View className="w-full">
      {/* Collapsed Bar */}
      <TouchableOpacity
        onPress={toggle}
        className="flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3"
      >
        <Text className={`${value ? 'text-black' : 'text-gray-400'}`}>
          {value ? dayjs(value).format('DD MMM YYYY') : placeholder}
        </Text>
        <Text className="text-lg">{isOpen ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {/* Dropdown Calendar */}
      {isOpen && (
        <View className="mt-3 rounded-2xl bg-white p-4 shadow">
          {/* Header */}
          <View className="mb-4 flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => setCurrentMonth(currentMonth.subtract(1, 'month'))}
            >
              <Text className="text-lg">{'<'}</Text>
            </TouchableOpacity>

            <Text className="text-base font-bold">
              {currentMonth.format('MMMM YYYY')}
            </Text>

            <TouchableOpacity
              onPress={() => setCurrentMonth(currentMonth.add(1, 'month'))}
            >
              <Text className="text-lg">{'>'}</Text>
            </TouchableOpacity>
          </View>

          {/* Week Days */}
          <View className="mb-2 flex-row justify-between">
            {WEEK_DAYS.map(d => (
              <Text
                key={d}
                className="flex-1 text-center text-xs text-gray-400"
              >
                {d}
              </Text>
            ))}
          </View>

          {/* Dates */}
          <View className="flex-row flex-wrap">
            {dates.map((date, index) => {
              if (!date) {
                return <View key={index} className="w-1/7 h-12" />;
              }

              const disabled = isDisabled(date);
              const selected = isSelected(date);
              const isToday = date.isSame(today, 'day');

              return (
                <TouchableOpacity
                  key={index}
                  disabled={disabled}
                  onPress={() => handleSelect(date)}
                  className="w-1/7 h-12 items-center justify-center"
                >
                  <View
                    className={`
                      h-9 w-9 items-center justify-center rounded-full
                      ${selected ? 'bg-black' : ''}
                      ${isToday && !selected ? 'border border-black' : ''}
                    `}
                  >
                    <Text
                      className={`
                        text-sm
                        ${selected ? 'font-semibold text-white' : 'text-black'}
                        ${disabled ? 'text-gray-300' : ''}
                      `}
                    >
                      {date.date()}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
};
