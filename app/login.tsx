import { Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function Login () {
  return(
    <View style={styles.container}>
      <View style={styles.loginContainer}>
        <Text style={{fontSize: 25, color: 'white'}}>Login</Text>
        <View>
          <Text style={{fontSize: 17, fontWeight: 'bold'}}>Username</Text>
          <TextInput
            style={{borderColor: 'white', borderBottomWidth: 1}}
          />
        </View>
        <View>
          <Text style={{fontSize: 17, fontWeight: 'bold'}}>Password</Text>
          <TextInput
            style={{borderColor: 'white', borderBottomWidth: 1}}
          />
        </View>
        <Text>Forgot password?</Text>
        <Button
          title="LOGIN"
          color="gray"
        />
        <View style={{display: 'flex', gap: 10}}>
          <Button
            title="LOGIN WITH FACEBOOK"
            color="blue"
          />
          <Button
            title="LOGIN WITH GOOGLE"
            color="red"
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    backgroundColor: '#83B4FF',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  loginContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
    padding: 50,
    gap: 30,
    borderRadius: 30
  }
})