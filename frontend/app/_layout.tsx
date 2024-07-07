import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './pages/auth/login';
import Register from './pages/auth/register';
import TabsLayout from './pages/(tabs)/_layout';

const Stack = createNativeStackNavigator()

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

export default function RootLayout() {

  return (
    <NavigationContainer theme={AppTheme} independent={true}>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} options={{headerShown: false}} />
        <Stack.Screen name="Register" component={Register} options={{headerShown: false}} />
        <Stack.Screen name="Tabs" component={TabsLayout} options={{headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}