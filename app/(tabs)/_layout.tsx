import { Tabs } from 'expo-router';
import TabIcon from '../../components/tabs/TabIcon';
import colors from '../../theme/colors';

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        headerShown: false,
        tabBarLabelPosition: 'below-icon'
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
