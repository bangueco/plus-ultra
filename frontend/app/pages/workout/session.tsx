import { templatesDatabase } from "@/database";
import { RootProps, useRootNavigation } from "@/hooks/useRootNavigation";
import useSystemTheme from "@/hooks/useSystemTheme";
import { ExerciseSets, TemplateItem } from "@/types/templates";
import { StackActions } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import { StyleSheet } from "react-native";
import { Button, Dialog, IconButton, Portal } from 'react-native-paper';
import { DataTable, Checkbox } from 'react-native-paper';
import BouncyCheckbox from 'react-native-bouncy-checkbox'

export default function WorkoutSession({route}: RootProps) {

  const systemTheme = useSystemTheme()

  const [time, setTime] = useState(0);
  const [workoutStarted, setWorkoutStarted] = useState<boolean>(false)
  const [cancelWorkoutVisible, setCancelWorkoutVisible] = useState<boolean>(false)
  const [templateName, setTemplateName] = useState<string>('')
  const [templateExercises, setTemplateExercises] = useState<Array<TemplateItem>>([])
  const [exercisesSets, setExercisesSets] = useState<Array<ExerciseSets>>([])

  const onPressStartWorkout = () => {
    return setWorkoutStarted(true)
  }

  const onPressCancelWorkout = () => {
    setWorkoutStarted(false)

    return onPressGoBack()
  }

  const onPressGoBack = () => {
    if (useRootNavigation.isReady()) {
      return useRootNavigation.dispatch(StackActions.replace('Tabs'))
    }
  }

  const onChangeWeight = async (id: number, value: string) => {
    return await templatesDatabase.db.runAsync(`UPDATE exercise_sets SET weight = ${value} WHERE id=${id}`)
  }

  const onChangeReps = async (id: number, value: string) => {
    return await templatesDatabase.db.runAsync(`UPDATE exercise_sets SET reps = ${value} WHERE id=${id}`)
  }

  console.log(route.params)

  useEffect(() => {
    const nameOfTemplate = templatesDatabase.db.getFirstSync<{template_name: string}>(`SELECT template_name 
      FROM templates WHERE template_id=${route.params.templateId}
    `)

    const exercisesOfTemplate = templatesDatabase.db.getAllSync<TemplateItem>(`SELECT * FROM template_items 
      WHERE template_id=${route.params.templateId}
    `)

    const setsOfExercises = templatesDatabase.db.getAllSync<ExerciseSets>(`SELECT * FROM exercise_sets 
      WHERE template_id=${route.params.templateId}
    `)

    if (nameOfTemplate && exercisesOfTemplate && setsOfExercises) {
      setTemplateName(nameOfTemplate?.template_name)
      setTemplateExercises(exercisesOfTemplate)
      setExercisesSets(setsOfExercises)
    }
  }, [])

  useEffect(() => {
    console.log(time)
    let intervalId: NodeJS.Timeout;
    if (workoutStarted) {
      intervalId = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } 
    return () => clearInterval(intervalId);
  }, [workoutStarted, time]);

  // Hours calculation
  const hours = Math.floor(time / 3600);

  // Minutes calculation
  const minutes = Math.floor((time % 3600) / 60);

  // Seconds calculation
  const seconds = time % 60;

  return (
    <View style={styles.container}>
      <Portal>
        <Dialog visible={cancelWorkoutVisible}>
          <Dialog.Content>
            <Text style={{color: systemTheme.colors.text}}>Do you want to cancel this workout?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={onPressCancelWorkout}>Yes</Button>
            <Button onPress={() => setCancelWorkoutVisible(false)}>No</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <View style={styles.buttonsContainer}>
        <View>
          {
            workoutStarted
            ?
            <IconButton
              icon="clock"
              iconColor={systemTheme.colors.text}
              size={30}
              onPress={() => console.log('Pressed')}
            />
            :
            <IconButton
              icon="arrow-left"
              iconColor={systemTheme.colors.text}
              size={30}
              onPress={onPressGoBack}
            />
          }
        </View>
        <Text style={{fontSize: 18, color: systemTheme.colors.text}}>
          {hours}:{minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")}:
        </Text>
        <View>
          <Button
            disabled={!workoutStarted}
            mode="contained"
          >
            Finish
          </Button>
        </View>
      </View>
      <View style={styles.workoutName}>
        <Text style={{fontSize: 28, color: systemTheme.colors.text, fontWeight: 'bold'}}>{templateName}</Text>
      </View>
      <View style={{height: '60%', borderWidth: 1, padding: 10, borderColor: systemTheme.colors.text, borderRadius: 10}}>
        <ScrollView contentContainerStyle={styles.exercisesContainer} showsVerticalScrollIndicator={false}>
          {
            templateExercises && templateExercises.map((exercise, index) => (
              <View key={index}>
                <Text style={{color: systemTheme.colors.primary, fontSize: 15}}>{index + 1}. {exercise.item_name}</Text>
                <DataTable style={{paddingBottom: 30}}>
                  <DataTable.Header>
                    <DataTable.Title>Sets</DataTable.Title>
                    <DataTable.Title>Weight</DataTable.Title>
                    <DataTable.Title>Reps</DataTable.Title>
                    <DataTable.Title>Status</DataTable.Title>
                  </DataTable.Header>
                  {
                    exercisesSets && exercisesSets.filter(set => set.item_id === exercise.item_id).map((set, index) => (
                      <DataTable.Row key={set.id}>
                        <DataTable.Cell>{index + 1}</DataTable.Cell>
                        <DataTable.Cell>
                          <TextInput
                            keyboardType="numeric"
                            style={{borderBottomWidth: 1, width: '50%', color: systemTheme.colors.text,
                              textAlign: 'center', borderColor: systemTheme.colors.primary
                            }}
                            defaultValue={set.weight.toString()}
                            onChangeText={(e) => onChangeWeight(set.id, e)}
                            editable={workoutStarted}
                            selectTextOnFocus={workoutStarted}
                          />
                        </DataTable.Cell>
                        <DataTable.Cell>
                          <TextInput
                            keyboardType="numeric"
                            style={{borderBottomWidth: 1, width: '50%', color: systemTheme.colors.text,
                              textAlign: 'center', borderColor: systemTheme.colors.primary
                            }}
                            defaultValue={set.reps.toString()}
                            onChangeText={(e) => onChangeReps(set.id, e)}
                            editable={workoutStarted}
                            selectTextOnFocus={workoutStarted}
                          />
                        </DataTable.Cell>
                        <DataTable.Cell>
                          <BouncyCheckbox
                            size={20}
                            fillColor={systemTheme.colors.primary}
                            disabled={!workoutStarted}
                          />
                        </DataTable.Cell>
                      </DataTable.Row>
                    ))
                  }
                </DataTable>
                <Button mode="contained">
                  Add set
                </Button>
              </View>
            ))
          }
        </ScrollView>
      </View>
      <View style={{justifyContent: 'center', padding: 20}}>
        <View>
          {
            workoutStarted
            ?
            <Button
              buttonColor="red"
              textColor="white"
              mode="contained"
              onPress={() => setCancelWorkoutVisible(true)}
            >
              Cancel Workout
            </Button>
            :
            <Button
              mode="contained"
              onPress={onPressStartWorkout}
            >
              Start Workout
            </Button>
          }
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    marginTop: '15%',
    height: '100%',
    padding: 10
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workoutName: {
    paddingTop: 25,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10
  },
  exercisesContainer: {
    padding: 20,
    gap: 20
  }
})