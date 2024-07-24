import { NavigationContainer, ParamListBase, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign, MaterialIcons, Ionicons } from '@expo/vector-icons';

import Profile from './profile';
import Workout from './workout';
import History from './history';
import Exercise from './exercise';

import * as SecureStore from "expo-secure-store";
import { useEffect } from 'react';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import { AppTheme } from '@/constants/theme';

const Tab = createBottomTabNavigator();

export default function TabsLayout() {

  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()

  useEffect(() => {
    const user = SecureStore.getItem('token')
    if (!user) navigation.navigate('Login')
  }, [])

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
        <Tab.Screen name="History" component={History} options={{
            title: 'History',
            tabBarLabelStyle: {color: 'white', fontSize: 14},
            tabBarIcon: ({}) => <MaterialIcons name="history" size={25} color="white" />,
          }}
        />
        <Tab.Screen name="Exercise" component={Exercise} options={{
            title: 'Exercise',
            tabBarLabelStyle: {color: 'white', fontSize: 14},
            tabBarIcon: ({}) => <Ionicons name="barbell" size={25} color="white" />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}