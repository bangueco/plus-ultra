import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { ParamListBase, useNavigation, useTheme } from "@react-navigation/native";

import authService from "@/services/auth.service";

import CustomBtn from "@/components/custom/CustomBtn";
import CustomPressable from "@/components/custom/CustomPressable";

import { AxiosError } from "axios";
import ErrorMessage from "@/components/custom/ErrorMessage";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { TextInput } from "react-native-paper";

export default function Register () {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()
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
    // Array of objects of zod error
    if (error instanceof AxiosError && Array.isArray(error.response?.data)) {
      error.response.data.map(data => {
        if (data.field === 'username') {
          setUsernameErrorMessage(data.message)
        } else if (data.field === 'email') {
          setEmailErrorMessage(data.message)
        } else if (data.field === 'password') {
          setPasswordErrorMessage(data.message)
        }
      })
    } else if (error instanceof AxiosError && error.response?.data) {
      console.log(error.response.data.message)
      if (error.response.data.field === 'username') {
        setUsernameErrorMessage(error.response.data.message)
      } else if (error.response.data.field === 'email') {
        setEmailErrorMessage(error.response.data.message)
      }
    }
  }

  const onPressRegister = async () => {
    try {
      clearErrorMessage()
      if (password !== confirmPassword) return setConfirmPasswordErrorMessage('Passwords must be identical to each other.')
      await authService.register(username, email, password)
      navigation.replace('Login')
      return Alert.alert('Registered Successfully')
    } catch (error: unknown) {
      if (error instanceof AxiosError) handleErrorMessage(error)
    }
  }

  const handleChangeText = (setter: React.Dispatch<React.SetStateAction<string | undefined>>) => (text: string) => {
    setter(text === '' ? undefined : text);
  };

  return(
    <View style={styles.container}>
      <View style={styles.registerContainer}>
        <Text style={{fontWeight: '800', fontSize: 23, color: colors.text, padding: 10}}>Create New Account</Text>
        <View style={
          {
            width: '100%', 
            padding: 10}
          }>
          <View style={{padding: 3}}>
            <TextInput
              mode="outlined"
              label="Username"
              left={<TextInput.Icon icon="account" />}
              onChangeText={handleChangeText(setUsername)}
            />
            {usernameErrorMessage && <ErrorMessage text={usernameErrorMessage} />}
          </View>
          <View style={{padding: 3}}>
            <TextInput
              mode="outlined"
              label="Email"
              left={<TextInput.Icon icon="email" />}
              onChangeText={handleChangeText(setEmail)}
            />
            {emailErrorMessage && <ErrorMessage text={emailErrorMessage} />}
          </View>
          <View style={{padding: 3}}>
            <TextInput
              mode="outlined"
              label="Password"
              secureTextEntry={true}
              left={<TextInput.Icon icon="lock" />}
              onChangeText={handleChangeText(setPassword)}
            />
            {passwordErrorMessage && <ErrorMessage text={passwordErrorMessage} />}
          </View>
          <View style={{padding: 3}}>
            <TextInput
              mode="outlined"
              label="Confirm Password"
              secureTextEntry={true}
              left={<TextInput.Icon icon="lock" />}
              onChangeText={handleChangeText(setConfirmPassword)}
            />
            {confirmPasswordErrorMessage && <ErrorMessage text={confirmPasswordErrorMessage} />}
          </View>
        </View>
        <CustomPressable
          text="Sign Up"
          buttonStyle={{backgroundColor: colors.primary, width: '40%', height: 45, borderRadius: 10}}
          textStyle={{fontSize: 18, color: 'white'}}
          onPress={onPressRegister}
        />
        <Text style={{color: colors.text}}>or</Text>
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
        <View style={{paddingBottom: 10}}>
          <Text style={{color: colors.text}}>
            Already have account? <Text style={{color: 'skyblue', textDecorationLine: 'underline'}} onPress={() => navigation.replace('Login')}>Login</Text> here
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
    borderRadius: 10,
    width: '85%',
    padding: 5
  },
})