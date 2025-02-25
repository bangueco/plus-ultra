import { StyleSheet, Text, View } from "react-native";
import CustomPressable from "@/components/custom/CustomPressable";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { useEffect } from "react";
import useSystemTheme from "@/hooks/useSystemTheme";
import * as SecureStore from 'expo-secure-store';
import { useMigrationHelper } from "@/lib/drizzleClient";
import seed from "@/db/seed";
import LoadingScreen from "@/components/LoadingScreen";

const Welcome = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const {colors} = useSystemTheme()

  useEffect(() => {
    const user = SecureStore.getItem('user')
    if (user) return navigation.replace('Tabs')
  }, [])

  const { success, error } = useMigrationHelper();

  if (error) {
    return (
      <View>
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }

  if (!success) {
    return (
      <LoadingScreen />
    );
  }

  if (success) {
    // If migration is successful, seed the database
    seed()
    .then(() => console.log('Table seeded'))
    .catch(console.error)
  }

  return (
    <View style={style.container}>
      <View style={{gap: 5, alignItems: 'center'}}>
        <CustomPressable
            onPress={() => navigation.replace('Register')}
            text="Get Started"
            textStyle={{fontSize: 20}}
            buttonStyle={{padding: 10, borderRadius: 5, backgroundColor: colors.primary}}
        />
        <Text style={{color: colors.text}}>
          Already have account? <Text style={{color: 'skyblue', textDecorationLine: 'underline'}} onPress={() => navigation.replace('Login')}>Login</Text> here.
        </Text>
      </View>
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    display: 'flex',
    height: '100%',
    justifyContent: 'center'
  }
})

export default Welcome