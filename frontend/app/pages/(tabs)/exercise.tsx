import SearchInput from "@/components/custom/SearchInput"
import { Alert, Modal, Pressable, SectionList, StyleSheet, Text, View } from "react-native"
import CustomPressable from "@/components/custom/CustomPressable"
import { exercisesDatabase } from "@/database"
import { useEffect, useState } from "react"
import { AppTheme } from "@/constants/theme"
import CustomTextInput from "@/components/custom/CustomTextInput"
import { equipment, muscle_group } from "@/constants/exercise"
import RNPickerSelect from 'react-native-picker-select';

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
          animationType="fade"
          transparent={true}
          visible={visibleModal}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setVisibleModal(!visibleModal);
          }}>
          <View style={{height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(52, 52, 52, 0.7)'}}>
            <View style={style.modalStyle}>
              <Text style={{textAlign: 'center', fontSize: 20, padding: 10, color: 'white'}}>Add new exercise</Text>
              <View>
                <View style={{padding: 10}}>
                  <CustomTextInput
                    placeholder="Enter exercise name"
                  />
                </View>
                <View style={{padding: 10, marginTop: 3}}>
                  <RNPickerSelect
                    placeholder={{label: 'Select equipment', value: null}}
                    onValueChange={(value) => console.log(value)}
                    items={equipment}
                    style={pickerSelectStyles}
                  />
                </View>
                <View style={{padding: 10, marginTop: 3}}>
                  <CustomTextInput
                    placeholder="Enter target muscles"
                  />
                </View>
                <View style={{padding: 10, marginTop: 3}}>
                  <RNPickerSelect
                    placeholder={{label: 'Select muscle group', value: null}}
                    onValueChange={(value) => console.log(value)}
                    items={muscle_group}
                    style={pickerSelectStyles}
                  />
                </View>
              </View>
              <View style={{justifyContent: 'center', alignItems: 'center', padding: 10, flexDirection: 'row', gap: 10}}>
                <CustomPressable
                  text="Add"
                  buttonStyle={{backgroundColor: 'green', padding: 10, borderRadius: 5, flex: 1}}
                  textStyle={{fontSize: 15, color: 'white'}}
                />
                <CustomPressable
                  text="Cancel"
                  buttonStyle={{backgroundColor: 'red', padding: 10, borderRadius: 5, flex: 1}}
                  textStyle={{fontSize: 15, color: 'white'}}
                  onPress={() => setVisibleModal(!visibleModal)}
                />
              </View>
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
    backgroundColor: AppTheme.colors.notification,
    width: '70%',
    borderRadius: 15,
  },
  selectStyle: {
    borderWidth: 2,
    borderColor: 'gray'
  }
})

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 2,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'white',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'white',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

export default Exercise