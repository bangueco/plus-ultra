import { useRootNavigation } from "@/hooks/useRootNavigation";
import useSystemTheme from "@/hooks/useSystemTheme";
import { SecureStore } from "@/lib/secureStore";
import authService from "@/services/auth.service";
import { useUserStore } from "@/store/useUserStore";
import { User } from "@/types/user";
import { StackActions } from "@react-navigation/native";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Icon, Text } from "react-native-paper";

export default function Verification () {

  const { colors } = useSystemTheme()

  const { user, getUserInfo } = useUserStore()

  useEffect(() => {

    getUserInfo()

    if (user.isEmailValid) {
      return useRootNavigation.dispatch(StackActions.replace('Disclaimer'))
    } else {
      return
    }

  }, [])

  useEffect(() => {

    const isEmailVerified = async () => {
      const status = await authService.isEmailValid(user.username)
      const userInfo = await SecureStore.getItemAsync('user')

      if (!userInfo) {
        return useRootNavigation.dispatch(StackActions.replace('Login'))
      }


      if (!status.verified) {
        console.log("User is not verified yet.")
      } else {
        const parsedUserInfo: User = JSON.parse(userInfo)
        parsedUserInfo.isEmailValid = true
        await SecureStore.setItemAsync('user', JSON.stringify(parsedUserInfo))

        return useRootNavigation.dispatch(StackActions.replace('Disclaimer'))
      }
    }

    const intervalId = setInterval(() => {
      isEmailVerified()
    }, 5000); // 5000 milliseconds = 5 seconds

    return () => {
      clearInterval(intervalId)
    }

  }, [])

  return (
    <View style={styles.verificationContainer}>
      <Icon
        source="email"
        color={colors.primary}
        size={60}
      />
      <Text style={{textAlign: 'center'}}>A verification link has been sent to {user.email}. Please confirm your email in-order to continue.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  verificationContainer: {
    paddingTop: '15%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    padding: 10
  }
})