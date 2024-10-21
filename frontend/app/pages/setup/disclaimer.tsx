import { useRootNavigation } from "@/hooks/useRootNavigation"
import { StackActions } from "@react-navigation/native"
import { StyleSheet, View } from "react-native"
import { Button, Text } from "react-native-paper"

const Disclaimer = () => {

  return (
    <View style={styles.disclaimerContainer}>
      <Text style={{fontSize: 35, fontWeight: 'bold', color: 'red'}}>Disclaimer!</Text>
      <Text style={{fontSize: 12}}>Before you use our application, please read some of this first.</Text>
      <View style={styles.disclaimersContainer}>
        <Text style={{fontWeight: 'bold', fontSize: 15}}>
          1. User responsibility - <Text style={{fontSize: 14}}>Users should consult a physician or other qualified health provider before starting any new exercise program or if they have any questions regarding a medical condition.</Text>
        </Text>
        <Text style={{fontWeight: 'bold', fontSize: 15}}>
          2. Equipment Usage - <Text style={{fontSize: 14}}>The application provides recommendations for gym equipment; however, users should always follow the manufacturer's instructions and seek assistance from trained staff if needed.</Text>
        </Text>
        <Text style={{fontWeight: 'bold', fontSize: 15}}>
          3. Personal Fitness Level - <Text style={{fontSize: 14}}>Individual fitness levels vary. Users should listen to their bodies and modify exercises to suit their personal fitness levels and capabilities.</Text>
        </Text>
        <Text style={{fontWeight: 'bold', fontSize: 15}}>
          4. Liability Waiver - <Text style={{fontSize: 14}}>The app developers are not responsible for any injuries or damages resulting from your use of this app.</Text>
        </Text>
      </View>
      <View style={{position: 'absolute', bottom: 30, gap: 10}}>
        <Text style={{fontSize: 12}}>Your use of this app indicates your acceptance of these terms.</Text>
        <Button onPress={() => useRootNavigation.dispatch(StackActions.replace('UserInfo'))} mode="contained">Continue</Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  disclaimerContainer: {
    height: '100%',
    paddingTop: '15%',
    alignItems: 'center',
    padding: 10,
    position: 'relative'
  },
  disclaimersContainer: {
    paddingTop: 40,
    gap: 20
  }
})

export default Disclaimer