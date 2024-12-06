import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { ParamListBase, useNavigation, useTheme } from "@react-navigation/native";

import authService from "@/services/auth.service";

import CustomPressable from "@/components/custom/CustomPressable";

import { AxiosError } from "axios";
import ErrorMessage from "@/components/custom/ErrorMessage";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { TextInput } from "react-native-paper";

import * as SecureStore from 'expo-secure-store'
import asyncStore from "@/lib/asyncStore";
import { useRootNavigation } from "@/hooks/useRootNavigation";
import { DatePickerInput } from "react-native-paper-dates";
import { Role, User } from "@/types/user";
import { useUserStore } from "@/store/useUserStore";
import RNPickerSelect from 'react-native-picker-select';

export default function Register () {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()
  const { colors } = useTheme();

  const { getUserInfo } = useUserStore()

  const [username, setUsername] = useState<string | undefined>(undefined)
  const [email, setEmail] = useState<string | undefined>(undefined)
  const [password, setPassword] = useState<string | undefined>(undefined)
  const [confirmPassword, setConfirmPassword] = useState<string | undefined>(undefined)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [birthdate, setBirthDate] = useState<Date | undefined>(undefined)
  const [role, setRole] = useState<Role | undefined>(undefined)

  const [usernameErrorMessage, setUsernameErrorMessage] = useState<string>('')
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>('')
  const [birthDateErrorMessage, setBirthDateErrorMessage] = useState<string>('')
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState<string>('')
  const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>('')
  const [roleErrorMessage, setRoleErrorMessage] = useState<string>('')

  const userRole = [
    {label: "user", value: "USER"},
    {label: "trainer", value: "TRAINER"}
  ]

  const clearErrorMessage = () => {
    setUsernameErrorMessage('')
    setEmailErrorMessage('')
    setConfirmPasswordErrorMessage('')
    setPasswordErrorMessage('')
    setBirthDateErrorMessage('')
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
        } else if (data.field === 'birthdate') {
          setBirthDateErrorMessage(data.message)
        } else if (data.field === 'role') {
          setRoleErrorMessage(data.message)
        }
      })
    } else if (error instanceof AxiosError && error.response?.data) {
      console.log(error.response.data.message)
      if (error.response.data.field === 'username') {
        setUsernameErrorMessage(error.response.data.message)
      } else if (error.response.data.field === 'email') {
        setEmailErrorMessage(error.response.data.message)
      } else if (error.response.data.field === 'birthdate') {
        setBirthDateErrorMessage(error.response.data.message)
      } else if (error.response.data.field === 'role') {
        setRoleErrorMessage(error.response.data.message)
      }
    } else if (error instanceof AxiosError) {
      Alert.alert(error.message)
    } else {
      Alert.alert('Unknown error has occured')
    }
  }

  const onPressRegister = async () => {
    try {
      clearErrorMessage()
      if (password !== confirmPassword) return setConfirmPasswordErrorMessage('Passwords must be identical to each other.')
      await authService.register(username, email, password, birthdate, role)
      // TODO: Automatic login when registered user, but before that, navigate to setup page.
      const userInfo: User = await authService.login(username, password)
      await SecureStore.setItemAsync('user', JSON.stringify(userInfo))
      getUserInfo()
      await asyncStore.setItem('preferences', {firstTime: true, darkMode: false})
      return useRootNavigation.navigate('Verification')
    } catch (error: unknown) {
      if (error instanceof AxiosError) handleErrorMessage(error)
    }
  }

  const handleChangeText = (setter: React.Dispatch<React.SetStateAction<string | undefined>>) => (text: string) => {
    setter(text === '' ? undefined : text);
  };

  const onValueChangeRole = (value: Role) => {
    return setRole(value)
  }

  return(
    <View style={styles.container}>
      <View style={styles.registerContainer}>
        <Text style={{fontWeight: '800', fontSize: 23, color: colors.text, padding: 10}}>Create New Account</Text>
        <View style={
            {
              width: '100%', 
              padding: 5,
              gap: 10
            }
          }>
          <View>
            <TextInput
              mode="outlined"
              label="Username"
              left={<TextInput.Icon icon="account" />}
              onChangeText={handleChangeText(setUsername)}
            />
            {usernameErrorMessage && <ErrorMessage text={usernameErrorMessage} />}
          </View>
          <View>
            <TextInput
              mode="outlined"
              label="Email"
              left={<TextInput.Icon icon="email" />}
              onChangeText={handleChangeText(setEmail)}
            />
            {emailErrorMessage && <ErrorMessage text={emailErrorMessage} />}
          </View>
          <View style={{flexDirection: 'row'}}>
            <DatePickerInput
              locale="en"
              label="Birthdate"
              value={birthdate}
              onChange={(d) => setBirthDate(d)}
              inputMode="start"
              mode="outlined"
            />
          </View>
          {birthDateErrorMessage && <ErrorMessage text={birthDateErrorMessage} />}
          <View>
            <RNPickerSelect
              style={{inputAndroid: {color: colors.text}}}
              onValueChange={onValueChangeRole}
              items={userRole}
              placeholder={{label: 'What is your role?'}}
            />
          </View>
          {roleErrorMessage && <ErrorMessage text={roleErrorMessage} />}
          <View>
            <TextInput
              mode="outlined"
              label="Password"
              secureTextEntry={!showPassword}
              left={<TextInput.Icon icon="lock" />}
              right={<TextInput.Icon onPress={() => setShowPassword(!showPassword)} icon={showPassword ? 'eye' : 'eye-off'} />}
              onChangeText={handleChangeText(setPassword)}
            />
            {passwordErrorMessage && <ErrorMessage text={passwordErrorMessage} />}
          </View>
          <View>
            <TextInput
              mode="outlined"
              label="Confirm Password"
              secureTextEntry={!showPassword}
              left={<TextInput.Icon icon="lock" />}
              right={<TextInput.Icon onPress={() => setShowPassword(!showPassword)} icon={showPassword ? 'eye' : 'eye-off'} />}
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