import SearchInput from "@/components/custom/SearchInput"
import { Alert, Modal, Pressable, SectionList, StyleSheet, Text, View } from "react-native"
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

  const [visibleModal, setVisibleModal] = useState<boolean>(false)
  const [exercises, setExercises] = useState<Array<ExerciseInterface>>([])

  useEffect(() => {
    exercisesDatabase.db.getAllAsync<ExerciseInterface>('SELECT * FROM exercise;')
    .then(data => {
      setExercises(data)
    })
    .catch(error => console.error(error))
  }, [])

  const sectionData = (exercises: Array<ExerciseInterface>) => {
    let sections: Array<{title: string, data: Array<{id: number, name: string}>}> = []

    exercises.map(exercise => {
      if (sections.some(e => e.title === exercise.muscle_group)) {
        sections[sections.findIndex(e => e.title === exercise.muscle_group)].data.push({id: exercise.id, name: exercise.name})
      } else {
        sections.push({title: exercise.muscle_group, data: [{id: exercise.id, name: exercise.name}]})
      }
    })

    return sections
  }

  return (
    <View style={style.container}>
      <View style={{marginTop: '15%', padding: 5, marginBottom: 20}}>
        <Text style={{color: 'white', fontSize: 35, textAlign: 'center'}}>Exercises</Text>
      </View>
      <View style={{gap: 10, padding: 10, marginBottom: 60}}>
        <View style={{alignSelf: 'flex-start'}}>
          <CustomPressable 
            text="+ Add New Exercise" 
            buttonStyle={{backgroundColor: 'transparent'}} 
            textStyle={{fontSize: 15, color: 'white'}}
            onPress={() => setVisibleModal(!visibleModal)}
          />
        </View>
        <View style={{flex: 1}}>
          <SearchInput />
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={visibleModal}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setVisibleModal(!visibleModal);
          }}>
          <View style={{height: '100%', justifyContent: 'center', alignItems: 'center'}}>
            <View style={style.modalStyle}>
              <Text style={{textAlign: 'center', fontSize: 20, padding: 10}}>Add new exercise</Text>
              <Pressable
                onPress={() => setVisibleModal(!visibleModal)}>
                <Text>X</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
      <SectionList
        sections={sectionData(exercises)}
        renderItem={({item, index}) => (
          <View key={item.id} style={[{padding: 20}, (index % 2 !== 0) ? style.oddColor : {backgroundColor: 'transparent'}]}>
            <Text style={{fontSize: 17, textAlign: 'center', color: 'white'}}>{item.name}</Text>
          </View>
        )}
        renderSectionHeader={({section: {title}}) => (
          <View>
            <Text style={{fontSize: 30, color: 'white', padding: 15, backgroundColor: '#42506A'}}>{title.toUpperCase()}</Text>
          </View>
        )}
        stickySectionHeadersEnabled={false}
      />
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
  },
  oddColor: {
    backgroundColor: '#526D82'
  },
  modalStyle: {
    backgroundColor: 'red',
    width: '70%',
    height: '40%',
    borderRadius: 20
  }
})

export default Exercise