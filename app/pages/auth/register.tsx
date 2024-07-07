import { Alert, StyleSheet, Text, View } from "react-native";
import { Link, useTheme } from "@react-navigation/native";

import CustomTextInput from "@/components/custom/CustomTextInput";
import CustomBtn from "@/components/custom/CustomBtn";
import CustomPressable from "@/components/custom/CustomPressable";

import authService from "@/services/auth.service";
import { useState } from "react";
import { AxiosError } from "axios";

export default function Register () {
  const { colors } = useTheme();

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onPressRegister = async () => {
    try {
      await authService.register(username, email, password)
      Alert.alert('Registered Succesfully')
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response?.data) {
        Alert.alert(error.response.data.error)
      }
    }
  }

  return(
    <View style={styles.container}>
      <View style={[styles.registerContainer, {backgroundColor: colors.card}]}>
        <Text style={{fontWeight: '800', fontSize: 23, color: colors.text}}>Create New Account</Text>
        <View style={
          {
            width: '100%', 
            padding: 10}
          }>
          <View style={{padding: 3, marginTop: 10}}>
            <CustomTextInput
              placeholder="Enter username"
              onChangeText={(e) => setUsername(e)}
            />
          </View>
          <View style={{padding: 3, marginTop: 10}}>
            <CustomTextInput
              placeholder="Enter email"
              onChangeText={(e) => setEmail(e)}
            />
          </View>
          <View style={{padding: 3, marginTop: 10}}>
            <CustomTextInput
              secureTextEntry={true}
              placeholder="Enter password"
            />
          </View>
          <View style={{padding: 3, marginTop: 10}}>
            <CustomTextInput
              secureTextEntry={true}
              placeholder="Confirm password"
              onChangeText={(e) => setPassword(e)}
            />
          </View>
        </View>
        <CustomPressable
          text="Sign Up"
          buttonStyle={{backgroundColor: '#5A72A0', width: '40%', height: 45, borderRadius: 10}}
          textStyle={{fontSize: 18, color: 'white'}}
          onPress={onPressRegister}
        />
        <Text>or</Text>
        <View style={{display: 'flex', justifyContent: 'center', alignItems:'center', gap: 10, width: '100%', padding: 10}}>
          <CustomBtn
            iconName="facebook-square"
            iconSize={25}
            text="Sign Up with Facebook"
            buttonStyle={{backgroundColor: '#3C66C4', width: '80%'}}
            textStyle={{fontSize: 14, color: 'white'}}
          />
          <CustomBtn
            iconName="google"
            iconSize={25}
            text="Sign Up With Google"
            buttonStyle={{backgroundColor: '#CF4332', width: '80%'}}
            textStyle={{fontSize: 14, color: 'white'}}
          />
        </View>
        <View>
          <Text style={{color: colors.text}}>
            Already have account yet? <Link style={{color: 'skyblue', textDecorationLine: 'underline'}} to={{ screen: 'Login'}}>Login</Link> here
          </Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  registerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    borderRadius: 30,
    width: '85%',
    padding: 10
  },
})