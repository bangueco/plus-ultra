import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './login';

const Stack = createNativeStackNavigator()

export default function RootLayout() {

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator>
        <Stack.Screen name ="Login" component={Login} options={{headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}