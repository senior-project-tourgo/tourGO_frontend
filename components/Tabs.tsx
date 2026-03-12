import React, { useRef, useState } from 'react';
import { View, Pressable, Animated, LayoutChangeEvent } from 'react-native';
import { AppText } from '@/components/AppText';

type TabItem = {
  label: string;
  value: string;
};

type TabsProps = {
  tabs: TabItem[];
  activeTab: string;
  onChange: (value: string) => void;
};

export function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  const translateX = useRef(new Animated.Value(0)).current;
  const [tabWidth, setTabWidth] = useState(0);

  const activeIndex = tabs.findIndex(t => t.value === activeTab);

  const handleLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width / tabs.length;
    setTabWidth(width);
  };

  React.useEffect(() => {
    Animated.spring(translateX, {
      toValue: activeIndex * tabWidth,
      useNativeDriver: true
    }).start();
  }, [activeIndex, tabWidth, translateX]);

  return (
    <View className="rounded-2xl bg-neutral-100 p-1" onLayout={handleLayout}>
      {/* Active Indicator */}
      <Animated.View
        style={{
          transform: [{ translateX }],
          width: tabWidth
        }}
        className="absolute h-full rounded-xl bg-white shadow-sm"
      />

      <View className="flex-row">
        {tabs.map(tab => {
          const isActive = tab.value === activeTab;

          return (
            <Pressable
              key={tab.value}
              onPress={() => onChange(tab.value)}
              className="flex-1 items-center justify-center py-2"
            >
              <AppText
                className={`text-sm ${
                  isActive ? 'font-semibold text-black' : 'text-neutral-500'
                }`}
              >
                {tab.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
