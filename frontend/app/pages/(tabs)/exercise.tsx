import { Alert, Modal, SectionList, StyleSheet, Text, View } from "react-native"
import CustomPressable from "@/components/custom/CustomPressable"
import { useState } from "react"
import CustomTextInput from "@/components/custom/CustomTextInput"
import { equipment, fitnessLevel, muscle_group } from "@/constants/exercise"
import RNPickerSelect from 'react-native-picker-select';
import useSystemTheme from "@/hooks/useSystemTheme"
import { Button, Dialog, Portal, Searchbar } from "react-native-paper"
import sortByMuscleGroup from "@/hooks/sortByMuscleGroup";
import exerciseService from "@/services/exercise.service"
import { useExerciseStore } from "@/store/useExerciseStore"
import { useUserStore } from "@/store/useUserStore"
import YoutubePlayer from "react-native-youtube-iframe";
import TemplateMenu from "@/components/TemplateMenu"

const Exercise = () => {
  const systemTheme = useSystemTheme()
  const { addExercise, exercise, removeExercise } = useExerciseStore()

  const { user } = useUserStore()

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentSelectedExercise, setCurrentSelectedExercise] = useState<{ name: string, instructions: string, video_id: string, difficulty: string }>({ name: '', instructions: '', video_id: '', difficulty: '' });
  const [visibleModal, setVisibleModal] = useState<boolean>(false)
  const [visible, setVisible] = useState<boolean>(false)

  const [exerciseName, setExerciseName] = useState<string>()
  const [youtubeLink, setYoutubeLink] = useState<string>()
  const [description, setDescription] = useState<string>()
  const [muscleGroup, setMuscleGroup] = useState<string>()
  const [equipmentName, setEquipmentName] = useState<string>()
  const [difficulty, setDifficulty] = useState<string>()

  function getYouTubeVideoId(url: string) {
    try {
        const parsedUrl = new URL(url);

        if (parsedUrl.hostname.includes('youtube.com')) {
            if (parsedUrl.pathname === '/watch') {
                return parsedUrl.searchParams.get('v');
            } else if (parsedUrl.pathname.startsWith('/embed/')) {
                return parsedUrl.pathname.split('/embed/')[1];
            }
        }

        if (parsedUrl.hostname === 'youtu.be') {
            // Extract the video ID from the pathname
            return parsedUrl.pathname.slice(1);
        }

        return null;
    } catch (error) {
        console.error("Invalid URL:", error);
        return null;
    }
}

  const onPressNewExercise = async () => {

    if (!exerciseName || !muscleGroup || !equipmentName || !youtubeLink || !description || !difficulty) {
      return Alert.alert("All fields are required!")
    }

    try {
      setVisibleModal(!visibleModal)
      const youtubeId = getYouTubeVideoId(youtubeLink)
      return await addExercise(exerciseName, muscleGroup, equipmentName, user.id, youtubeId ?? '', description, difficulty)
    } catch (error) {
      console.error(error)
    }
  }

  const onPressRemoveExercise = async (id: number) => {
    try {
      return await removeExercise(id)
    } catch (error) {
      console.error(error)
    }
  }

  const onPressSelectExercise = async (id: number) => {
    const getExercise = await exerciseService.getExerciseById(id)

    setCurrentSelectedExercise({
      name: getExercise[0].name,
      instructions: getExercise[0].instructions ?? '',
      video_id: getExercise[0].video_id ?? '',
      difficulty: getExercise[0].difficulty ?? ''
    })

    setVisible(true)
  }

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
                    value={exerciseName}
                  />
                </View>
                <View style={{padding: 10}}>
                  <CustomTextInput
                    placeholder="Enter youtube video link"
                    onChangeText={(e) => setYoutubeLink(e)}
                    value={youtubeLink}
                  />
                </View>
                <View style={{padding: 10}}>
                  <CustomTextInput
                    placeholder="Enter description"
                    onChangeText={(e) => setDescription(e)}
                    value={description}
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
                <View style={{padding: 10, marginTop: 3}}>
                  <RNPickerSelect
                    placeholder={{label: 'Select difficulty', value: null}}
                    onValueChange={(value) => setDifficulty(value)}
                    items={fitnessLevel}
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
          <Dialog.Title style={{textAlign: 'center', fontSize: 18, fontWeight: 'bold'}}>{currentSelectedExercise?.name}</Dialog.Title>
          <View style={{justifyContent: 'center', paddingBottom: 20, alignItems: 'center'}}>
            <Text style={{fontSize: 15, color:
                  currentSelectedExercise.difficulty === 'Beginner'
                  ? 'greenyellow'
                  : currentSelectedExercise.difficulty === 'Intermediate'
                  ? 'orange'
                  : currentSelectedExercise.difficulty === 'Advanced'
                  ? 'red'
                  : 'black'}
                }>
                {currentSelectedExercise.difficulty}
            </Text>
          </View>
          <Dialog.Content style={{gap: 5}}>
            {
              currentSelectedExercise.video_id && <YoutubePlayer height={150} videoId={currentSelectedExercise.video_id} />
            }
            <Text style={{color: systemTheme.colors.text, textAlign: 'justify'}}>{currentSelectedExercise?.instructions}</Text>
            <Text style={{color: systemTheme.colors.primary, textAlign: 'justify', fontSize: 10, paddingTop: 15}}>Note: For pregnant and persons with disabilities please consult your doctor before performing these exercise.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisible(false)}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <SectionList
        extraData={searchQuery}
        sections={sortByMuscleGroup(exercise).map(section => ({
          ...section,
          data: section.data.filter(item => 
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
        }))}
        renderItem={({item}) => (
          <View>
            <CustomPressable 
              key={item.id} 
              text={item.name} 
              textStyle={{fontSize: 17, textAlign: 'center', color: systemTheme.colors.text}} 
              buttonStyle={{padding: 10, borderBottomWidth: 1, borderBottomColor: systemTheme.colors.border, backgroundColor: 'transparent'}}
              onPress={() => onPressSelectExercise(item.id)}
            />
            {
              item.custom
              ?
              <View
                style={{position: 'absolute', top: -15, right: -10}}
              >
                <TemplateMenu
                  editTemplate={() => {}}
                  deleteTemplate={() => onPressRemoveExercise(item.id)}
                />
              </View>
              :
              <></>
            }
          </View>
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