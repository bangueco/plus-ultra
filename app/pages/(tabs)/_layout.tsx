import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign } from '@expo/vector-icons';

import Profile from './profile';
import Workout from './workout';

const Tab = createBottomTabNavigator();

const AppTheme = {
  dark: false,
  colors: {
    primary: '#204079',
    background: '#204079',
    card: '#42506A',
    text: '#FFFFFF',
    border: '#86BBD8',
    notification: '#42506A',
  },
};

export default function TabsLayout() {
  return (
    <NavigationContainer theme={AppTheme} independent={true}>
      <Tab.Navigator 
        screenOptions={{
          headerShown: false, 
          tabBarStyle: {backgroundColor: 'transparent', borderTopWidth: 0, padding: 5, marginBottom: 10, elevation: 0},
        }}>
        <Tab.Screen name="Profile" component={Profile} options={{
            title: 'Profile',
            tabBarLabelStyle: {color: 'white', fontSize: 14},
            tabBarIcon: ({}) => <AntDesign name="user" size={25} color="white" />,
          }}
        />
        <Tab.Screen name="Workout" component={Workout} options={{
            title: 'Start Workout',
            tabBarLabelStyle: {color: 'white', fontSize: 14},
            tabBarIcon: ({}) => <AntDesign name="plus" size={25} color="white" />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}