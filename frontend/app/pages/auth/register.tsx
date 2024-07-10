import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { Link, useTheme } from "@react-navigation/native";

import authService from "@/services/auth.service";

import CustomTextInput from "@/components/custom/CustomTextInput";
import CustomBtn from "@/components/custom/CustomBtn";
import CustomPressable from "@/components/custom/CustomPressable";

import { AxiosError } from "axios";
import ErrorMessage from "@/components/custom/ErrorMessage";

export default function Register () {
  const { colors } = useTheme();

  const [username, setUsername] = useState<string | undefined>(undefined)
  const [email, setEmail] = useState<string | undefined>(undefined)
  const [password, setPassword] = useState<string | undefined>(undefined)
  const [confirmPassword, setConfirmPassword] = useState<string | undefined>(undefined)

  const [usernameErrorMessage, setUsernameErrorMessage] = useState<string>('')
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>('')
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState<string>('')
  const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>('')

  const clearErrorMessage = () => {
    setUsernameErrorMessage('')
    setEmailErrorMessage('')
    setConfirmPasswordErrorMessage('')
    setPasswordErrorMessage('')
  }

  const handleErrorMessage = (error: unknown) => {
    if (error instanceof AxiosError && Array.isArray(error.response?.data)) {
      error.response.data.map(data => {
        if (data.error.path === 'username') {
          setUsernameErrorMessage(data.error.message)
        } else if (data.error.path === 'email') {
          setEmailErrorMessage(data.error.message)
        } else if (data.error.path === 'password') {
          setPasswordErrorMessage(data.error.message)
        }
      })
    } else if (error instanceof AxiosError && error.response?.data) {
      if (error.response.data.error.path === 'username') {
        setUsernameErrorMessage(error.response.data.error.message)
      } else if (error.response.data.error.path === 'email') {
        setEmailErrorMessage(error.response.data.error.message)
      }
    }
  }

  const onPressRegister = async () => {
    try {
      clearErrorMessage()
      if (password !== confirmPassword) return setConfirmPasswordErrorMessage('Passwords must be identical to each other.')
      await authService.register(username, email, password)
      return Alert.alert('Registered Succesfully')
    } catch (error: unknown) {
      if (error instanceof AxiosError) handleErrorMessage(error)
    }
  }

  const handleChangeText = (setter: React.Dispatch<React.SetStateAction<string | undefined>>) => (text: string) => {
    setter(text === '' ? undefined : text);
  };

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
              onChangeText={handleChangeText(setUsername)}
            />
            <ErrorMessage text={usernameErrorMessage} />
          </View>
          <View style={{padding: 3, marginTop: 10}}>
            <CustomTextInput
              placeholder="Enter email"
              onChangeText={handleChangeText(setEmail)}
            />
            <ErrorMessage text={emailErrorMessage} />
          </View>
          <View style={{padding: 3, marginTop: 10}}>
            <CustomTextInput
              secureTextEntry={true}
              placeholder="Enter password"
              onChangeText={handleChangeText(setConfirmPassword)}
            />
            <ErrorMessage text={passwordErrorMessage} />
          </View>
          <View style={{padding: 3, marginTop: 10}}>
            <CustomTextInput
              secureTextEntry={true}
              placeholder="Confirm password"
              onChangeText={handleChangeText(setPassword)}
            />
            <ErrorMessage text={confirmPasswordErrorMessage} />
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