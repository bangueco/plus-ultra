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
import { Role, User, UserFetched, UserTrainer } from "@/types/user"
import { AxiosError } from "axios"
import trainerService from "@/services/trainer.service"
import { SecureStore } from "@/lib/secureStore"
import authService from "@/services/auth.service"

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

  const {logout, user, getUserInfo, getUserPreferences, preferences} = useUserStore()
  const {fetchTrainers, trainer, fetchTrainerTemplates} = useTrainerStore()

  const toggleProfileVisibility = () => {
    setUserFitnessLevel(preferences.fitnessLevel)
    setUserHeight(String(preferences.height))
    setUserWeight(String(preferences.weight))
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

    await asyncStore.setItem('preferences', {firstTime: false, darkMode: false, fitnessLevel: userFitnessLevel, weight: userWeight, height: userHeight})

    return await getUserPreferences()
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

      await fetchTrainers()
      return await fetchTrainerTemplates(user.id)
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

      await fetchTrainers()
      return await fetchTrainerTemplates(parsedUserInfo.trainerId ?? 0)
    } catch (error) {
      if (error instanceof AxiosError) {
        Alert.alert(error.response?.data.message)
      }
    }
  }

  const onPressApproveClient = async (userId: number) => {
    try {
      const req = await trainerService.approveClient(userId)

      const userInfo = await SecureStore.getItemAsync('user')
      
      if (!userInfo) return Alert.alert("User info not found!")

      const parsedUserInfo: User = JSON.parse(userInfo)
      
      parsedUserInfo.approved = true
      
      await SecureStore.setItemAsync('user', JSON.stringify(parsedUserInfo))
      
      getUserInfo()
      
      await fetchTrainers()
      Alert.alert(req.data.message)
      if (!user.trainerId) return
      return await fetchTrainerTemplates(user.trainerId)
    } catch (error) {
      if (error instanceof AxiosError) {
        Alert.alert(error.response?.data.message)
      }
    }
  }

  const onPressCancelClient = async (userId: number) => {
    try {
      const req = await trainerService.cancelClient(userId)

      const userInfo = await SecureStore.getItemAsync('user')
      
      if (!userInfo) return Alert.alert("User info not found!")

      const parsedUserInfo: User = JSON.parse(userInfo)
      
      parsedUserInfo.approved = false
      parsedUserInfo.trainerId = null
      
      await SecureStore.setItemAsync('user', JSON.stringify(parsedUserInfo))
      
      getUserInfo()
      
      await fetchTrainers()
      Alert.alert(req.data.message)
      return await fetchTrainerTemplates(parsedUserInfo.trainerId ?? 0)
    } catch (error) {
      if (error instanceof AxiosError) {
        Alert.alert(error.response?.data.message)
      }
    }
  }

  const getUserApprovedStatus = async (userId: number) => {
    try {
      const req = await authService.getUser(userId)

      const userStatus: UserFetched = req

      const userJson = SecureStore.getItem('user')

      if (!userJson) return

      const userData: User = JSON.parse(userJson)
      userData.approved = userStatus.approved
      SecureStore.setItem('user', JSON.stringify(userData))
      return getUserInfo()
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
                  {
                    <Text style={{fontSize: 25, textAlign: 'center', color: systemTheme.colors.text}}>Hello, {user.username}!</Text>
                  }
                  <TextInput
                    mode="outlined"
                    label="Weight (kg)"
                    style={{width: '100%'}}
                    onChangeText={(e) => setUserWeight(e)}
                    value={userWeight}
                    inputMode="numeric"
                  />
                  <TextInput
                    mode="outlined"
                    label="Height (cm)"
                    style={{width: '100%'}}
                    onChangeText={(e) => setUserHeight(e)}
                    value={userHeight}
                    inputMode="numeric"
                  />
                  <RNPickerSelect
                    style={{inputAndroid: {color: systemTheme.colors.text}}}
                    onValueChange={onValueChangeFitnessLevel}
                    items={fitnessLevel}
                    placeholder={{label: 'What is your fitness level?'}}
                    value={userFitnessLevel}
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
          {
            user.role === 'USER'
            ?
            <Searchbar
              placeholder="Search for trainer"
              onChangeText={setSearchQuery}
              value={searchQuery}
            />
            :
            <Searchbar
              placeholder="Search for clients"
              onChangeText={setSearchQuery}
              value={searchQuery}
            />
          }
          </View>
        </View>
        {
          user.role === 'USER'
          ?
          <View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10}}>
              <Text style={{color: systemTheme.colors.primary, fontSize: 16}}>Available Trainers</Text>
              <Button icon="reload"
                onPress={async () => {
                    await getUserApprovedStatus(user.id)
                    await fetchTrainers()
                  }
                }
              >
                Refresh trainers
              </Button>
            </View>
            <FlatList
              data={trainer.filter(item => item.username.toLowerCase().includes(searchQuery.toLowerCase()))}
              renderItem={({item}) => (
                <View key={item.id} style={{
                    padding: 10, borderWidth: 1, marginTop: 10, borderColor: systemTheme.colors.border, flexDirection: 'column',
                    alignItems: 'flex-start', borderRadius: 10, gap: 10, justifyContent: 'center'
                  }}>
                  <View>
                    <Text style={{color: systemTheme.colors.text, fontSize: 18}}>Trainer name: {item.username}</Text>
                    <Text style={{color: systemTheme.colors.text, fontSize: 18}}>Trainer email: {item.email}</Text>
                    <Text style={{color: systemTheme.colors.text, fontSize: 18}}>Clients: {item.clients.filter(e => e.approved === true).length}</Text>
                  </View>
                  <View>
                    {
                      item.clients.find((e) => e.id === user.id)
                      ?
                      <Button disabled={item.id === user.id} mode="contained" onPress={async () => {
                          await getUserApprovedStatus(user.id)
                          await onPressLeaveTrainer(user.id)
                        }}>
                        {user.approved ? "Leave" : "Waiting for approval"}
                      </Button>
                      :
                      <Button disabled={item.id === user.id || user.role === "TRAINER"} mode="contained" onPress={async () => await onPressJoinTrainer(user.id, item.id)} >Apply</Button>
                    }
                  </View>
                </View>
              )}
            />
          </View>
          :
          <View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10}}>
              <Text style={{color: systemTheme.colors.primary, fontSize: 16}}>Your clients</Text>
              <Button icon="reload"
                onPress={async () => await fetchTrainers()}
              >
                Refresh clients
              </Button>
            </View>
            {
              trainer.find(e => e.id === user.id)?.clients.length === 0
              ?
              <Text style={{textAlign: 'center', color: systemTheme.colors.text}}>You have no clients yet</Text>
              :
              <FlatList
                data={trainer.find(e => e.id === user.id)?.clients.filter((client) => client.username.toLowerCase().includes(searchQuery.toLowerCase()))}
                renderItem={({item}) => (
                  <View key={item.id} style={{
                      padding: 10, borderWidth: 1, marginTop: 10, borderColor: systemTheme.colors.border, flexDirection: 'column',
                      alignItems: 'flex-start', borderRadius: 10, gap: 10, justifyContent: 'center'
                    }}>
                    <View>
                      <Text style={{color: systemTheme.colors.text, fontSize: 18}}>Client name: {item.username}</Text>
                      <Text style={{color: systemTheme.colors.text, fontSize: 18}}>Client email: {item.email}</Text>
                    </View>
                    <View>
                      {
                        item.approved === true
                        ?
                        <Button mode="contained" onPress={async () => await onPressLeaveTrainer(item.id)}>
                          Kick
                        </Button>
                        :
                        <View style={{flexDirection: 'row', gap: 10}}>
                          <Button mode="contained" onPress={async () => await onPressApproveClient(item.id)} >Approve</Button>
                          <Button mode="contained" onPress={async () => await onPressCancelClient(item.id)} >Cancel</Button>
                        </View>
                      }
                    </View>
                  </View>
                )}
              />
            }
          </View>
        }
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