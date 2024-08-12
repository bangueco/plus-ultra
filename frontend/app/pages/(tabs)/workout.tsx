import CustomPressable from "@/components/custom/CustomPressable"
import useSystemTheme from "@/hooks/useSystemTheme"
import { StyleSheet, Text, View } from "react-native"


const Workout = () => {
  const systemTheme = useSystemTheme()
  return (
    <View style={styles.container}>
      <View style={{marginTop: '15%', padding: 5}}>
        <View>
          <Text style={{color: systemTheme.colors.text, fontSize: 20}}>Start Workout</Text>
        </View>
        <View style={{marginTop: 30, gap: 10, alignItems: 'center'}}>
          <Text style={{color: systemTheme.colors.primary, fontSize: 17}}>Quick Start</Text>
          <CustomPressable
            buttonStyle={{backgroundColor: systemTheme.colors.primary, borderRadius: 5, width: '90%'}}
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