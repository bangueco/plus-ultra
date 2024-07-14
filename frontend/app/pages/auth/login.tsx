import { Alert, StyleSheet, Text, View } from "react-native";
import { Link, ParamListBase, StackNavigationState, useNavigation } from "@react-navigation/native";

import CustomTextInput from "@/components/custom/CustomTextInput";
import CustomBtn from "@/components/custom/CustomBtn";
import CustomPressable from "@/components/custom/CustomPressable";

import ErrorMessage from "@/components/custom/ErrorMessage";
import { useState, useEffect } from "react";
import authService from "@/services/auth.service";
import { AxiosError } from "axios";

import * as SecureStore from 'expo-secure-store';
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";

export default function Login () {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const [username, setUsername] = useState<string | undefined>()
  const [password, setPassword] = useState<string | undefined>()

  const [usernameErrorMessage, setUsernameErrorMessage] =  useState<string>('')
  const [passwordErrorMessage, setPasswordErrorMessage] =  useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const saveUserToken = async (token: string) => {
    await SecureStore.setItemAsync('token', token)
  }

  const clearErrorMessage = () => {
    setUsernameErrorMessage('')
    setPasswordErrorMessage('')
    setErrorMessage('')
  }

  const handleErrorMessage = (error: unknown) => {
    if (error instanceof AxiosError && Array.isArray(error.response?.data)) {
      error.response.data.map(data => {
        if (data.error.path === 'username') {
          setUsernameErrorMessage(data.error.message)
        } else if (data.error.path === 'password') {
          setPasswordErrorMessage(data.error.message)
        }
      })
    } else if (error instanceof AxiosError && error.response?.data) {
      if (error.response.data.error.path === 'username') {
        setUsernameErrorMessage(error.response.data.error.message)
      } else if (error.response.data.error.path === 'password') {
        setPasswordErrorMessage(error.response.data.error.message)
      } else {
        setErrorMessage(error.response.data.error)
      }
    }
  }

  const onPressLogin = async () => {
    try {
      clearErrorMessage()
      const user = await authService.login(username, password)
      saveUserToken(user.token)
      navigation.navigate('Tabs')
      return Alert.alert('Login Succesfully')
    } catch (error: unknown) {
      if (error instanceof AxiosError) handleErrorMessage(error)
    }
  }

  const handleChangeText = (setter: React.Dispatch<React.SetStateAction<string | undefined>>) => (text: string) => {
    setter(text === '' ? undefined : text);
  };

  return(
    <View style={styles.container}>
      <View style={styles.loginContainer}>
        <Text style={{fontWeight: '800',fontSize: 30, color: 'white'}}>Login</Text>
        <View style={
          {
            width: '100%', 
            padding: 10}}>
          <View style={{padding: 3}}>
            <CustomTextInput
              placeholder="Enter username"
              onChangeText={handleChangeText(setUsername)}
            />
            <ErrorMessage text={usernameErrorMessage} />
          </View>
          <View style={{padding: 3, marginTop: 10}}>
            <CustomTextInput
              secureTextEntry={true}
              placeholder="Enter password"
              onChangeText={handleChangeText(setPassword)}
            />
            <ErrorMessage text={passwordErrorMessage} />
          </View>
          <ErrorMessage text={errorMessage} style={{marginTop: 10}} />
          <View style={{padding: 3}}>
            <Text style={{textAlign: 'right'}}>Forgot password?</Text>
          </View>
        </View>
        <CustomPressable
          text="Login"
          buttonStyle={{backgroundColor: '#5A72A0', width: '40%', height: 45, borderRadius: 10}}
          textStyle={{fontSize: 18, color: 'white'}}
          onPress={onPressLogin}
        />
        <Text>or</Text>
        <View style={{display: 'flex', justifyContent: 'center', alignItems:'center', gap: 10, width: '100%', padding: 10}}>
          <CustomBtn
            iconName="facebook-square"
            iconSize={25}
            text="Login with Facebook"
            buttonStyle={{backgroundColor: '#3C66C4', width: '80%'}}
            textStyle={{fontSize: 14, color: 'white'}}
          />
          <CustomBtn
            iconName="google"
            iconSize={25}
            text="Login With Google"
            buttonStyle={{backgroundColor: '#CF4332', width: '80%'}}
            textStyle={{fontSize: 14, color: 'white'}}
          />
        </View>
        <View>
          <Text style={{color: 'white'}}>
            Don't have account yet? <Link style={{color: 'skyblue', textDecorationLine: 'underline'}} to={{ screen: 'Register'}}>Register</Link> here
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
  loginContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#42506A',
    gap: 10,
    borderRadius: 30,
    width: '85%',
    padding: 10
  },
})