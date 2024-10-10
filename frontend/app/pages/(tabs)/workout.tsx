import CustomPressable from "@/components/custom/CustomPressable"
import useSystemTheme from "@/hooks/useSystemTheme"
import { NewTemplateItem, TemplateItem, TemplatesType } from "@/types/templates"
import { useEffect, useState } from "react"
import { Alert, Pressable, ScrollView, SectionList, StyleSheet, Text, View } from "react-native"
import { Button, Dialog, Icon, IconButton, Portal, TextInput } from "react-native-paper"
import { ExerciseInfo } from "@/types/exercise"
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import sortByMuscleGroup from "@/hooks/sortByMuscleGroup";
import { useRootNavigation } from "@/hooks/useRootNavigation"
import TemplateMenu from "@/components/TemplateMenu"
import templateService from "@/services/template.service"
import templateItemService from "@/services/templateItem.service"
import exerciseService from "@/services/exercise.service"
import ViewExerciseInfo from "@/components/ViewExerciseInfo"


const Workout = () => {
  const systemTheme = useSystemTheme()

  const [exercises, setExercises] = useState<Array<ExerciseInfo>>([])
  const [selectedExercises, setSelectedExercises] = useState<Array<{exercise_id: number, item_name: string, muscleGroup: string}>>([])

  const [newTemplateVisible, setNewTemplateVisible] = useState<boolean>(false)
  const [newTemplate, setNewTemplate] = useState<NewTemplateItem>({template_name: '', exercises: []})
  const [exerciseListVisible, setExerciseListVisible] = useState<boolean>(false)
  const [templateVisible, setTemplateVisible] = useState<boolean>(false)
  const [guideVisible, setGuideVisible] = useState<boolean>(false)
  const [workoutTemplates, setWorkoutTemplates] = useState<Array<TemplatesType>>([])
  const [currentTemplate, setCurrentTemplate] = useState<{
    template_name: string, exercises: Array<TemplateItem>
  }>({
    template_name: '',
    exercises: []
  })
  const [currentGuide, setCurrentGuide] = useState<{name: string, instructions?: string}>()

  const fetchTemplates = async () => {
    try {
      const templates = await templateService.getAllTemplate()
      return setWorkoutTemplates(templates)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchExercises = async () => {
    try {
      const listOfExercises = await exerciseService.getAllExercise()
      return setExercises(listOfExercises)
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
        exercises: item
      })
    } catch (error) {
      console.error(error)
    }
  }

  const onDismissTemplate = () => {
    setTemplateVisible(false)
    setCurrentTemplate({template_name: '', exercises: []})
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

  const onPressAddExercise = () => {
    setExerciseListVisible(false)
    setNewTemplate({...newTemplate, exercises: [...newTemplate.exercises, ...selectedExercises]})
    return setSelectedExercises([])
  }

  const onPressDeleteExercise = (id: number) => {
    const filter = newTemplate.exercises.filter((exercise, index) => index !== id)
    return setNewTemplate({...newTemplate, exercises: filter})
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
        return setCurrentGuide({name: exercise[0].name, instructions: exercise[0].instructions})
      }

      if (exercise && exercise[0].name) {
        return setCurrentGuide({name: exercise[0].name})
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

  useEffect(() => {
    fetchTemplates().catch((error) => console.error(error))
    fetchExercises().catch((error) => console.error(error))
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
          {/* Show pop up dialog for viewing exercise guides */}
          <Dialog visible={guideVisible} onDismiss={handleGuideDismiss}>
            <Dialog.Title style={{textAlign: 'center'}}>{currentGuide?.name}</Dialog.Title>
            <Dialog.Content>
              <Text style={{textAlign: 'justify', color: systemTheme.colors.text}}>{currentGuide?.instructions}</Text>
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
          {/* Show pop up dialog list of exercises that need to be selected */}
          <Dialog visible={exerciseListVisible}>
            <Dialog.Title style={{textAlign: 'center'}}>Exercises</Dialog.Title>
            <Dialog.Content style={{height: 350}}>
              <SectionList
                extraData={exercises}
                sections={sortByMuscleGroup(exercises)}
                renderItem={({item}) => (
                  <View key={item.id} style={{flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderBottomColor: systemTheme.colors.border, backgroundColor: 'transparent'}}>
                    <CustomPressable 
                      key={item.id} 
                      text={item.name} 
                      textStyle={{fontSize: 13, textAlign: 'center', color: systemTheme.colors.text}}
                      buttonStyle={{backgroundColor: 'transparent', width: '80%'}}
                      onPress={() => onPressSelectExercise(item.id, item.name)}
                    />
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
                  </View>
                )}
                renderSectionHeader={({section: {title}}) => (
                  <View style={{padding: 5, marginTop: 30}}>
                    <Text style={{fontSize: 10, color: systemTheme.colors.text}}># {title.toUpperCase()}</Text>
                  </View>
                )}
                stickySectionHeadersEnabled={false}
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
              <View
                style={styles.templates}
              >
                {
                  workoutTemplates && workoutTemplates.filter((template) => template.custom === 1).length > 0 ? (
                    workoutTemplates.filter((template) => template.custom === 1).map((template) => (
                    <Pressable
                      key={template.template_id}
                      style={[styles.templateContainerStyle, {borderColor: systemTheme.colors.outline}]}
                      onPress={() => onPressViewTemplate(template.template_id)}
                    >
                      <View
                        style={{position: 'absolute', top: -15, right: -10}}
                      >
                        <TemplateMenu
                          editTemplate={() => {}}
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
          </View>
          <View style={{gap: 5, flexGrow: 1}}>
            <Text style={{color: systemTheme.colors.text, fontSize: 20}}># Example templates</Text>
            <View style={styles.templates}>
              {
                workoutTemplates && workoutTemplates.filter((template) => template.custom === 0).map((template) => (
                  <Pressable
                    key={template.template_id}
                    style={[styles.templateContainerStyle, {borderColor: systemTheme.colors.outline}]}
                    onPress={() => onPressViewTemplate(template.template_id)}
                  >
                    <Text style={{color: systemTheme.colors.primary, fontSize: 12, fontWeight: 'bold', textAlign: 'center'}}>{template.template_name}</Text>
                  </Pressable>
                ))
              }
            </View>
          </View>
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
    justifyContent: 'space-between',
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
    alignItems: 'center'
  }
})

export default Workout