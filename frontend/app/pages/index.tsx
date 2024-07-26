import { StyleSheet, Text, View } from "react-native";
import CustomPressable from "@/components/custom/CustomPressable";
import { Link, ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { useEffect } from "react";
import { exercisesDatabase } from "@/database";

const Welcome = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  // Initialize database here

  useEffect(() => {
    exercisesDatabase.seed()
  }, [])

  return (
    <View style={style.container}>
      <View style={{gap: 5, alignItems: 'center'}}>
        <CustomPressable text="Get Started" textStyle={{fontSize: 30}} buttonStyle={{width: '40%'}} />
        <Text style={{color: 'white'}}>
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