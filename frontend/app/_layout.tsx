import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Welcome from './pages';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import TabsLayout from './pages/(tabs)/_layout';
import { RootNativeStackParamList } from '@/types/navigation';
import { rootNavigationRef } from '@/hooks/useNavigationRef';
import useSystemTheme from '@/hooks/useSystemTheme';
import { PaperProvider } from 'react-native-paper';

const Stack = createNativeStackNavigator<RootNativeStackParamList>()

export default function RootLayout() {

  const systemTheme = useSystemTheme()

  return (
    <PaperProvider theme={systemTheme}>
      <NavigationContainer theme={systemTheme} independent={true} ref={rootNavigationRef}>
        <Stack.Navigator>
          <Stack.Screen name="Welcome" component={Welcome} options={{headerShown: false}} />
          <Stack.Screen name="Login" component={Login} options={{headerShown: false}} />
          <Stack.Screen name="Register" component={Register} options={{headerShown: false}} />
          <Stack.Screen name="Tabs" component={TabsLayout} options={{headerShown: false}} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  )
}