import { StyleSheet, Text, View } from "react-native";

import TextInput from "@/components/custom/CustomTextInput";
import CustomBtn from "@/components/CustomBtn";
import CustomPressable from "@/components/CustomPressable";

export default function Login () {
  return(
    <View style={styles.container}>
      <View style={styles.loginContainer}>
        <Text style={{fontWeight: '800',fontSize: 30, color: 'white'}}>Login</Text>
        <View style={
          {
            width: '100%', 
            padding: 10}}>
          <View style={{padding: 3}}>
            <TextInput
              placeholder="Enter username"
            />
          </View>
          <View style={{padding: 3, marginTop: 10}}>
            <TextInput
              secureTextEntry={true}
              placeholder="Enter password"
            />
          </View>
          <View style={{padding: 3}}>
            <Text style={{textAlign: 'right'}}>Forgot password?</Text>
          </View>
        </View>
        <CustomPressable
          text="Login"
          buttonStyle={{backgroundColor: '#5A72A0', width: '40%', height: 45, borderRadius: 10}}
          textStyle={{fontSize: 18, color: 'white'}}
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
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    backgroundColor: '#204079',
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