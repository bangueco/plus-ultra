import CustomPressable from "@/components/custom/CustomPressable"
import { exercisesDatabase, templatesDatabase } from "@/database"
import useSystemTheme from "@/hooks/useSystemTheme"
import { TemplateItem, TemplatesType } from "@/types/templates"
import { useEffect, useState } from "react"
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import { Button, Dialog, Portal } from "react-native-paper"
import AntDesign from '@expo/vector-icons/AntDesign';
import { ExerciseInfo } from "@/types/exercise"


const Workout = () => {
  const systemTheme = useSystemTheme()

  const [templateVisible, setTemplateVisible] = useState<boolean>(false)
  const [guideVisible, setGuideVisible] = useState<boolean>(false)
  const [workoutTemplates, setWorkoutTemplates] = useState<Array<TemplatesType>>([])
  const [currentTemplate, setCurrentTemplate] = useState<Array<TemplateItem>>([])
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
      const item = await templatesDatabase.db.getAllAsync<TemplateItem>(`SELECT * FROM template_items WHERE template_id=${id}`)
      setCurrentTemplate(item)
    } catch (error) {
      console.error(error)
    }
  }

  const onPressShowGuide = async (id: number) => {
    try {
      handleGuideShow()
      const exercise = await exercisesDatabase.db.getFirstAsync<ExerciseInfo>(`SELECT * FROM exercise WHERE id=${id}`)

      if (exercise && exercise.instructions) {
        const {name, instructions} = exercise
        console.log(exercise)
        return setCurrentGuide({name, instructions})
      }

      if (exercise && exercise.name) {
        return setCurrentGuide({name: exercise.name})
      }
    } catch (error) {
      console.error(error)
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

  useEffect(() => {
    fetchTemplates().then(() => console.log('Fetched successfully'))
  }, [])

  return (
    <View style={styles.container}>
      <View style={{marginTop: '15%', padding: 5}}>
        <Portal>
          <Dialog visible={templateVisible} onDismiss={() => setTemplateVisible(false)}>
            <Dialog.Title style={{textAlign: 'center'}}>Workout</Dialog.Title>
            <Dialog.ScrollArea style={{borderColor: systemTheme.colors.outline}}>
              <ScrollView style={{marginBottom: 10, marginTop: 10}}>
                {
                  currentTemplate && currentTemplate.map(item => (
                    <View
                      style={[styles.templateItem]}
                      key={item.item_id}
                    >
                      <View>
                        <Text 
                        style={{
                            fontSize: 15, 
                            fontWeight: 'bold', 
                            color: systemTheme.colors.text,
                            width: 210
                          }}
                        numberOfLines={1}
                        >
                          {item.sets}x{item.reps} {item.item_name}
                        </Text>
                        <Text style={{color: systemTheme.colors.primary}}>{item.muscleGroup}</Text>
                      </View>
                      <View>
                        <Pressable onPress={() => onPressShowGuide(item.exercise_id)}>
                          <AntDesign name="question" size={24} color={systemTheme.colors.primary} />
                        </Pressable>
                      </View>
                    </View>
                  ))
                }
              </ScrollView>
            </Dialog.ScrollArea>
            <Dialog.Actions>
              <Button onPress={() => setTemplateVisible(false)}>Start Workout</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <Portal>
          <Dialog visible={guideVisible} onDismiss={handleGuideDismiss}>
            <Dialog.Title style={{textAlign: 'center'}}>{currentGuide?.name}</Dialog.Title>
            <Dialog.Content>
              <Text style={{textAlign: 'justify', color: systemTheme.colors.text}}>{currentGuide?.instructions}</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={handleGuideDismiss}>OK</Button>
            </Dialog.Actions>
          </Dialog>
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
        <View style={styles.templateContainer}>
          <View style={{gap: 5}}>
            <Text style={{color: systemTheme.colors.text, fontSize: 20}}>My templates</Text>
            <View style={styles.templates}>
              <CustomPressable
                text="+"
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
            </View>
          </View>
          <View style={{gap: 5}}>
            <Text style={{color: systemTheme.colors.text, fontSize: 20}}>Example templates</Text>
            <View style={styles.templates}>
              {
                workoutTemplates && workoutTemplates.map((template) => (
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
                      flex: 1
                    }}
                    textStyle={{
                      fontSize: 14,
                      color: systemTheme.colors.text
                    }}
                  />
                ))
              }
            </View>
          </View>
        </View>
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
    marginTop: 20,
    gap: 5
  },
  templates: {
    flexDirection: 'row', 
    gap: 10, 
    flexWrap: 'wrap'
  },
  templateItem: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center'
  }
})

export default Workout