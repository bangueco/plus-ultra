import { Alert, Modal, SectionList, StyleSheet, Text, View } from "react-native"
import CustomPressable from "@/components/custom/CustomPressable"
import { exercisesDatabase } from "@/database"
import { useEffect, useState } from "react"
import CustomTextInput from "@/components/custom/CustomTextInput"
import { equipment, muscle_group } from "@/constants/exercise"
import RNPickerSelect from 'react-native-picker-select';
import useSystemTheme from "@/hooks/useSystemTheme"
import { Button, Dialog, Portal, Searchbar } from "react-native-paper"
import {ExerciseInfo} from "@/types/exercise";
import sortByMuscleGroup from "@/hooks/sortByMuscleGroup";

const Exercise = () => {
  const systemTheme = useSystemTheme()

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentSelectedExercise, setCurrentSelectedExercise] = useState<{name: string, instructions: string, tutorialLink: string}>()
  const [visibleModal, setVisibleModal] = useState<boolean>(false)
  const [exercises, setExercises] = useState<Array<ExerciseInfo>>([])
  const [visible, setVisible] = useState<boolean>(false)

  const [exerciseName, setExerciseName] = useState<String>()
  const [equipmentName, setEquipmentName] = useState<String | null>()
  const [muscleGroup, setMuscleGroup] = useState<String>()

  useEffect(() => {
    exercisesDatabase.db.getAllAsync<ExerciseInfo>('SELECT * FROM exercise;')
    .then(data => {
      setExercises(data)
    })
    .catch(error => console.error(error))
  }, [])

  const onPressNewExercise = async () => {
    try {
      const insertExercise = await exercisesDatabase.db.runAsync(`INSERT INTO exercise (name, equipment, muscleGroup) VALUES ('${exerciseName}', '${equipmentName}', '${muscleGroup}');`)
      const getInsertedExercise = await exercisesDatabase.db.getFirstAsync<ExerciseInfo>(`SELECT * FROM exercise WHERE id=${insertExercise.lastInsertRowId};`)
      if (getInsertedExercise) {
        const updatedExerciseState: Array<ExerciseInfo> = [...exercises, getInsertedExercise]
        setVisibleModal(false)
        return setExercises(updatedExerciseState)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const onPressSelectExercise = async (id: number) => {
    setVisible(true)
    const getExercise = await exercisesDatabase.db.getFirstAsync<{
      name: string, 
      instructions: string, 
      tutorialLink: string}
    >(`SELECT name, instructions, tutorialLink FROM exercise WHERE id='${id}'`)

    if (getExercise) {
      return setCurrentSelectedExercise({
        ...currentSelectedExercise, 
        name: getExercise.name, 
        instructions: getExercise.instructions, 
        tutorialLink: getExercise.tutorialLink
      })
    }
  }

  // console.log(currentSelectedExercise)

  return (
    <View style={style.container}>
      <View style={{marginTop: '15%', padding: 5, marginBottom: 20}}>
        <Text style={{color: systemTheme.colors.text, fontSize: 35, textAlign: 'center'}}>Exercises</Text>
      </View>
      <View style={{gap: 10, padding: 10, marginBottom: 60}}>
        <View style={{alignSelf: 'flex-start'}}>
          <CustomPressable 
            text="+ Add New Exercise" 
            buttonStyle={{backgroundColor: 'transparent'}} 
            textStyle={{fontSize: 15, color: systemTheme.colors.primary}}
            onPress={() => setVisibleModal(!visibleModal)}
          />
        </View>
        <Searchbar
          placeholder="Search"
          onChangeText={(e) => setSearchQuery(e)}
          value={searchQuery}
        />
        <Modal
          animationType="fade"
          transparent={true}
          visible={visibleModal}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setVisibleModal(!visibleModal);
          }}>
          <View style={{height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(52, 52, 52, 0.7)'}}>
            <View style={[style.modalStyle, {backgroundColor: systemTheme.colors.background}]}>
              <Text style={{textAlign: 'center', fontSize: 20, padding: 10, color: 'white'}}>Add new exercise</Text>
              <View>
                <View style={{padding: 10}}>
                  <CustomTextInput
                    placeholder="Enter exercise name"
                    onChangeText={(e) => setExerciseName(e)}
                  />
                </View>
                <View style={{padding: 10, marginTop: 3}}>
                  <RNPickerSelect
                    placeholder={{label: 'Select equipment', value: null}}
                    onValueChange={(value) => setEquipmentName(value)}
                    items={equipment}
                    style={pickerSelectStyles}
                  />
                </View>
                <View style={{padding: 10, marginTop: 3}}>
                <RNPickerSelect
                    placeholder={{label: 'Select muscle group', value: null}}
                    onValueChange={(value) => setMuscleGroup(value)}
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
                  onPress={onPressNewExercise}
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
      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Title style={{textAlign: 'center'}}>{currentSelectedExercise?.name}</Dialog.Title>
          <Dialog.Content>
            <Text style={{color: systemTheme.colors.text, textAlign: 'justify'}}>{currentSelectedExercise?.instructions}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button>Add exercise</Button>
            <Button onPress={() => setVisible(false)}>Exit</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <SectionList
        extraData={exercises}
        sections={sortByMuscleGroup(exercises)}
        renderItem={({item}) => (
          <CustomPressable 
            key={item.id} 
            text={item.name} 
            textStyle={{fontSize: 17, textAlign: 'center', color: systemTheme.colors.text}} 
            buttonStyle={{padding: 10, borderBottomWidth: 1, borderBottomColor: systemTheme.colors.border, backgroundColor: 'transparent'}}
            onPress={() => onPressSelectExercise(item.id)}
          />
        )}
        renderSectionHeader={({section: {title}}) => (
          <View style={{padding: 5, marginTop: 30}}>
            <Text style={{fontSize: 10, color: systemTheme.colors.text}}># {title.toUpperCase()}</Text>
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