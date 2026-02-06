import { HapticTab } from '@/components/tabs/HapticTab';
import BlurTabBarBackground from '@/components/tabs/TabBarBackground';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform, View } from 'react-native';
import TabIcon from '../../components/tabs/TabIcon';
import colors from '../../theme/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.brand.primary,
        tabBarInactiveTintColor: colors.text.DEFAULT,
        headerShown: false,
        popToTopOnBlur: false /* true may create void*/,
        tabBarLabelPosition: 'below-icon',
        tabBarButton: HapticTab,
        tabBarBackground: BlurTabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute'
          },
          default: {}
        }),
        animation: 'shift' /* fade may create void*/
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: props => (
            <TabIcon {...props} activeName="home" inactiveName="home-outline" />
          )
        }}
      />
      <Tabs.Screen
        name="trip"
        options={{
          title: 'Trip',
          tabBarIcon: props => (
            <TabIcon {...props} activeName="map" inactiveName="map-outline" />
          )
        }}
      />
      <Tabs.Screen
        name="trip-generator"
        options={{
          tabBarLabelStyle: {
            display: 'none'
          },
          tabBarIcon: ({ focused, color }) => (
            <View
              className="mb-5 h-[60px] w-[60px] items-center justify-center rounded-full bg-colors-brand-primary"
              style={{ opacity: focused ? 1 : 0.8 }}
            >
              <Ionicons
                name="add"
                color={colors.surface.background}
                size={24}
              />
            </View>
          )
        }}
      />
      <Tabs.Screen
        name="rewards"
        options={{
          title: 'Rewards',
          tabBarIcon: props => (
            <TabIcon {...props} activeName="gift" inactiveName="gift-outline" />
          )
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: props => (
            <TabIcon
              {...props}
              activeName="person"
              inactiveName="person-outline"
            />
          )
        }}
      />
    </Tabs>
  );
}
