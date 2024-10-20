import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Welcome from './pages';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import TabsLayout from './pages/(tabs)/_layout';
import WorkoutSession from './pages/workout/session';

import { RootNativeStackParamList } from '@/types/navigation';
import useSystemTheme from '@/hooks/useSystemTheme';
import { PaperProvider } from 'react-native-paper';
import { useRootNavigation } from '@/hooks/useRootNavigation';
import { useDrizzleStudioHelper } from '@/lib/drizzleClient';
import { useUserStore } from '@/store/useUserStore';
import { useEffect } from 'react';

const Stack = createNativeStackNavigator<RootNativeStackParamList>()

export default function RootLayout() {
  useDrizzleStudioHelper()

  const systemTheme = useSystemTheme()

  return (
    <PaperProvider theme={systemTheme}>
      <NavigationContainer theme={systemTheme} independent={true} ref={useRootNavigation}>
        <Stack.Navigator screenOptions={{gestureEnabled: false, headerShown: false}}>
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Tabs" component={TabsLayout} />
          <Stack.Screen name="WorkoutSession"
            component={WorkoutSession}
            initialParams={{templateId: 0}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  )
}