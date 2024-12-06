import { NavigationContainer, ParamListBase, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign, MaterialIcons, Ionicons } from '@expo/vector-icons';

import Profile from './profile';
import Workout from './workout';
import History from './history';
import Exercise from './exercise';
import Scan from './scan';

import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from 'react';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import { TabsParamList } from '@/types/navigation';
import useSystemTheme from '@/hooks/useSystemTheme';
import { PaperProvider } from 'react-native-paper';
import { useTabNavigation } from '@/hooks/useTabsNavigation';
import { useHistoryStore } from '@/store/useHistoryStore';
import { useExerciseStore } from '@/store/useExerciseStore';
import { useUserStore } from '@/store/useUserStore';
import asyncStore from '@/lib/asyncStore';
import { User } from '@/types/user';
import { useTrainerStore } from '@/store/useTrainerStore';

const Tab = createBottomTabNavigator<TabsParamList>();

type Preferences = {
  firstTime: boolean,
  darkMode: boolean,
  userFitnessLevel: string,
  height: number,
  weight: number
}

export default function TabsLayout() {

  const systemTheme = useSystemTheme()

  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()
  const { fetchHistory } = useHistoryStore()
  const { fetchExercise } = useExerciseStore()
  const { getUserInfo, user, getUserPreferences } = useUserStore()
  const { fetchTrainerTemplates } = useTrainerStore()

  useEffect(() => {
    const userAuth = SecureStore.getItem('user')
    if (!userAuth) return navigation.replace('Login')
    const parsedUserAuth: User = JSON.parse(userAuth)
    if (!parsedUserAuth) return navigation.replace('Login')

    if (!parsedUserAuth.isEmailValid) return navigation.replace('Verification')
  }, [])

  useEffect(() => {
    const checkFirstTime = async () => {
      try {
        const firstTimeData = await asyncStore.getItem('preferences');
        console.log(firstTimeData)
        
        if (!firstTimeData) {
          // Initialize preferences if not found
          const defaultPreferences = {
            firstTime: false,
            darkMode: false,
            fitnessLevel: 'Beginner',
            height: 172,
            weight: 70
          };
          await asyncStore.setItem('preferences', defaultPreferences);
          await getUserPreferences()
          return;
        }
        
        const preferences: Preferences = JSON.parse(firstTimeData);

        if (user.isEmailValid) {
          if (preferences.firstTime) {
            return navigation.replace('Disclaimer');
          } else {
            return navigation.navigate('Tabs');
          }
        }
      } catch (error) {
        console.error("Error fetching or processing preferences:", error);
      }
    };
  
    checkFirstTime()
  }, [])
  

  useEffect(() => {
    fetchHistory()
    fetchExercise()
    getUserInfo()
  }, [])

  return (
    <PaperProvider theme={systemTheme}>
      <NavigationContainer theme={systemTheme} independent={true} ref={useTabNavigation}>
        <Tab.Navigator 
          screenOptions={{
            headerShown: false, 
            tabBarStyle: {backgroundColor: 'transparent', borderTopWidth: 0, shadowColor: 'red', shadowOffset: {width: -420, height: 100}, shadowRadius: 20, shadowOpacity: 0.3, padding: 2, elevation: 0},
            tabBarActiveTintColor: systemTheme.colors.primary,
            tabBarInactiveTintColor: 'gray',
          }}>
          <Tab.Screen name="Profile" component={Profile} options={{
              title: 'Profile',
              tabBarLabelStyle: {fontSize: 10},
              tabBarIcon: ({color}) => <AntDesign name="user" size={30} color={color} />,
            }}
          />
          <Tab.Screen name="Workout" component={Workout} options={{
              title: 'Start Workout',
              tabBarLabelStyle: {fontSize: 10},
              tabBarIcon: ({color}) => <AntDesign name="plus" size={30} color={color} />,
            }}
          />
          <Tab.Screen name="Scan" component={Scan} options={{
              title: 'Scanner',
              tabBarLabelStyle: {fontSize: 10},
              tabBarIcon: ({color}) => <AntDesign name="scan1" size={30} color={color} />,
            }}
          />
          <Tab.Screen name="History" component={History} options={{
              title: 'History',
              tabBarLabelStyle: {fontSize: 10},
              tabBarIcon: ({color}) => <MaterialIcons name="history" size={30} color={color} />,
            }}
          />
          <Tab.Screen name="Exercise" component={Exercise} options={{
              title: 'Exercise',
              tabBarLabelStyle: {fontSize: 10},
              tabBarIcon: ({color}) => <Ionicons name="barbell" size={30} color={color} />,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}