import { StyleSheet, Text, View } from "react-native";
import { Link, useTheme } from "@react-navigation/native";

import CustomTextInput from "@/components/custom/CustomTextInput";
import CustomBtn from "@/components/custom/CustomBtn";
import CustomPressable from "@/components/custom/CustomPressable";

export default function Register () {
  const { colors } = useTheme();

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
            />
          </View>
          <View style={{padding: 3, marginTop: 10}}>
            <CustomTextInput
              placeholder="Enter email"
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
            />
          </View>
        </View>
        <CustomPressable
          text="Sign Up"
          buttonStyle={{backgroundColor: '#5A72A0', width: '40%', height: 45, borderRadius: 10}}
          textStyle={{fontSize: 18, color: 'white'}}
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
            Don't have account yet? <Link style={{color: 'skyblue', textDecorationLine: 'underline'}} to={{ screen: 'Login'}}>Login</Link> here
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