import CustomPressable from "@/components/custom/CustomPressable"
import useSystemTheme from "@/hooks/useSystemTheme"
import { EditTemplateItem, NewTemplateItem, TemplateItem, TemplatesType, TemplateTrainerItemProps, TemplateTrainerProps } from "@/types/templates"
import { useEffect, useState } from "react"
import { Alert, Pressable, ScrollView, SectionList, StyleSheet, Text, View } from "react-native"
import { Button, Dialog, Icon, IconButton, Portal, TextInput } from "react-native-paper"
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import sortByMuscleGroup from "@/hooks/sortByMuscleGroup";
import { useRootNavigation } from "@/hooks/useRootNavigation"
import TemplateMenu from "@/components/TemplateMenu"
import templateService from "@/services/template.service"
import templateItemService from "@/services/templateItem.service"
import exerciseService from "@/services/exercise.service"
import ViewExerciseInfo from "@/components/ViewExerciseInfo"
import { useExerciseStore } from "@/store/useExerciseStore"
import YoutubePlayer from "react-native-youtube-iframe";
import { useUserStore } from "@/store/useUserStore"
import { AxiosError } from "axios"

import RNPickerSelect from 'react-native-picker-select';
import { fitnessLevel } from "@/constants/exercise"
import { useTrainerStore } from "@/store/useTrainerStore"

type Preferences = {
  firstTime: boolean,
  darkMode: boolean,
  fitnessLevel: string
}

