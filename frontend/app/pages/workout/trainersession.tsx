import { TrainerSessionProps, useRootNavigation } from "@/hooks/useRootNavigation";
import useSystemTheme from "@/hooks/useSystemTheme";
import { ExerciseSets, TemplateItem } from "@/types/templates";
import { useEffect, useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import { StyleSheet } from "react-native";
import { Button, Dialog, IconButton, Portal, TextInput as TextInputRnp } from 'react-native-paper';
import { DataTable } from 'react-native-paper';
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";

import templateService from "@/services/template.service";
import exerciseSetService from "@/services/exerciseSet.service";
import { useTabNavigation } from "@/hooks/useTabsNavigation";
import historyExerciseService from "@/services/historyExercise.service";
import { useHistoryStore } from "@/store/useHistoryStore";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import SuggestionGuide from "@/components/SuggestionGuide";

export default function TrainerSession({route}: TrainerSessionProps) {

  const systemTheme = useSystemTheme()
  const { addHistory, addHistoryExercise } = useHistoryStore()

  const [remainingTimeVisible, setRemainingTimeVisible] = useState<boolean>(false)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [restTimer, setRestTimer] = useState<string>('60')
  const [restTimerVisible, setRestTimerVisible] = useState<boolean>(false)
  const [time, setTime] = useState(0);
  const [manualHours, setManualHours] = useState<string>('0')
  const [manualMinutes, setManualMinutes] = useState<string>('0')
  const [manualSeconds, setManualSeconds] = useState<string>('0')
  const [manualWorkoutStarted, setManualWorkoutStarted] = useState<boolean>(false)
  const [workoutStarted, setWorkoutStarted] = useState<boolean>(false)
  const [cancelWorkoutVisible, setCancelWorkoutVisible] = useState<boolean>(false)
  const [templateName, setTemplateName] = useState<string>('')
  const [templateExercises, setTemplateExercises] = useState<Array<TemplateItem>>([])
  const [exercisesSets, setExercisesSets] = useState<Array<ExerciseSets>>([])
  const [performedWorkout, setPerformedWorkout] = useState<Array<{
    set_id: number,
    template_item_id: number
    template_id: number,
    reps: number,
    weight: number,
    exercise_name: string
  }>>([])

  const fetchData = async () => {
    const nameOfTemplate = await templateService.findTrainerTemplateById(route.params.templateId)

    const exercisesOfTemplate = await templateService.findTrainerTemplateItemById(route.params.templateId)

    const setsOfExercises = await exerciseSetService.getAllExerciseSetsByTemplateId(route.params.templateId)

    if (nameOfTemplate && exercisesOfTemplate && setsOfExercises) {
      setTemplateName(nameOfTemplate.data.template_name)
      setTemplateExercises(exercisesOfTemplate.data)
      setExercisesSets(setsOfExercises)
    }
  }

  const onPressStartWorkout = () => {
    return setWorkoutStarted(true)
  }

  const onPressStartManualWorkout = () => {
    return setManualWorkoutStarted(true)
  }

  const onPressFinishWorkout = async () => {
    if (!useTabNavigation.isReady()) return

    useTabNavigation.navigate('History')

    if (workoutStarted) {
      setWorkoutStarted(false)

      const history = await addHistory(templateName, hours, minutes, seconds)

      if (!history) return null;

      await Promise.allSettled(
        performedWorkout.map(async (workout) => {
          await historyExerciseService.createHistoryExercise(
            history.lastInsertRowId,
            workout.template_item_id,
            workout.template_id,
            workout.reps,
            workout.weight,
            workout.exercise_name
          )
          addHistoryExercise(history.lastInsertRowId, workout.template_item_id, workout.template_id, workout.reps, workout.weight, workout.exercise_name)
        })
      )

      return onPressGoBack()
    }

    if (manualWorkoutStarted) {
      setManualWorkoutStarted(false)

      const history = await addHistory(templateName, Number(manualHours), Number(manualMinutes), Number(manualSeconds))

      if (!history) return null;

      await Promise.allSettled(
        performedWorkout.map(async (workout) => {
          await historyExerciseService.createHistoryExercise(
            history.lastInsertRowId,
            workout.template_item_id,
            workout.template_id,
            workout.reps,
            workout.weight,
            workout.exercise_name
          )
          addHistoryExercise(history.lastInsertRowId, workout.template_item_id, workout.template_id, workout.reps, workout.weight, workout.exercise_name)
        })
      )

      return onPressGoBack()
    }

  }

  const onPressCheckSet = async (setId: number, templateItemId: number, templateId: number, exerciseName: string) => {
    if (performedWorkout.some(workout => workout.set_id === setId)) {
      const filter = performedWorkout.filter(item => item.set_id !== setId)
      return setPerformedWorkout(filter)
    }

    if (!isPlaying && !remainingTimeVisible && !manualWorkoutStarted) {
      setIsPlaying(true)
      setRemainingTimeVisible(true)
    }

    const exerciseSetInfo = await exerciseSetService.getExerciseSetById(setId)

    return setPerformedWorkout([...performedWorkout, {
      set_id: setId,
      template_item_id: templateItemId,
      template_id: templateId,
      reps: exerciseSetInfo[0].reps,
      weight: exerciseSetInfo[0].weight,
      exercise_name: exerciseName
    }])
  }

  const onPressCancelWorkout = () => {workoutStarted
    setWorkoutStarted(false)

    return onPressGoBack()
  }

  const onPressGoBack = () => {
    if (useRootNavigation.isReady()) {
      return useRootNavigation.goBack()
    }
  }

  const onPressAddSet = async (template_id: number, item_id: number) => {
    const newSet = await exerciseSetService.addExerciseSet(0, 0, item_id, template_id)

    return setExercisesSets([...exercisesSets, {
      exercise_set_id: newSet.lastInsertRowId,
      template_item_id: item_id,
      template_id,
      reps: 0,
      weight: 0
    }])
  }

  const onPressDeleteSet = async (id: number) => {
    await exerciseSetService.deleteExerciseSetByExerciseId(id)

    return setExercisesSets(exercisesSets.filter(set => set.exercise_set_id !== id))
  }

  const onChangeWeight = async (id: number, value: string) => {
    return await exerciseSetService.updateWeight(id, parseInt(value))
  }

  const onChangeReps = async (id: number, value: string) => {
    return await exerciseSetService.updateReps(id, parseInt(value))
  }

  useEffect(() => {
    fetchData().then(() => console.log('Data fetched'))
  }, [])

  useEffect(() => {
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
        <Dialog visible={restTimerVisible}>
          <Dialog.Content>
            <TextInputRnp
              mode="outlined"
              label="Rest timer (seconds)"
              left={<TextInputRnp.Icon icon="clock" />}
              onChangeText={setRestTimer}
              value={restTimer}
              inputMode="numeric"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setRestTimerVisible(false)}>OK</Button>
          </Dialog.Actions>
        </Dialog>
        <Dialog visible={remainingTimeVisible} style={{justifyContent: 'center', alignItems: 'center'}}>
          <Dialog.Title>
            <Text>Remaining rest time</Text>
          </Dialog.Title>
          <Dialog.Content>
            <CountdownCircleTimer
              isPlaying={isPlaying}
              duration={Number(restTimer)}
              colors={['#28A745', '#FFC107', '#DC3545', '#DC3545']}
              colorsTime={[7, 5, 2, 0]}
              onComplete={() => {
                setRemainingTimeVisible(false)
                setIsPlaying(false)
              }}
            >
              {({ remainingTime, color }) => (
                <Text style={{ color, fontSize: 25 }}>
                  {remainingTime}s
                </Text>
              )}
            </CountdownCircleTimer>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => {
              setRemainingTimeVisible(false)
              setIsPlaying(false)
            }}>Skip Rest</Button>
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
              onPress={() => setRestTimerVisible(true)}
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
        {
          !manualWorkoutStarted && (
            <Text style={{fontSize: 18, color: systemTheme.colors.text}}>
              {hours}:{minutes.toString().padStart(2, "0")}:
              {seconds.toString().padStart(2, "0")}
            </Text>
          )
        }
        {
          manualWorkoutStarted &&
          <>
            <TextInput
              onChangeText={(e) => setManualHours(e.padStart(2, '0'))}
              defaultValue={String(manualHours).padStart(2, '0')}
              keyboardType="numeric"
              maxLength={2}
              placeholder="HH"
            />
            <Text>:</Text>
            <TextInput
              onChangeText={(e) => setManualMinutes(e.padStart(2, '0'))}
              defaultValue={String(manualMinutes).padStart(2, '0')}
              keyboardType="numeric"
              maxLength={2}
              placeholder="MM"
            />
            <Text>:</Text>
            <TextInput
              onChangeText={(e) => setManualSeconds(e.padStart(2, '0'))}
              defaultValue={String(manualSeconds).padStart(2, '0')}
              keyboardType="numeric"
              maxLength={2}
              placeholder="SS"
            />
          </>
        }
        <View>
          <Button
            disabled={!workoutStarted && !manualWorkoutStarted}
            mode="contained"
            onPress={onPressFinishWorkout}
          >
            Finish
          </Button>
        </View>
      </View>
      <View>
        <SuggestionGuide />
      </View>
      <View style={styles.workoutName}>
        <Text style={{fontSize: 28, color: systemTheme.colors.text, fontWeight: 'bold'}}>{templateName}</Text>
      </View>
      <View style={{height: '60%', borderWidth: 1, padding: 10, borderColor: systemTheme.colors.text, borderRadius: 10}}>
        <ScrollView contentContainerStyle={styles.exercisesContainer} showsVerticalScrollIndicator={false}>
        {
          templateExercises && templateExercises.map((exercise, index) => (
              <View key={index}>
                <Text style={{color: systemTheme.colors.primary, fontSize: 15}}>{index + 1}. {exercise.template_item_name}</Text>
                <DataTable style={{paddingBottom: 30}}>
                  <DataTable.Header>
                    <DataTable.Title>Sets</DataTable.Title>
                    <DataTable.Title>Weight</DataTable.Title>
                    <DataTable.Title>Reps</DataTable.Title>
                    <DataTable.Title>Status</DataTable.Title>
                  </DataTable.Header>
                  <GestureHandlerRootView>
                    {
                      exercisesSets && exercisesSets.filter(set => set.template_item_id === exercise.template_item_id).map((set, index) => (
                        <Swipeable
                          key={set.exercise_set_id}
                          renderRightActions={() => (
                            <View>
                              <IconButton
                                mode="contained"
                                icon="trash-can"
                                onPress={() => onPressDeleteSet(set.exercise_set_id)}
                                size={15}
                                iconColor="red"
                              />
                            </View>
                          )}
                          enabled={workoutStarted}
                        >
                          <DataTable.Row key={set.exercise_set_id}>
                            <DataTable.Cell>{index + 1}</DataTable.Cell>
                            <DataTable.Cell>
                              <TextInput
                                keyboardType="numeric"
                                style={{borderBottomWidth: 1, width: '50%', color: systemTheme.colors.text,
                                  textAlign: 'center', borderColor: systemTheme.colors.primary
                                }}
                                defaultValue={set.weight.toString()}
                                onChangeText={(e) => onChangeWeight(set.exercise_set_id, e)}
                                editable={manualWorkoutStarted || workoutStarted && !performedWorkout.some(workout => workout.set_id === set.exercise_set_id)}
                                selectTextOnFocus={workoutStarted && !performedWorkout.some(workout => workout.set_id === set.exercise_set_id)}
                              />
                            </DataTable.Cell>
                            <DataTable.Cell>
                              <TextInput
                                keyboardType="numeric"
                                style={{borderBottomWidth: 1, width: '50%', color: systemTheme.colors.text,
                                  textAlign: 'center', borderColor: systemTheme.colors.primary
                                }}
                                defaultValue={set.reps.toString()}
                                onChangeText={(e) => onChangeReps(set.exercise_set_id, e)}
                                editable={manualWorkoutStarted || workoutStarted && !performedWorkout.some(workout => workout.set_id === set.exercise_set_id)}
                                selectTextOnFocus={workoutStarted && !performedWorkout.some(workout => workout.set_id === set.exercise_set_id)}
                              />
                            </DataTable.Cell>
                            <DataTable.Cell>
                              <IconButton
                                disabled={!workoutStarted && !manualWorkoutStarted}
                                icon={
                                  performedWorkout.some(workout => workout.set_id === set.exercise_set_id)
                                  ? "checkbox-marked-circle"
                                  : "checkbox-blank-circle-outline"
                                }
                                size={18}
                                onPress={() => onPressCheckSet(set.exercise_set_id, set.template_item_id, set.template_id, exercise.template_item_name)}
                                iconColor={systemTheme.colors.primary}
                              />
                            </DataTable.Cell>
                          </DataTable.Row>
                        </Swipeable>
                      ))
                    }
                  </GestureHandlerRootView>
                </DataTable>
                <Button disabled={!workoutStarted && !manualWorkoutStarted} mode="contained" onPress={() => onPressAddSet(exercise.template_id, exercise.template_item_id)}>
                  Add set
                </Button>
              </View>
            ))
          }
        </ScrollView>
      </View>
      <View style={{justifyContent: 'center', paddingTop: 10}}>
        <View style={{gap: 5}}>
            {
              workoutStarted || manualWorkoutStarted
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
              <>
                <Button
                  mode="contained"
                  onPress={onPressStartWorkout}
                >
                  Start Workout
                </Button>
                <Button
                mode="contained"
                onPress={onPressStartManualWorkout}
                >
                  Manual entry
                </Button>
              </>
            }
          </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    marginTop: '10%',
    height: '100%',
    padding: 10
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workoutName: {
    paddingTop: 10,
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