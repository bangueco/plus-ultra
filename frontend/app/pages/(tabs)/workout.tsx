import CustomPressable from "@/components/custom/CustomPressable"
import { StyleSheet, Text, View } from "react-native"

const Workout = () => {
  return (
    <View style={styles.container}>
      <View style={{marginTop: '15%', padding: 5}}>
        <View>
          <Text style={{color: 'white', fontSize: 20}}>Start Workout</Text>
        </View>
        <View style={{marginTop: 30, gap: 10, alignItems: 'center'}}>
          <Text style={{color: 'white', fontSize: 17}}>Quick Start</Text>
          <CustomPressable
            buttonStyle={{backgroundColor: 'gray', borderRadius: 5, width: '90%'}}
            textStyle={{fontSize: 20, color: 'white'}}
            text="Start an empty workout"
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    height: '100%'
  }
})

export default Workout