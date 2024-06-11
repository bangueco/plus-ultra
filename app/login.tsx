import CustomBtn from "@/components/CustomBtn";
import { Button, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

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
            <Text style={{fontSize: 18, padding: 2, fontWeight: 'bold'}}>Username</Text>
            <TextInput
              style={{borderColor: 'white', backgroundColor: 'gray', padding: 8, borderRadius: 5, fontSize: 18}}
            />
          </View>
          <View style={{padding: 3, marginTop: 10}}>
            <Text style={{fontSize: 18, padding: 2, fontWeight: 'bold'}}>Password</Text>
            <TextInput
              style={{borderColor: 'white', backgroundColor: 'gray', padding: 8, borderRadius: 5, fontSize: 18}}
            />
          </View>
          <View style={{padding: 2}}>
            <Text style={{textAlign: 'right'}}>Forgot password?</Text>
          </View>
        </View>
        <CustomBtn
          text="LOGIN"
          buttonStyle={{backgroundColor: '#83B4FF', width: '40%', borderRadius: 10}}
          textStyle={{fontSize: 18, padding: 8,}}
        />
        <Text>or</Text>
        <View style={{display: 'flex', justifyContent: 'center', alignItems:'center', gap: 10, width: '100%', padding: 10}}>
          <CustomBtn
            iconName="facebook"
            iconSize={30}
            text="LOGIN WITH FACEBOOK"
            buttonStyle={{backgroundColor: 'blue', borderRadius: 5, width: '75%'}}
            textStyle={{fontSize: 15, color: 'white', fontWeight: '600'}}
          />
          <CustomBtn
            text="LOGIN WITH GOOGLE"
            buttonStyle={{backgroundColor: 'orange', borderRadius: 5, width: '70%'}}
            textStyle={{fontSize: 15}}
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