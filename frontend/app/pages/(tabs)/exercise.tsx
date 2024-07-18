import SearchInput from "@/components/custom/SearchInput"
import { StyleSheet, Text, View } from "react-native"
import CustomPressable from "@/components/custom/CustomPressable"

const Exercise = () => {
  return (
    <View style={style.container}>
      <View style={{marginTop: '15%', padding: 5, marginBottom: 20}}>
        <Text style={{color: 'white', fontSize: 35, textAlign: 'center'}}>Exercises</Text>
      </View>
      <View style={{gap: 10, padding: 10}}>
        <View style={{alignSelf: 'flex-start'}}>
          <CustomPressable text="+ Add New Exercise" buttonStyle={{backgroundColor: 'transparent'}} textStyle={{fontSize: 15, color: 'white'}} />
        </View>
        <View style={{flex: 1}}>
          <SearchInput />
        </View>
      </View>
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    display: 'flex',
    height: '100%'
  }
})

export default Exercise