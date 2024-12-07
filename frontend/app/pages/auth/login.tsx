import { Alert, StyleSheet, Text, View } from "react-native";
import { ParamListBase, useNavigation, useTheme } from "@react-navigation/native";

import CustomPressable from "@/components/custom/CustomPressable";

import ErrorMessage from "@/components/custom/ErrorMessage";
import { useState, useEffect } from "react";
import authService from "@/services/auth.service";
import { AxiosError } from "axios";

import { TextInput } from 'react-native-paper';

import * as SecureStore from 'expo-secure-store';
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { Role, User } from "@/types/user";

export default function Login () {
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const [username, setUsername] = useState<string | undefined>()
  const [password, setPassword] = useState<string | undefined>()
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const [usernameErrorMessage, setUsernameErrorMessage] =  useState<string>('')
  const [passwordErrorMessage, setPasswordErrorMessage] =  useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const saveUserInfo = async (id: number, email: string, username: string, accessToken: string, refreshToken: string, birthdate: Date, isEmailValid: boolean, role: string, trainerId: number | null, approved: boolean) => {
    return await SecureStore.setItemAsync('user', JSON.stringify({id, username, email, accessToken, refreshToken, birthdate, isEmailValid, role, trainerId, approved}))
  }

  const clearErrorMessage = () => {
    setUsernameErrorMessage('')
    setPasswordErrorMessage('')
    setErrorMessage('')
  }

  const handleErrorMessage = (error: unknown) => {
    // Array of objects of zod error
    if (error instanceof AxiosError && Array.isArray(error.response?.data)) {
      error.response.data.map(data => {
        if (data.field === 'username') {
          setUsernameErrorMessage(data.message)
        } else if (data.field === 'password') {
          setPasswordErrorMessage(data.message)
        }
      })
    } else if (error instanceof AxiosError && error.response?.data) {
      if (error.response.data.field === 'username') {
        setUsernameErrorMessage(error.response.data.message)
      } else if (error.response.data.field === 'password') {
        setPasswordErrorMessage(error.response.data.message)
      } else {
        setErrorMessage(error.response.data.message)
      }
    } else if (error instanceof AxiosError) {
      Alert.alert(error.message)
    } else {
      Alert.alert('Unknown error has occured')
    }
  }

  const onPressLogin = async () => {
    try {
      clearErrorMessage()
      const user: User = await authService.login(username, password)
      await saveUserInfo(user.id, user.email, user.username, user.accessToken, user.refreshToken, user.birthdate, user.isEmailValid, user.role, user.trainerId, user.approved)
      return navigation.replace('Tabs')
    } catch (error: unknown) {
      if (error instanceof AxiosError) handleErrorMessage(error)
    }
  }

  const handleChangeText = (setter: React.Dispatch<React.SetStateAction<string | undefined>>) => (text: string) => {
    setter(text === '' ? undefined : text);
  };

  useEffect(() => {
    const user = SecureStore.getItem('user')
    if (user) navigation.replace('Tabs')
  }, [])

  return(
    <View style={styles.container}>
      <View style={styles.loginContainer}>
        <Text style={{fontWeight: '800',fontSize: 30, color: colors.text}}>Login</Text>
        <View style={
          {
            width: '100%', 
            padding: 10}}>
          <View style={{padding: 3}}>
            <TextInput
              mode="outlined"
              label="Username"
              left={<TextInput.Icon icon="account" />}
              onChangeText={handleChangeText(setUsername)}
            />
            {usernameErrorMessage && <ErrorMessage style={{marginTop: 3}} text={usernameErrorMessage} />}
          </View>
          <View style={{padding: 3}}>
            <TextInput
              mode="outlined"
              label="Password"
              secureTextEntry={!showPassword}
              left={<TextInput.Icon icon="lock" />}
              right={<TextInput.Icon onPress={() => setShowPassword(!showPassword)} icon={showPassword ? 'eye' : 'eye-off'} />}
              onChangeText={handleChangeText(setPassword)}
            />
            {(passwordErrorMessage || errorMessage) && <ErrorMessage style={{marginTop: 3}} text={passwordErrorMessage || errorMessage} />}
          </View>
          {/* <View style={{padding: 3, marginTop: 20}}>
            <Text style={{textAlign: 'right', color: colors.text}}>Forgot password?</Text>
          </View> */}
        </View>
        <CustomPressable
          text="Login"
          buttonStyle={{backgroundColor: colors.primary, width: '40%', height: 45, borderRadius: 10}}
          textStyle={{fontSize: 18, color: 'white'}}
          onPress={onPressLogin}
        />
        <View style={{paddingBottom: 10}}>
          <Text style={{color: colors.text}}>
            Don't have account yet? <Text style={{color: 'skyblue', textDecorationLine: 'underline'}} onPress={() => navigation.replace('Register')}>Register</Text> here
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
    gap: 10,
    borderRadius: 10,
    width: '85%',
    padding: 10
  },
})