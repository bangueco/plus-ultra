import { NavigationContainer, ParamListBase, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign, MaterialIcons, Ionicons } from '@expo/vector-icons';

import Profile from './profile';
import Workout from './workout';
import History from './history';
import Exercise from './exercise';
import Scan from './scan';

import * as SecureStore from "expo-secure-store";
import { useEffect } from 'react';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import { AppTheme } from '@/constants/theme';
import { TabsParamList } from '@/types/navigation';
import { tabNavigationRef } from '@/hooks/useNavigationRef';

const Tab = createBottomTabNavigator<TabsParamList>();

export default function TabsLayout() {

  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()

  useEffect(() => {
    const user = SecureStore.getItem('token')
    if (!user) navigation.navigate('Login')
  }, [])

  return (
    <NavigationContainer theme={AppTheme} independent={true} ref={tabNavigationRef}>
      <Tab.Navigator 
        screenOptions={{
          headerShown: false, 
          tabBarStyle: {backgroundColor: 'transparent', borderTopWidth: 1, padding: 2, elevation: 0},
          tabBarActiveTintColor: AppTheme.colors.border,
          tabBarInactiveTintColor: 'gray',
        }}>
        <Tab.Screen name="Profile" component={Profile} options={{
            title: 'Profile',
            tabBarLabelStyle: {fontSize: 12},
            tabBarIcon: ({color}) => <AntDesign name="user" size={30} color={color} />,
          }}
        />
        <Tab.Screen name="Workout" component={Workout} options={{
            title: 'Start Workout',
            tabBarLabelStyle: {fontSize: 12},
            tabBarIcon: ({color}) => <AntDesign name="plus" size={30} color={color} />,
          }}
        />
        <Tab.Screen name="Scan" component={Scan} options={{
            title: 'Scanner',
            tabBarLabelStyle: {fontSize: 12},
            tabBarIcon: ({color}) => <AntDesign name="scan1" size={30} color={color} />,
          }}
        />
        <Tab.Screen name="History" component={History} options={{
            title: 'History',
            tabBarLabelStyle: {fontSize: 12},
            tabBarIcon: ({color}) => <MaterialIcons name="history" size={30} color={color} />,
          }}
        />
        <Tab.Screen name="Exercise" component={Exercise} options={{
            title: 'Exercise',
            tabBarLabelStyle: {fontSize: 12},
            tabBarIcon: ({color}) => <Ionicons name="barbell" size={30} color={color} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}