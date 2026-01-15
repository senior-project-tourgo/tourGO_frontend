import { Tabs } from 'expo-router';
import TabIcon from '../../components/tabs/TabIcon';
import colors from '../../theme/colors';
import { HapticTab } from '@/components/tabs/HapticTab';
import BlurTabBarBackground from '@/components/tabs/TabBarBackground';
import { Platform } from 'react-native';

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        headerShown: false,
        tabBarLabelPosition: 'below-icon',
        tabBarButton: HapticTab,
        tabBarBackground: BlurTabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute'
          },
          default: {}
        }),
        animation: 'fade'
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
        name="itineraries"
        options={{
          title: 'Itineraries',
          tabBarIcon: props => (
            <TabIcon {...props} activeName="map" inactiveName="map-outline" />
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
