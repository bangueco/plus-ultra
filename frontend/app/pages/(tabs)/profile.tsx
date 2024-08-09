import CustomBtn from "@/components/custom/CustomBtn"
import SearchInput from "@/components/custom/SearchInput"
import { FontAwesome } from "@expo/vector-icons"
import { useState } from "react"
import { Modal, Pressable, StyleSheet, Text, View } from "react-native"
import * as SecureStore from "expo-secure-store";
import { rootNavigationRef } from "@/hooks/useNavigationRef"
import { StackActions } from "@react-navigation/native"

const Profile = () => {
  const [visibleProfile, setVisibleProfile] = useState<boolean>(false)

  const toggleProfileVisibility = () => {
    setVisibleProfile(!visibleProfile)
  }

  const logoutUser = async () => {
    setVisibleProfile(!visibleProfile)
    await SecureStore.deleteItemAsync('token')
    if (rootNavigationRef.isReady()) {
      rootNavigationRef.dispatch(StackActions.replace('Login'))
    }
  }

  return(
    <View style={styles.container}>
      <View style={{marginTop: '15%', padding: 5}}>
        <View style={{display: 'flex', flexDirection: 'row', padding: 5, gap: 10}}>
          <View style={{alignItems: 'center'}}>
            <Text style={{padding: 3, fontSize: 13, color: 'white'}}>Profile</Text>
            <FontAwesome name="user-circle" size={45} color="white" onPress={toggleProfileVisibility} />
            <Modal
              visible={visibleProfile}
              animationType="fade"
              transparent={true}
              style={{position: 'relative'}}
            >
              <View style={{justifyContent: 'center', width: '100%', padding: 10, position: 'absolute', bottom: 0, top: 0, backgroundColor: 'rgba(52, 52, 52, 0.7)'}}>
                <View style={{backgroundColor: 'green', padding: 10, flexDirection: 'row', gap: 10}}>
                  <Pressable
                    onPress={() => setVisibleProfile(!visibleProfile)}>
                    <Text style={{fontSize: 20}}>Exit</Text>
                  </Pressable>
                  <Pressable onPress={logoutUser}>
                    <Text style={{fontSize: 20}}>Logout</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
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