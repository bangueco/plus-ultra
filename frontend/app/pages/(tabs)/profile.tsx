import { FontAwesome } from "@expo/vector-icons"
import { useEffect, useState } from "react"
import { Alert, FlatList, Modal, Pressable, StyleSheet, Text, View } from "react-native"
import { StackActions } from "@react-navigation/native"
import useSystemTheme from "@/hooks/useSystemTheme"
import { Button, Searchbar, TextInput } from "react-native-paper"
import { useRootNavigation } from "@/hooks/useRootNavigation";
import { useUserStore } from "@/store/useUserStore";
import personalRecordService from "@/services/personalRecord.service"
import axios from "axios"
import { SecureStore } from "@/lib/secureStore"
import { User } from "@/types/user"

const Profile = () => {
  const systemTheme = useSystemTheme()
  const [visibleProfile, setVisibleProfile] = useState<boolean>(false)
  const [visibleAddWorkout, setVisibleAddWorkout] = useState<boolean>(false)

  const [exerciseName, setExerciseName] = useState<string>()
  const [exerciseSet, setExerciseSet] = useState<string>()
  const [exerciseReps, setExerciseReps] = useState<string>()
  const [exerciseWeight, setExerciseWeight] = useState<string>()
  const [searchQuery, setSearchQuery] = useState<string>('')

  const [data, setData] = useState<Array<{id: number, exercise_name: string, set: number, reps: number, weight: number, userId: number}>>(
    [
      {
        id: 0,
        exercise_name: '',
        reps: 0,
        set: 0,
        userId: 0,
        weight: 0
      }
    ]
  );

  const baseURL = process.env.EXPO_PUBLIC_API_URL

  const { user } = useUserStore()

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

  const onPressNewRecord = async () => {
    if (!exerciseName || !exerciseSet || !exerciseReps || !exerciseWeight) {
      return Alert.alert("Error: make sure all fields are filled.")
    }

    if (isNaN(Number(exerciseSet)) || isNaN(Number(exerciseReps)) || isNaN(Number(exerciseWeight))) {
      return Alert.alert("Error: make sure fields that require integer input are valid numbers!");
    }

    try {
      await personalRecordService.newRecord(exerciseName, Number(exerciseSet), Number(exerciseWeight), Number(exerciseReps), user.id)
      setExerciseName('')
      setExerciseSet('')
      setExerciseReps('')
      setExerciseWeight('')
      setVisibleAddWorkout(false)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchPersonalRecord = async () => {

    const userInfo = SecureStore.getItem('user')

    if (!userInfo) return

    const parsedUserInfo: User = JSON.parse(userInfo)

    try {
      // Replace with your API endpoint
      const response = await axios.get(`${baseURL}/user/personal-record`, {
        params: {
          userId: !searchQuery ? parsedUserInfo.id : Number(searchQuery)
        }
      })
      setData(response.data); // Store the data in the state
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchPersonalRecord();

    // Optional: If you want to refresh data periodically, you can set an interval
    const interval = setInterval(() => {
      console.log(searchQuery)
      console.log('fetch runs')
      fetchPersonalRecord();
    }, 5000); // Refresh data every 5 seconds

    // Cleanup the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

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
            <Modal
              visible={visibleAddWorkout}
              animationType="fade"
              transparent={true}
              style={{position: 'relative'}}
            >
              <View style={{height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(52, 52, 52, 0.7)'}}>
                <View style={[styles.modalStyle, {backgroundColor: systemTheme.colors.background, padding: 15, borderRadius: 15}]}>
                  <Text style={{textAlign: 'center', fontSize: 20, padding: 10, color: 'white'}}>Add personal record</Text>
                  <View>
                    <TextInput
                      mode="outlined"
                      label="Exercise Name"
                      onChangeText={(e) => setExerciseName(e)}
                    />
                    <TextInput
                      mode="outlined"
                      label="Sets"
                      onChangeText={(e) => setExerciseSet(e)}
                    />
                    <TextInput
                      mode="outlined"
                      label="Reps"
                      onChangeText={(e) => setExerciseReps(e)}
                    />
                    <TextInput
                      mode="outlined"
                      label="Weight (kg)"
                      onChangeText={(e) => setExerciseWeight(e)}
                    />
                  </View>
                  <View style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 20, paddingTop: 20}}>
                    <Pressable
                      onPress={onPressNewRecord}>
                      <Text style={{fontSize: 15, color: systemTheme.colors.primary}}>Create</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => setVisibleAddWorkout(false)}>
                      <Text style={{fontSize: 15, color: 'red'}}>Exit</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
          <View style={{flex: 1, justifyContent: 'center', padding: 5}}>
          <Searchbar
          placeholder="Search for user id"
          onChangeText={setSearchQuery}
          value={searchQuery}
        />
          </View>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10}}>
          <Text style={{color: systemTheme.colors.primary, fontSize: 16}}>Your Personal Record</Text>
          <Button icon="plus"
            onPress={() => setVisibleAddWorkout(true)}
          >
            Add Workout
          </Button>
        </View>
        <View>
        <FlatList
          data={data}  // Pass updated data to FlatList
          keyExtractor={(item) => item.id.toString()}  // Adjust based on your API response
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemText}>Exercise Name: {item.exercise_name}</Text>
              <Text style={styles.itemText}>Sets: {item.set}</Text>
              <Text style={styles.itemText}>Reps: {item.reps}</Text>
              <Text style={styles.itemText}>Weight: {item.weight}</Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.noResultsText}>No results found</Text>
          }
        />
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
  },
  item: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  itemText: {
    fontSize: 16,
  },
  noResultsText: {
    textAlign: 'center',
    color: 'gray',
    fontSize: 16,
  },
})

export default Profile