const Workout = () => {
  const systemTheme = useSystemTheme()
  const { exercise } = useExerciseStore()
  const { user, preferences, getUserPreferences } = useUserStore()
  const { trainerTemplate, fetchTrainerTemplates } = useTrainerStore()

  const [selectedExercises, setSelectedExercises] = useState<Array<{exercise_id: number, item_name: string, muscleGroup: string}>>([])

  const [newTemplateVisible, setNewTemplateVisible] = useState<boolean>(false)
  const [newClientTemplateVisible, setNewClientTemplateVisible] = useState<boolean>(false)
  const [difficulty, setDifficulty] = useState<string>('')
  const [newTemplate, setNewTemplate] = useState<NewTemplateItem>({template_name: '', exercises: []})
  const [editTemplate, setEditTemplate] = useState<EditTemplateItem>({template_id: 0, template_name: '', exercises: []})
  const [exerciseListVisible, setExerciseListVisible] = useState<boolean>(false)
  const [exerciseEditListVisible, setExerciseEditListVisible] = useState<boolean>(false)
  const [exerciseTrainerEditListVisible, setExerciseTrainerEditListVisible] = useState<boolean>(false)
  const [templateVisible, setTemplateVisible] = useState<boolean>(false)
  const [editTemplateVisible, setEditTemplateVisible] = useState<boolean>(false)
  const [editTrainerTemplateVisible, setEditTrainerTemplateVisible] = useState<boolean>(false)
  const [templateTrainerVisible, setTemplateTrainerVisible] = useState<boolean>(false)
  const [guideVisible, setGuideVisible] = useState<boolean>(false)
  const [workoutTemplates, setWorkoutTemplates] = useState<Array<TemplatesType>>([])
  const [currentTemplate, setCurrentTemplate] = useState<{
    template_name: string, exercises: Array<TemplateItem>, difficulty: string | null
  }>({
    template_name: '',
    exercises: [],
    difficulty: null
  })
  const [currentGuide, setCurrentGuide] = useState<{name: string, instructions?: string, video_id?: string | null, difficulty: string | null}>({name: '', instructions: '', video_id: '', difficulty: ''})

  const fetchTemplates = async () => {
    try {
      const templates = await templateService.getAllTemplate()
      return setWorkoutTemplates(templates)
    } catch (error) {
      console.error(error)
    }
  }

  const onPressViewTemplate = async (id: number) => {
    try {
      setTemplateVisible(true)
      const template_name = await templateService.getTemplateById(id)
      const item = await templateItemService.getAllTemplateItemsById(id)
      setCurrentTemplate({
        template_name: template_name[0].template_name,
        exercises: item,
        difficulty: null
      })
    } catch (error) {
      console.error(error)
    }
  }

  const onPressViewTrainerTemplate = async (id: number) => {
    try {
      setTemplateTrainerVisible(true)
      const template_name = await templateService.findTrainerTemplateById(id)
      const item = await templateService.findTrainerTemplateItemById(id)
      setCurrentTemplate({
        template_name: template_name.data.template_name,
        exercises: item.data,
        difficulty: template_name.data.difficulty
      })
    } catch (error) {
      console.error(error)
    }
  }

  const onDismissTemplate = () => {
    setTemplateVisible(false)
    setCurrentTemplate({template_name: '', exercises: [], difficulty: null})

    if (templateTrainerVisible) {
      setTemplateTrainerVisible(false)
      setCurrentTemplate({template_name: '', exercises: [], difficulty: null})
    }
  }

  const onPressCreateTemplate = async () => {
    try {

      const initTemplate = await templateService.createTemplate(newTemplate.template_name, true)

      await templateItemService.createTemplateItem(initTemplate.lastInsertRowId, ...newTemplate.exercises)

      await fetchTemplates()

      Alert.alert('Created new template success!')

      setNewTemplate({...newTemplate, template_name: '', exercises: []})

      return setNewTemplateVisible(false)
    } catch (error) {
      console.error(error)
    }
  }

  const onPressCreateTrainerTemplate = async () => {
    try {

      if (!difficulty) return Alert.alert("Difficulty field is required!")
      await templateService.createTrainerTemplate(newTemplate.template_name, 1, difficulty, user.id, newTemplate.exercises)
      setNewTemplate({...newTemplate, template_name: '', exercises: []})

      setNewClientTemplateVisible(false)

      return await fetchTrainerTemplates(user.id)

    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data)
      }
    }
  }

  const onPressEditTemplate = async (templateId: number) => {
    try {
      setEditTemplateVisible(true)
      const template = await templateService.getTemplateById(templateId)
      const getTemplateExercises = await templateItemService.getAllTemplateItemsById(templateId)

      const templateExercises = getTemplateExercises.map(exercise => {
        return {
          template_item_id: exercise.template_item_id,
          exercise_id: exercise.exercise_id,
          item_name: exercise.template_item_name,
          muscleGroup: exercise.muscle_group
        }
      })

      setEditTemplate({template_id: template[0].template_id, template_name: template[0].template_name, exercises: templateExercises})
      setSelectedExercises([])
    } catch (error) {
      console.error(error)
    }
  }

  const onPressEditTrainerTemplate = async (templateId: number) => {
    try {
      setEditTrainerTemplateVisible(true)
      const template = await templateService.findTrainerTemplateById(templateId)
      const getTemplateExercises = await templateService.findTrainerTemplateItemById(templateId)

      const templateData: TemplateTrainerProps = template.data
      const getTemplateExercisesData: Array<TemplateTrainerItemProps> = getTemplateExercises.data

      const templateExercises = getTemplateExercisesData.map(exercise => {
        return {
          template_item_id: exercise.template_item_id,
          exercise_id: exercise.exercise_id,
          item_name: exercise.template_item_name,
          muscleGroup: exercise.muscle_group
        }
      })

      setDifficulty(template.data.difficulty)
      setEditTemplate({template_id: templateData.template_id, template_name: templateData.template_name, exercises: templateExercises})
      setSelectedExercises([])
    } catch (error) {
      console.error(error)
    }
  }

  const onPressDeleteTemplate = async (id: number) => {
    try {
      await templateService.deleteTemplate(id)

      await templateItemService.deleteItemsForTemplate(id)

      onDismissTemplate()

      await fetchTemplates()

      return Alert.alert('Deleted successfully!')
    } catch (error) {
      console.error(error)
    }
  }

  const onPressDeleteTrainerTemplate = async (id: number) => {
    try {
      await templateService.deleteTrainerTemplate(id)
      await fetchTrainerTemplates(user.id)
    } catch (error) {
      console.error(error)
    }
  }

  const onPressAddExercise = () => {
    setExerciseListVisible(false)
    setNewTemplate({...newTemplate, exercises: [...newTemplate.exercises, ...selectedExercises]})
    return setSelectedExercises([])
  }

  const onPressAddEditExercise = async () => {
    setExerciseEditListVisible(false)

    await templateItemService.createTemplateItem(editTemplate.template_id, ...selectedExercises)
    const items = await templateItemService.getAllTemplateItemsById(editTemplate.template_id)

    const exercisesItems = items.map(exe => {
      return {
        template_item_id: exe.template_item_id,
        exercise_id: exe.exercise_id,
        item_name: exe.template_item_name,
        muscleGroup: exe.muscle_group
      }
    })

    setEditTemplate({...editTemplate, exercises: [...exercisesItems]})
  }

  const onPressAddEditTrainerExercise = async () => {
    setExerciseTrainerEditListVisible(false)

    const item = await templateService.createTrainerItem(editTemplate.template_id, selectedExercises)
    setEditTemplate({...editTemplate, exercises: [...editTemplate.exercises, ...item.data]})

    setSelectedExercises([])
  }

  const onPressDeleteExercise = (id: number) => {
    const filter = newTemplate.exercises.filter((exercise, index) => index !== id)
    return setNewTemplate({...newTemplate, exercises: filter})
  }

  const onPressEditDeleteExercise = async (id: number) => {
    await templateItemService.deleteTemplateItem(id)
    setEditTemplate({...editTemplate, exercises: editTemplate.exercises.filter(e => e.template_item_id !== id)})
  }

  const onPressEditDeleteTrainerExercise = async (id: number) => {
    await templateService.deleteTrainerItemTemplate(id)
    setEditTemplate({...editTemplate, exercises: editTemplate.exercises.filter(e => e.template_item_id !== id)})
  }

  const onPressSelectExercise = async (id: number, name: string) => {
    if (selectedExercises.some(exercise => exercise.exercise_id === id)) {
      const filter = selectedExercises.filter(exercise => exercise.exercise_id !== id)
      return setSelectedExercises(filter)
    }
    const exercise = await exerciseService.getExerciseById(id)
    if (exercise) {
      return setSelectedExercises([...selectedExercises, {exercise_id: id, item_name: name, muscleGroup: exercise[0].muscle_group}])
    }
  }

  const onPressShowGuide = async (id: number) => {
    try {
      handleGuideShow()
      const exercise = await exerciseService.getExerciseById(id)

      if (exercise && exercise[0].instructions) {
        return setCurrentGuide({name: exercise[0].name, instructions: exercise[0].instructions, video_id: exercise[0].video_id, difficulty: exercise[0].difficulty})
      }

      if (exercise && exercise[0].name) {
        return setCurrentGuide({name: exercise[0].name, difficulty: exercise[0].difficulty})
      }
    } catch (error) {
      console.error(error)
    }
  }

  const onPressStartWorkout = () => {
    setTemplateVisible(false)

    if (useRootNavigation.isReady()) {
      return useRootNavigation.navigate('WorkoutSession', {templateId: currentTemplate.exercises[0].template_id})
    }
  }

  const onPressStartTrainerWorkout = () => {
    setTemplateTrainerVisible(false)

    if (useRootNavigation.isReady()) {
      return useRootNavigation.navigate('TrainerSession', {templateId: currentTemplate.exercises[0].template_id})
    }
  }

  const handleGuideShow = () => {
    // if guide has been clicked, hide the template and show guide.
    setTemplateVisible(false)
    setGuideVisible(true)
  }

  const handleGuideDismiss = () => {
    // if guide has been dismissed, show the template and hide guide.
    setTemplateVisible(true)
    setGuideVisible(false)
  }

  const handleTemplateName = (e: string) => {
    setNewTemplate({...newTemplate, template_name: e})
  }

  const onValueChangeFitnessLevel = (value: string) => {
    return setDifficulty(value)
  }

  const filterByDifficulty = (exercise: Array<TemplateTrainerProps>) => {

    if (!preferences) return exercise

    if (preferences.fitnessLevel === 'Beginner') {
      return exercise.filter(diff => diff.difficulty === 'Beginner')
    } else if (preferences.fitnessLevel === 'Intermediate') {
      return exercise.filter(diff => diff.difficulty !== 'Advanced')
    } else {
      return exercise
    }
  }

  const onPressRefreshTrainerTemplates = async () => {
    if (user.trainerId) {
      await fetchTrainerTemplates(user.trainerId)
      await getUserPreferences()
    }

    if (user.role === 'TRAINER') {
      await fetchTrainerTemplates(user.id)
      await getUserPreferences()
    }
  }

  useEffect(() => {
    fetchTemplates().catch((error) => console.error(error))

    if (user.role === "TRAINER") {
      fetchTrainerTemplates(user.id).catch(error => console.error(error.data.message))
      getUserPreferences().catch(error => console.error(error.data.message))
    }

    if (user.role === "USER" && user.trainerId) {
      fetchTrainerTemplates(user.trainerId).catch(error => console.error(error.data.message))
      getUserPreferences().catch(error => console.error(error.data.message))
    }
  }, [])

  return (
    <View style={styles.container}>
      <View style={{marginTop: '15%', padding: 5}}>
        <Portal>
          {/* Show dialog for viewing templates */}
          <Dialog visible={templateVisible} onDismiss={onDismissTemplate}>
            <Dialog.Title style={{textAlign: 'center'}}>{currentTemplate.template_name}</Dialog.Title>
            <Dialog.ScrollArea style={{borderColor: systemTheme.colors.outline}}>
              <ScrollView showsVerticalScrollIndicator={false} style={{marginBottom: 25, marginTop: 5, maxHeight: 400}}>
                {
                  currentTemplate && currentTemplate.exercises.map(item => (
                    <View
                      style={[styles.templateItem]}
                      key={item.template_item_id}
                    >
                      <View style={{
                        justifyContent: 'flex-end'
                      }}>
                        <Text 
                        style={{
                            fontSize: 15, 
                            fontWeight: 'bold', 
                            color: systemTheme.colors.text,
                            width: 200
                          }}
                        numberOfLines={1}
                        >
                          {item.template_item_name}
                        </Text>
                        <Text style={{color: systemTheme.colors.primary}}>{item.muscle_group}</Text>
                      </View>
                      <View>
                        <IconButton
                          icon="information"
                          size={23}
                          iconColor={systemTheme.colors.primary}
                          onPress={() => onPressShowGuide(item.exercise_id)}
                        />
                      </View>
                    </View>
                  ))
                }
              </ScrollView>
            </Dialog.ScrollArea>
            <Dialog.Actions>
              <Button onPress={onPressStartWorkout}>Start Workout</Button>
            </Dialog.Actions>
          </Dialog>
          {/* Show dialog for viewing trainer template */}
          <Dialog style={{position: 'relative'}} visible={templateTrainerVisible} onDismiss={onDismissTemplate}>
            <Dialog.Title style={{textAlign: 'center'}}>
              <Text>{currentTemplate.template_name}</Text>
            </Dialog.Title>
            <View style={{justifyContent: 'center', paddingBottom: 20, alignItems: 'center'}}>
              <Text style={{fontSize: 15, color:
                    currentTemplate.difficulty === 'Beginner'
                    ? 'greenyellow'
                    : currentTemplate.difficulty === 'Intermediate'
                    ? 'orange'
                    : currentTemplate.difficulty === 'Advanced'
                    ? 'red'
                    : 'black'}
                  }>
                  {currentTemplate.difficulty}
              </Text>
            </View>
            <Dialog.ScrollArea style={{borderColor: systemTheme.colors.outline}}>
              <ScrollView showsVerticalScrollIndicator={false} style={{marginBottom: 25, marginTop: 5, maxHeight: 400}}>
                {
                  currentTemplate && currentTemplate.exercises.map(item => (
                    <View
                      style={[styles.templateItem]}
                      key={item.template_item_id}
                    >
                      <View style={{
                        justifyContent: 'flex-end'
                      }}>
                        <Text 
                        style={{
                            fontSize: 15, 
                            fontWeight: 'bold', 
                            color: systemTheme.colors.text,
                            width: 200
                          }}
                        numberOfLines={1}
                        >
                          {item.template_item_name}
                        </Text>
                        <Text style={{color: systemTheme.colors.primary}}>{item.muscle_group}</Text>
                      </View>
                      <View>
                        <IconButton
                          icon="information"
                          size={23}
                          iconColor={systemTheme.colors.primary}
                          onPress={() => onPressShowGuide(item.exercise_id)}
                        />
                      </View>
                    </View>
                  ))
                }
              </ScrollView>
            </Dialog.ScrollArea>
            <Dialog.Actions>
              <Button onPress={onPressStartTrainerWorkout}>Start Workout</Button>
            </Dialog.Actions>
          </Dialog>
          {/* Show pop up dialog for viewing exercise guides */}
          <Dialog visible={guideVisible} onDismiss={handleGuideDismiss}>
            <Dialog.Title style={{textAlign: 'center'}}>{currentGuide?.name}</Dialog.Title>
            <View style={{justifyContent: 'center', paddingBottom: 20, alignItems: 'center'}}>
              <Text style={{fontSize: 15, color:
                    currentGuide.difficulty === 'Beginner'
                    ? 'greenyellow'
                    : currentGuide.difficulty === 'Intermediate'
                    ? 'orange'
                    : currentGuide.difficulty === 'Advanced'
                    ? 'red'
                    : 'black'}
                  }>
                  {currentGuide.difficulty}
              </Text>
            </View>
            <Dialog.Content>
              {
                currentGuide.video_id && <YoutubePlayer height={150} videoId={currentGuide.video_id} />
              }
              <Text style={{textAlign: 'justify', color: systemTheme.colors.text}}>{currentGuide?.instructions}</Text>
              <Text style={{color: systemTheme.colors.primary, textAlign: 'justify', fontSize: 10, paddingTop: 15}}>Note: For pregnant and persons with disabilities please consult your doctor before performing these exercise.</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={handleGuideDismiss}>OK</Button>
            </Dialog.Actions>
          </Dialog>
          {/* Show pop up dialog for creating new template */}
          <Dialog visible={newTemplateVisible}>
            <Dialog.Title style={{textAlign: 'center'}}>Add new template</Dialog.Title>
            <Dialog.Content style={{gap: 10}}>
              <TextInput label="Template Name" style={{backgroundColor: 'transparent'}} onChangeText={handleTemplateName} />
              <Button icon="plus" mode="outlined" onPress={() => setExerciseListVisible(true)}>Add new exercises</Button>
              <ScrollView
                style={{height: 200}}
              >
                {
                  newTemplate.exercises && newTemplate.exercises.map((exercise, index) => (
                      <View key={index} style={{flexDirection: 'row', justifyContent: 'space-between', padding: 10}}>
                        <Text style={{fontSize: 15, color: systemTheme.colors.text}}>
                          {exercise.item_name}
                        </Text>
                        <MaterialIcons
                            onPress={() => onPressDeleteExercise(index)}
                            name="delete"
                            size={20}
                            color="red"
                        />
                      </View>
                    ))
                }
              </ScrollView>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                disabled={newTemplate.exercises.length === 0 || newTemplate.template_name.length === 0}
                onPress={onPressCreateTemplate}
              >
                Create
              </Button>
              <Button onPress={() => {setNewTemplateVisible(false); setNewTemplate({...newTemplate, template_name: '', exercises: []})}}>Cancel</Button>
            </Dialog.Actions>
          </Dialog>
          {/* Show pop up dialog for editing template */}
          <Dialog visible={editTemplateVisible}>
            <Dialog.Title style={{textAlign: 'center'}}>Edit template</Dialog.Title>
            <Dialog.Content style={{gap: 10}}>
              <TextInput label="Template Name" style={{backgroundColor: 'transparent'}} onChangeText={(e) => setEditTemplate({...editTemplate, template_name: e})} value={editTemplate.template_name} />
              <Button icon="plus" mode="outlined" onPress={() => setExerciseEditListVisible(true)}>Add exercises</Button>
              <ScrollView
                style={{height: 200}}
              >
                {
                  editTemplate.exercises && editTemplate.exercises.map((exercise, index) => (
                      <View key={index} style={{flexDirection: 'row', justifyContent: 'space-between', padding: 10}}>
                        <Text style={{fontSize: 15, color: systemTheme.colors.text}}>
                          {exercise.item_name}
                        </Text>
                        <MaterialIcons
                            onPress={() => onPressEditDeleteExercise(exercise.template_item_id)}
                            name="delete"
                            size={20}
                            color="red"
                        />
                      </View>
                    ))
                }
              </ScrollView>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                onPress={async () => {
                  if (editTemplate.template_id) {
                    await templateService.updateTemplate(editTemplate.template_id, editTemplate.template_name)
                  }
                  setEditTemplateVisible(false)
                  await fetchTemplates()
                }}
              >
                OK
              </Button>
            </Dialog.Actions>
          </Dialog>
          {/* Show pop up dialog for editing trainer client templates */}
          <Dialog visible={editTrainerTemplateVisible}>
            <Dialog.Title style={{textAlign: 'center'}}>Edit client template</Dialog.Title>
            <Dialog.Content style={{gap: 10}}>
              <TextInput label="Template Name" style={{backgroundColor: 'transparent'}} onChangeText={(e) => setEditTemplate({...editTemplate, template_name: e})} value={editTemplate.template_name} />
              <Button icon="plus" mode="outlined" onPress={() => setExerciseTrainerEditListVisible(true)}>Add exercises</Button>
              <RNPickerSelect
                style={{inputAndroid: {color: systemTheme.colors.text}}}
                onValueChange={onValueChangeFitnessLevel}
                items={fitnessLevel}
                placeholder={{label: 'Workout template difficulty'}}
                value={difficulty}
              />
              <ScrollView
                style={{height: 200}}
              >
                {
                  editTemplate.exercises && editTemplate.exercises.map((exercise, index) => (
                      <View key={index} style={{flexDirection: 'row', justifyContent: 'space-between', padding: 10}}>
                        <Text style={{fontSize: 15, color: systemTheme.colors.text}}>
                          {exercise.item_name}
                        </Text>
                        <MaterialIcons
                            onPress={() => onPressEditDeleteTrainerExercise(exercise.template_item_id)}
                            name="delete"
                            size={20}
                            color="red"
                        />
                      </View>
                    ))
                }
              </ScrollView>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                onPress={async () => {
                  if (!difficulty) {
                    return Alert.alert("Please select a proper difficulty level")
                  }
                  if (editTemplate.template_id) {
                    await templateService.updateTrainerTemplate(editTemplate.template_id, editTemplate.template_name, 1, difficulty, user.id)
                  }
                  setEditTrainerTemplateVisible(false)
                  await fetchTrainerTemplates(user.id)
                }}
              >
                OK
              </Button>
            </Dialog.Actions>
          </Dialog>
          {/* Pop up dialog for creating new template for clients */}
          <Dialog visible={newClientTemplateVisible}>
            <Dialog.Title style={{textAlign: 'center', fontSize: 18}}>Add new template for clients</Dialog.Title>
            <Dialog.Content style={{gap: 10}}>
              <TextInput label="Template Name" style={{backgroundColor: 'transparent'}} onChangeText={handleTemplateName} />
              <Button icon="plus" mode="outlined" onPress={() => setExerciseListVisible(true)}>Add new exercises</Button>
              <RNPickerSelect
                style={{inputAndroid: {color: systemTheme.colors.text}}}
                onValueChange={onValueChangeFitnessLevel}
                items={fitnessLevel}
                placeholder={{label: 'Workout template difficulty'}}
                value={difficulty}
              />
              <ScrollView
                style={{height: 200}}
              >
                {
                  newTemplate.exercises && newTemplate.exercises.map((exercise, index) => (
                      <View key={index} style={{flexDirection: 'row', justifyContent: 'space-between', padding: 10}}>
                        <Text style={{fontSize: 15, color: systemTheme.colors.text}}>
                          {exercise.item_name}
                        </Text>
                        <MaterialIcons
                            onPress={() => onPressDeleteExercise(index)}
                            name="delete"
                            size={20}
                            color="red"
                        />
                      </View>
                    ))
                }
              </ScrollView>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                disabled={newTemplate.exercises.length === 0 || newTemplate.template_name.length === 0}
                onPress={onPressCreateTrainerTemplate}
              >
                Create
              </Button>
              <Button onPress={() => {setNewClientTemplateVisible(false); setNewTemplate({...newTemplate, template_name: '', exercises: []})}}>Cancel</Button>
            </Dialog.Actions>
          </Dialog>
          {/* Show pop up dialog list of exercises that need to be selected */}
          <Dialog visible={exerciseListVisible}>
            <Dialog.Title style={{textAlign: 'center'}}>Exercises</Dialog.Title>
            <Dialog.Content style={{height: 350}}>
              <SectionList
                extraData={exercise}
                sections={sortByMuscleGroup(exercise)}
                renderItem={({item}) => (
                  <Pressable key={item.id} style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        padding: 10, borderBottomWidth: 1, borderBottomColor: systemTheme.colors.border,
                        backgroundColor: 'transparent',
                      }}
                      onPress={() => onPressSelectExercise(item.id, item.name)}
                    >
                    <Text
                      style={{color: systemTheme.colors.text, width: '80%'}}
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>
                    {
                      selectedExercises.some(exercise => exercise.exercise_id === item.id)
                      ?
                      <Icon
                        source='check-circle'
                        size={23}
                        color={systemTheme.colors.primary}
                      />
                      :
                      <ViewExerciseInfo id={item.id} />
                    }
                  </Pressable>
                )}
                renderSectionHeader={({section: {title}}) => (
                  <View style={{padding: 5, marginTop: 30}}>
                    <Text style={{fontSize: 10, color: systemTheme.colors.text}}># {title.toUpperCase()}</Text>
                  </View>
                )}
                stickySectionHeadersEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                  onPress={onPressAddExercise}
                  disabled={selectedExercises.length === 0}
              >
                Add
              </Button>
              <Button onPress={() => { setSelectedExercises([]); setExerciseListVisible(false)}}>Cancel</Button>
            </Dialog.Actions>
          </Dialog>
          {/* Show pop up dialog for adding exercises for existing template */}
          <Dialog visible={exerciseEditListVisible}>
            <Dialog.Title style={{textAlign: 'center'}}>Add Exercises</Dialog.Title>
            <Dialog.Content style={{height: 350}}>
              <SectionList
                extraData={exercise}
                sections={sortByMuscleGroup(exercise)}
                renderItem={({item}) => (
                  <Pressable key={item.id} style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        padding: 10, borderBottomWidth: 1, borderBottomColor: systemTheme.colors.border,
                        backgroundColor: 'transparent',
                      }}
                      onPress={() => onPressSelectExercise(item.id, item.name)}
                    >
                    <Text
                      style={{color: systemTheme.colors.text, width: '80%'}}
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>
                    {
                      selectedExercises.some(exercise => exercise.exercise_id === item.id)
                      ?
                      <Icon
                        source='check-circle'
                        size={23}
                        color={systemTheme.colors.primary}
                      />
                      :
                      <ViewExerciseInfo id={item.id} />
                    }
                  </Pressable>
                )}
                renderSectionHeader={({section: {title}}) => (
                  <View style={{padding: 5, marginTop: 30}}>
                    <Text style={{fontSize: 10, color: systemTheme.colors.text}}># {title.toUpperCase()}</Text>
                  </View>
                )}
                stickySectionHeadersEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                  onPress={onPressAddEditExercise}
                  disabled={selectedExercises.length === 0}
              >
                Add
              </Button>
              <Button onPress={() => { setSelectedExercises([]); setExerciseEditListVisible(false)}}>Cancel</Button>
            </Dialog.Actions>
          </Dialog>
          {/* Show pop up dialog for adding exercise on existing trainer template */}
          <Dialog visible={exerciseTrainerEditListVisible}>
            <Dialog.Title style={{textAlign: 'center'}}>Add Exercises</Dialog.Title>
            <Dialog.Content style={{height: 350}}>
              <SectionList
                extraData={exercise}
                sections={sortByMuscleGroup(exercise)}
                renderItem={({item}) => (
                  <Pressable key={item.id} style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        padding: 10, borderBottomWidth: 1, borderBottomColor: systemTheme.colors.border,
                        backgroundColor: 'transparent',
                      }}
                      onPress={() => onPressSelectExercise(item.id, item.name)}
                    >
                    <Text
                      style={{color: systemTheme.colors.text, width: '80%'}}
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>
                    {
                      selectedExercises.some(exercise => exercise.exercise_id === item.id)
                      ?
                      <Icon
                        source='check-circle'
                        size={23}
                        color={systemTheme.colors.primary}
                      />
                      :
                      <ViewExerciseInfo id={item.id} />
                    }
                  </Pressable>
                )}
                renderSectionHeader={({section: {title}}) => (
                  <View style={{padding: 5, marginTop: 30}}>
                    <Text style={{fontSize: 10, color: systemTheme.colors.text}}># {title.toUpperCase()}</Text>
                  </View>
                )}
                stickySectionHeadersEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                  onPress={onPressAddEditTrainerExercise}
                  disabled={selectedExercises.length === 0}
              >
                Add
              </Button>
              <Button onPress={() => { setSelectedExercises([]); setExerciseTrainerEditListVisible(false)}}>Cancel</Button>
            </Dialog.Actions>
          </Dialog>
          {/* End of dialog */}
        </Portal>
        <View style={{marginTop: 30, gap: 10, alignItems: 'center'}}>
          <Text style={{color: systemTheme.colors.text, fontSize: 17}}>Start Workout</Text>
          <CustomPressable
            buttonStyle={{backgroundColor: systemTheme.colors.primary, borderRadius: 5, width: '90%'}}
            textStyle={{fontSize: 20, color: 'white'}}
            text="Add new template"
            onPress={() => setNewTemplateVisible(true)}
          />
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.templateContainer}>
          <View style={{gap: 5, flexGrow: 1}}>
            <Text style={{color: systemTheme.colors.text, fontSize: 20}}># My templates</Text>
            <View style={styles.templates}>
              {
                workoutTemplates && workoutTemplates.filter((template) => template.custom === 1).length > 0 ? (
                  workoutTemplates.filter((template) => template.custom === 1).map((template) => (
                  <Pressable
                    key={template.template_id}
                    style={[styles.templateContainerStyle, {borderColor: systemTheme.colors.outline, backgroundColor: systemTheme.colors.card}]}
                    onPress={() => onPressViewTemplate(template.template_id)}
                  >
                    <View
                      style={{position: 'absolute', top: -15, right: -10}}
                    >
                      <TemplateMenu
                        editTemplate={() => onPressEditTemplate(template.template_id)}
                        deleteTemplate={() => onPressDeleteTemplate(template.template_id)}
                      />
                    </View>
                    <Text style={{color: systemTheme.colors.primary, fontSize: 12, fontWeight: 'bold', textAlign: 'center'}}>{template.template_name}</Text>
                  </Pressable>
                ))
              ) : (
                  <Text style={{color: systemTheme.colors.text}}>No custom templates</Text>
                )
              }
            </View>
          </View>
          <View style={{gap: 5, flexGrow: 1}}>
            <Text style={{color: systemTheme.colors.text, fontSize: 20}}># Example templates</Text>
            <View style={styles.templates}>
              {
                workoutTemplates && workoutTemplates.filter((template) => template.custom === 0).map((template) => (
                  <Pressable
                    key={template.template_id}
                    style={[styles.templateContainerStyle, {borderColor: systemTheme.colors.outline, backgroundColor: systemTheme.colors.card}]}
                    onPress={() => onPressViewTemplate(template.template_id)}
                  >
                    <Text style={{color: systemTheme.colors.primary, fontSize: 12, fontWeight: 'bold', textAlign: 'center'}}>{template.template_name}</Text>
                  </Pressable>
                ))
              }
            </View>
          </View>
          {
            user.role === "USER"
            ?
            <View style={{gap: 5, flexGrow: 1}}>
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingBottom: 20}}>
                <Text style={{color: systemTheme.colors.text, fontSize: 20, textAlign: 'center'}}># Your trainer templates</Text>
                <Button
                  mode="contained"
                  icon="reload"
                  onPress={async () => await onPressRefreshTrainerTemplates()}
                >
                  Refresh
                </Button>
              </View>
              <View style={styles.templates}>
                {
                  trainerTemplate && user.approved && filterByDifficulty(trainerTemplate).map((template) => (
                    <Pressable
                      key={template.template_id}
                      style={[styles.templateContainerStyle, {borderColor: systemTheme.colors.outline, backgroundColor: systemTheme.colors.card}]}
                      onPress={async () => await onPressViewTrainerTemplate(template.template_id)}
                  >
                    <Text style={{color: systemTheme.colors.primary, fontSize: 12, fontWeight: 'bold', textAlign: 'center'}}>{template.template_name}</Text>
                  </Pressable>
                  ))
                }
                {
                  (trainerTemplate.length === 0 || !user.approved) && <Text style={{color: systemTheme.colors.text}}>No trainer templates</Text>
                }
              </View>
            </View>
            :
            <View style={{gap: 5, flexGrow: 1}}>
              <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around', gap: 10, paddingBottom: 20}}>
                <Text style={{color: systemTheme.colors.text, fontSize: 20}}>Template for clients</Text>
                <Button
                  mode="contained"
                  icon="reload"
                  onPress={async () => await onPressRefreshTrainerTemplates()}
                >
                  Refresh
                </Button>
                <CustomPressable
                  buttonStyle={{backgroundColor: systemTheme.colors.primary, borderRadius: 5, width: '90%'}}
                  textStyle={{fontSize: 20, color: 'white'}}
                  text="Add new template for clients"
                  onPress={() => setNewClientTemplateVisible(true)}
                />
              </View>
              <View style={styles.templates}>
                {
                  trainerTemplate && trainerTemplate.map((template) => (
                    <Pressable
                      key={template.template_id}
                      style={[styles.templateContainerStyle, {borderColor: systemTheme.colors.outline, backgroundColor: systemTheme.colors.card}]}
                      onPress={() => onPressViewTrainerTemplate(template.template_id)}
                  >
                    <View
                      style={{position: 'absolute', top: -15, right: -10}}
                    >
                      <TemplateMenu
                        editTemplate={() => onPressEditTrainerTemplate(template.template_id)}
                        deleteTemplate={() => onPressDeleteTrainerTemplate(template.template_id)}
                      />
                    </View>
                    <Text style={{color: systemTheme.colors.primary, fontSize: 12, fontWeight: 'bold', textAlign: 'center'}}>{template.template_name}</Text>
                  </Pressable>
                  ))
                }
              </View>
            </View>
          }
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    height: '100%'
  },
  templateContainer: {
    paddingTop: 20,
    gap: 15,
    flexGrow: 1,
    paddingBottom: 125
  },
  templates: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    rowGap: 10
  },
  templateItem: {
    padding: 10,
    flexDirection: 'row',
    gap: 10,
  },
  templateContainerStyle: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderRadius: 5,
    width: 110,
    height: 105,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 3,
    marginRight: 3
  }
})

export default Workout