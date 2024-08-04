import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Welcome from './pages';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import TabsLayout from './pages/(tabs)/_layout';
import { AppTheme } from '@/constants/theme';
import { RootNativeStackParamList } from '@/types/navigation';
import { rootNavigationRef } from '@/hooks/useNavigationRef';

const Stack = createNativeStackNavigator<RootNativeStackParamList>()

export default function RootLayout() {

  return (
    <NavigationContainer theme={AppTheme} independent={true} ref={rootNavigationRef}>
      <Stack.Navigator>
        <Stack.Screen name="Welcome" component={Welcome} options={{headerShown: false}} />
        <Stack.Screen name="Login" component={Login} options={{headerShown: false}} />
        <Stack.Screen name="Register" component={Register} options={{headerShown: false}} />
        <Stack.Screen name="Tabs" component={TabsLayout} options={{headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}