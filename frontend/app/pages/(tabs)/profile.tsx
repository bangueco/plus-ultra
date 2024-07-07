import CustomBtn from "@/components/custom/CustomBtn"
import SearchInput from "@/components/custom/SearchInput"
import { FontAwesome } from "@expo/vector-icons"
import { StyleSheet, Text, View } from "react-native"

const Profile = () => {
  return(
    <View style={styles.container}>
      <View style={{marginTop: '15%', padding: 5}}>
        <View style={{display: 'flex', flexDirection: 'row', padding: 5, gap: 10}}>
          <View style={{alignItems: 'center'}}>
            <Text style={{padding: 3, fontSize: 13, color: 'white'}}>Profile</Text>
            <FontAwesome name="user-circle" size={45} color="white" />
          </View>
          <View style={{flex: 1, justifyContent: 'center', padding: 5}}>
            <SearchInput
            />
          </View>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10}}>
          <Text style={{color: 'white', fontSize: 16}}>Your Personal Record</Text>
          <CustomBtn
            buttonStyle={{backgroundColor: 'none', gap: 5}}
            iconName="plus"
            iconSize={20}
            textStyle={{fontSize: 16, color: 'white', flex: 0}}
            text="Add Workout"
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%'
  }
})

export default Profile