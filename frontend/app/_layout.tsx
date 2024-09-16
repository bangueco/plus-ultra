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

const Stack = createNativeStackNavigator<RootNativeStackParamList>()

export default function RootLayout() {

  const systemTheme = useSystemTheme()

  return (
    <PaperProvider theme={systemTheme}>
      <NavigationContainer theme={systemTheme} independent={true} ref={useRootNavigation}>
        <Stack.Navigator>
          <Stack.Screen name="Welcome" component={Welcome} options={{headerShown: false}} />
          <Stack.Screen name="Login" component={Login} options={{headerShown: false}} />
          <Stack.Screen name="Register" component={Register} options={{headerShown: false}} />
          <Stack.Screen name="Tabs" component={TabsLayout} options={{headerShown: false}} />
          <Stack.Screen name="WorkoutSession" 
            component={WorkoutSession}
            initialParams={{templateId: 0}}
            options={{headerShown: false, gestureEnabled: false}} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  )
}