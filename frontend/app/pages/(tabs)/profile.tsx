import { FontAwesome } from "@expo/vector-icons"
import { useEffect, useState } from "react"
import { Alert, FlatList, Modal, Pressable, StyleSheet, Text, View } from "react-native"
import useSystemTheme from "@/hooks/useSystemTheme"
import { Button, Searchbar } from "react-native-paper"
import { useRootNavigation } from "@/hooks/useRootNavigation";
import { useUserStore } from "@/store/useUserStore";

const Profile = () => {
  const systemTheme = useSystemTheme()
  const [visibleProfile, setVisibleProfile] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('')

  const {logout} = useUserStore()

  const toggleProfileVisibility = () => {
    setVisibleProfile(!visibleProfile)
  }

  const logoutUser = async () => {
    setVisibleProfile(!visibleProfile)
    logout()
    if (useRootNavigation.isReady()) {
      return useRootNavigation.navigate('Login')
    }
  }

  return(
    <View style={styles.container}>
      <View style={{marginTop: '15%', padding: 5}}>
        <View style={{display: 'flex', flexDirection: 'row', padding: 5, gap: 10}}>
          <View style={{alignItems: 'center'}}>
            <Text style={{padding: 3, fontSize: 13, color: systemTheme.colors.primary, fontWeight: 'bold'}}>Profile</Text>
            <FontAwesome name="user-circle" size={45} color={systemTheme.colors.primary} onPress={toggleProfileVisibility} />
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
          <Searchbar
          placeholder="Search for trainer"
          onChangeText={setSearchQuery}
          value={searchQuery}
        />
          </View>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10}}>
          <Text style={{color: systemTheme.colors.primary, fontSize: 16}}>Available Trainers</Text>
          <Button icon="plus"
            onPress={() => console.log("TODO: Implement refresh")}
          >
            Refresh trainer
          </Button>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%'
  },
  modalStyle: {
    width: '70%',
    borderRadius: 15,
  }
})

export default Profile