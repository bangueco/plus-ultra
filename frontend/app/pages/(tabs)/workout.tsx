import CustomPressable from "@/components/custom/CustomPressable"
import { exercisesDatabase, templatesDatabase } from "@/database"
import useSystemTheme from "@/hooks/useSystemTheme"
import { NewTemplateItem, TemplateItem, TemplatesType } from "@/types/templates"
import { useEffect, useState } from "react"
import { Alert, ScrollView, SectionList, StyleSheet, Text, View } from "react-native"
import { Button, Checkbox, Dialog, Icon, IconButton, Portal, TextInput } from "react-native-paper"
import { ExerciseInfo } from "@/types/exercise"
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import sortByMuscleGroup from "@/hooks/sortByMuscleGroup";
import { StackActions } from "@react-navigation/native"
import { useRootNavigation } from "@/hooks/useRootNavigation"


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
  const [currentTemplate, setCurrentTemplate] = useState<Array<TemplateItem>>([])
  const [currentTemplateCustom, setCurrentTemplateCustom] = useState<boolean>(true)
  const [currentGuide, setCurrentGuide] = useState<{name: string, instructions?: string}>()

  const fetchTemplates = async () => {
    try {
      const templates = await templatesDatabase.db.getAllAsync<TemplatesType>('SELECT * FROM templates;')
      console.log('Templates fetched successfully')
      return setWorkoutTemplates(templates)
    } catch (error) {
      console.error(error)
    }
  }

  const onPressSelectTemplate = async (id: number) => {
    try {
      setTemplateVisible(true)
      const template = await templatesDatabase.db.getFirstAsync<{custom: string}>(`SELECT custom FROM templates WHERE template_id=${id}`)
      template?.custom === 'true' ? setCurrentTemplateCustom(true) : setCurrentTemplateCustom(false)
      const item = await templatesDatabase.db.getAllAsync<TemplateItem>(`SELECT * FROM template_items WHERE template_id=${id}`)
      setCurrentTemplate(item)
    } catch (error) {
      console.error(error)
    }
  }

  const onDismissTemplate = () => {
    setTemplateVisible(false)
    setCurrentTemplate([])
  }

  const onPressCreateTemplate = async () => {
    try {
      const insertTemplate = await templatesDatabase.db.runAsync(`
        INSERT INTO templates(template_name, custom) VALUES ('${newTemplate.template_name}', 'true');
      `)

      newTemplate.exercises.map(async (item) => {
        return await templatesDatabase.db.execAsync(`
          INSERT INTO template_items(item_name, muscleGroup, template_id, exercise_id)
          VALUES ('${item.item_name}', '${item.muscleGroup}', '${insertTemplate.lastInsertRowId}', '${item.exercise_id}')
        `)
      })

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
      await templatesDatabase.db.runAsync(`
        DELETE FROM templates WHERE template_id=${id}
      `)

      await templatesDatabase.db.runAsync(`
        DELETE FROM template_items WHERE template_id=${id}
      `)

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
    const exerciseMuscleGroup = await exercisesDatabase.db.getFirstAsync<{muscleGroup: string}>(`SELECT muscleGroup FROM exercise WHERE id=${id}`)
    if (exerciseMuscleGroup) {
      return setSelectedExercises([...selectedExercises, {exercise_id: id, item_name: name, muscleGroup: exerciseMuscleGroup.muscleGroup}])
    }
  }

  const onPressShowGuide = async (id: number) => {
    try {
      handleGuideShow()
      const exercise = await exercisesDatabase.db.getFirstAsync<ExerciseInfo>(`SELECT * FROM exercise WHERE id=${id}`)

      if (exercise && exercise.instructions) {
        const {name, instructions} = exercise
        return setCurrentGuide({name, instructions})
      }

      if (exercise && exercise.name) {
        return setCurrentGuide({name: exercise.name})
      }
    } catch (error) {
      console.error(error)
    }
  }

  const onPressStartWorkout = () => {
    setTemplateVisible(false)
    
    if (useRootNavigation.isReady()) {
      return useRootNavigation.dispatch(StackActions.replace('WorkoutSession', {templateId: currentTemplate[0].template_id}))
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
    fetchTemplates().then(() => console.log('Fetched successfully'))
  }, [])

  useEffect(() => {
    exercisesDatabase.db.getAllAsync<ExerciseInfo>('SELECT * FROM exercise;')
    .then(data => {
      setExercises(data)
    })
    .catch(error => console.error(error))
  }, [])

  return (
    <View style={styles.container}>
      <View style={{marginTop: '15%', padding: 5}}>
        <Portal>
          {/* Show dialog for viewing templates */}
          <Dialog visible={templateVisible} onDismiss={onDismissTemplate}>
            <Dialog.Title style={{textAlign: 'center'}}>Workout</Dialog.Title>
            <Dialog.ScrollArea style={{borderColor: systemTheme.colors.outline}}>
              <ScrollView showsVerticalScrollIndicator={false} style={{marginBottom: 25, marginTop: 5, maxHeight: 400}}>
                {
                  currentTemplate && currentTemplate.map(item => (
                    <View
                      style={[styles.templateItem]}
                      key={item.item_id}
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
                          {item.item_name}
                        </Text>
                        <Text style={{color: systemTheme.colors.primary}}>{item.muscleGroup}</Text>
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
              {
                currentTemplateCustom
                ? <Button onPress={() => onPressDeleteTemplate(currentTemplate[0].template_id)}>Delete Template</Button>
                : null
              }
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
                      buttonStyle={{backgroundColor: 'transparent'}}
                      onPress={() => onPressSelectExercise(item.id, item.name)}
                    />
                    <Icon
                      source={
                        selectedExercises.some(exercise => exercise.exercise_id === item.id) ? 'check-circle-outline' : 'circle-outline'
                      }
                      size={23}
                      color={systemTheme.colors.primary}
                    />
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
        <View>
          <Text style={{color: systemTheme.colors.text, fontSize: 20}}>Start Workout</Text>
        </View>
        <View style={{marginTop: 30, gap: 10, alignItems: 'center'}}>
          <Text style={{color: systemTheme.colors.primary, fontSize: 17}}>Quick Start</Text>
          <CustomPressable
            buttonStyle={{backgroundColor: systemTheme.colors.primary, borderRadius: 5, width: '90%'}}
            textStyle={{fontSize: 20, color: 'white'}}
            text="Start an empty workout"
          />
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.templateContainer}>
          <View style={{gap: 5, flexGrow: 1}}>
            <Text style={{color: systemTheme.colors.text, fontSize: 20}}># My templates</Text>
            <View style={styles.templates}>
              <View
                style={styles.templates}
              >
                <CustomPressable
                  text="+"
                  onPress={() => setNewTemplateVisible(true)}
                  buttonStyle={{
                    backgroundColor: 'transparent', 
                    borderColor: systemTheme.colors.border, 
                    borderWidth: 1,
                    borderRadius: 5,
                    width: 110,
                    height: 100,
                  }}
                  textStyle={{
                    fontSize: 50,
                    color: systemTheme.colors.text
                  }}
                />
                {
                  workoutTemplates && workoutTemplates.map((template) => (
                    template.custom === 'true'
                    ?
                    <CustomPressable
                      onPress={() => onPressSelectTemplate(template.template_id)}
                      key={template.template_id}
                      text={template.template_name}
                      buttonStyle={{
                        backgroundColor: 'transparent', 
                        borderColor: systemTheme.colors.border, 
                        borderWidth: 1,
                        borderRadius: 5,
                        width: 110,
                        height: 100,
                      }}
                      textStyle={{
                        fontSize: 14,
                        color: systemTheme.colors.text
                      }}
                    />
                    : null
                  ))
                }
              </View>
            </View>
          </View>
          <View style={{gap: 5, flexGrow: 1}}>
            <Text style={{color: systemTheme.colors.text, fontSize: 20}}># Example templates</Text>
            <View style={styles.templates}>
              {
                workoutTemplates && workoutTemplates.map((template) => (
                  template.custom === 'false'
                  ?
                  <CustomPressable
                    onPress={() => onPressSelectTemplate(template.template_id)}
                    key={template.template_id}
                    text={template.template_name}
                    buttonStyle={{
                      backgroundColor: 'transparent', 
                      borderColor: systemTheme.colors.border, 
                      borderWidth: 1,
                      borderRadius: 5,
                      width: 110,
                      height: 100,
                    }}
                    textStyle={{
                      fontSize: 14,
                      color: systemTheme.colors.text
                    }}
                  />
                  : null
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
    gap: 15, 
    flexWrap: 'wrap',
  },
  templateItem: {
    padding: 10,
    flexDirection: 'row',
    gap: 10,
  }
})

export default Workout