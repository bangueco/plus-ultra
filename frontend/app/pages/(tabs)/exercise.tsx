import SearchInput from "@/components/custom/SearchInput"
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native"
import CustomPressable from "@/components/custom/CustomPressable"
import { exercisesDatabase } from "@/database"
import { useEffect, useState } from "react"

interface ExerciseInterface {
  id: number
  name: string
  description: string
  equipment: string
  image_link: string
  target_muscles: string
  muscle_group: string
}

const Exercise = () => {

  const [exercises, setExercises] = useState<Array<ExerciseInterface>>([])

  useEffect(() => {
    exercisesDatabase.db.getAllAsync<ExerciseInterface>('SELECT * FROM exercise;')
    .then(data => {
      setExercises(data)
    })
    .catch(error => console.error(error))
  }, [])

  return (
    <View style={style.container}>
      <View style={{marginTop: '15%', padding: 5, marginBottom: 20}}>
        <Text style={{color: 'white', fontSize: 35, textAlign: 'center'}}>Exercises</Text>
      </View>
      <View style={{gap: 10, padding: 10, marginBottom: 60}}>
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
    height: '100%',
  },
  exercisesContainer: {
    gap: 10
  },
  muscleGroup: {
    backgroundColor: 'gray'
  }
})

export default Exercise