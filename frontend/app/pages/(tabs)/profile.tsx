import { FontAwesome } from "@expo/vector-icons"
import { useEffect, useState } from "react"
import { Alert, FlatList, Modal, Pressable, StyleSheet, Text, View } from "react-native"
import useSystemTheme from "@/hooks/useSystemTheme"
import { Button, Searchbar, TextInput } from "react-native-paper"
import { useRootNavigation } from "@/hooks/useRootNavigation";
import { useUserStore } from "@/store/useUserStore";
import { fitnessLevel } from "@/constants/exercise"
import RNPickerSelect from 'react-native-picker-select';
import asyncStore from "@/lib/asyncStore"
import { useTrainerStore } from "@/store/useTrainerStore"
import { Role, User, UserTrainer } from "@/types/user"
import { AxiosError } from "axios"
import trainerService from "@/services/trainer.service"
import { SecureStore } from "@/lib/secureStore"

type PreferencesProps = {
  firstTime: boolean,
  darkMode: boolean,
  fitnessLevel: string,
  weight: string,
  height: string
}

const Profile = () => {
  const systemTheme = useSystemTheme()
  const [visibleProfile, setVisibleProfile] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [userFitnessLevel, setUserFitnessLevel] = useState<string>()
  const [userWeight, setUserWeight] = useState<string>()
  const [userHeight, setUserHeight] = useState<string>()

  const {logout, user, getUserInfo} = useUserStore()
  const {fetchTrainers, trainer} = useTrainerStore()

  const toggleProfileVisibility = async () => {
    const pref = await asyncStore.getItem('preferences')
    if (!pref) return
    const parsedPreferences: PreferencesProps = JSON.parse(pref)
    setUserFitnessLevel(parsedPreferences.fitnessLevel)
    setUserHeight(parsedPreferences.height)
    setUserWeight(parsedPreferences.weight)
    setVisibleProfile(!visibleProfile)
  }

  const logoutUser = async () => {
    setVisibleProfile(!visibleProfile)
    logout()
    if (useRootNavigation.isReady()) {
      return useRootNavigation.navigate('Login')
    }
  }

  const onValueChangeFitnessLevel = (value: string) => {
    return setUserFitnessLevel(value)
  }

  const onPressSubmitInfo = async () => {
    if (userFitnessLevel === undefined) {
      return Alert.alert('Please select your current fitness level')
    }

    if (!userWeight || isNaN(Number(userWeight))) {
      return Alert.alert('Please enter a valid weight');
    }

    // Check if userHeight is a valid number
    if (!userHeight || isNaN(Number(userHeight))) {
      return Alert.alert('Please enter a valid height');
    }

    setVisibleProfile(!visibleProfile)

    return await asyncStore.setItem('preferences', {firstTime: false, darkMode: false, fitnessLevel: userFitnessLevel, weight: userWeight, height: userHeight})
  }

  const onPressLeaveTrainer = async (userId: number) => {
    try {
      const req = await trainerService.leaveTrainer(userId)

      const userInfo = await SecureStore.getItemAsync('user')
      
      if (!userInfo) return Alert.alert("User info not found!")

      const userInfoTrainer: UserTrainer = req.data
      const parsedUserInfo: User = JSON.parse(userInfo)

      parsedUserInfo.trainerId = userInfoTrainer.trainerId

      await SecureStore.setItemAsync('user', JSON.stringify(parsedUserInfo))

      getUserInfo()

      return await fetchTrainers()
    } catch (error) {
      if (error instanceof AxiosError) {
        Alert.alert(error.response?.data.message)
      }
    }
  }

  const onPressJoinTrainer = async (userId: number, trainerId: number) => {
    try {
      const req = await trainerService.joinTrainer(userId, trainerId)

      const userInfo = await SecureStore.getItemAsync('user')
      
      if (!userInfo) return Alert.alert("User info not found!")

      const userInfoTrainer: UserTrainer = req.data
      const parsedUserInfo: User = JSON.parse(userInfo)

      parsedUserInfo.trainerId = userInfoTrainer.trainerId

      await SecureStore.setItemAsync('user', JSON.stringify(parsedUserInfo))

      getUserInfo()

      return await fetchTrainers()
    } catch (error) {
      if (error instanceof AxiosError) {
        Alert.alert(error.response?.data.message)
      }
    }
  }

  useEffect(() => {
    fetchTrainers().then(() => console.log("Trainers fetched!"))
  }, [])

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
                <View style={{backgroundColor: systemTheme.colors.background, padding: 10, flexDirection: 'column', gap: 10}}>
                  <RNPickerSelect
                    style={{inputAndroid: {color: systemTheme.colors.text}}}
                    onValueChange={onValueChangeFitnessLevel}
                    items={fitnessLevel}
                    placeholder={{label: 'What is your fitness level?'}}
                    value={userFitnessLevel}
                  />
                  <TextInput
                    mode="outlined"
                    label="Weight (kg)"
                    style={{width: '100%'}}
                    onChangeText={(e) => setUserWeight(e)}
                    value={userWeight}
                  />
                  <TextInput
                    mode="outlined"
                    label="Height (cm)"
                    style={{width: '100%'}}
                    onChangeText={(e) => setUserHeight(e)}
                    value={userHeight}
                  />
                  <Pressable onPress={onPressSubmitInfo}>
                    <Text style={{fontSize: 20, color: systemTheme.colors.text}}>Submit</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setVisibleProfile(!visibleProfile)}>
                    <Text style={{fontSize: 20, color: systemTheme.colors.text}}>Exit</Text>
                  </Pressable>
                  <Pressable onPress={logoutUser}>
                    <Text style={{fontSize: 20, color: systemTheme.colors.text}}>Logout</Text>
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
          <Button icon="reload"
            onPress={async () => await fetchTrainers()}
          >
            Refresh trainers
          </Button>
        </View>
        <FlatList
          data={trainer}
          renderItem={({item}) => (
            <View key={item.id} style={{
                padding: 10, borderWidth: 1, marginTop: 10, borderColor: systemTheme.colors.border, flexDirection: 'row',
                justifyContent: 'space-around', alignItems: 'center', borderRadius: 10
              }}>
              <View>
                <Text style={{color: systemTheme.colors.text}}>Trainer name: {item.username}</Text>
                <Text style={{color: systemTheme.colors.text}}>Trainer email: {item.email}</Text>
                <Text style={{color: systemTheme.colors.text}}>Clients: {item.clients.length}</Text>
              </View>
              <View>
                {
                  item.clients.find((e) => e.id === user.id) ? <Button mode="contained" onPress={async () => await onPressLeaveTrainer(user.id)}>Leave</Button> : <Button mode="contained" onPress={async () => await onPressJoinTrainer(user.id, item.id)} >Join</Button>
                }
              </View>
            </View>
          )}
        />
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