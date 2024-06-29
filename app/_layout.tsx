import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './pages/auth/login';
import Register from './pages/auth/register';

const Stack = createNativeStackNavigator()

export default function RootLayout() {

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator>
        <Stack.Screen name ="Login" component={Login} options={{headerShown: false}} />
        <Stack.Screen name ="Register" component={Register} options={{headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}