import { StyleSheet, Text, View } from "react-native";
import CustomPressable from "@/components/custom/CustomPressable";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { useEffect } from "react";
// import { exercisesDatabase, templatesDatabase } from "@/database";
import useSystemTheme from "@/hooks/useSystemTheme";
import * as SecureStore from 'expo-secure-store';
import { useMigrationHelper } from "@/lib/drizzleClient";

const Welcome = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const {colors} = useSystemTheme()

  // Initialize database here

  useEffect(() => {
    /* const setup = async () => {
      await templatesDatabase.seed()
      return await exercisesDatabase.seed()
    } */
    const user = SecureStore.getItem('user')
    if (user) return navigation.replace('Tabs')

    // setup()
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
      <View>
        <Text>Migration is in progress...</Text>
      </View>
    );
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