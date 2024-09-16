import { RootProps, useRootNavigation } from "@/hooks/useRootNavigation";
import useSystemTheme from "@/hooks/useSystemTheme";
import { StackActions } from "@react-navigation/native";
import { useState } from "react";
import { Text, View } from "react-native";
import { StyleSheet } from "react-native";
import { Button, Dialog, IconButton, Portal } from 'react-native-paper';

export default function WorkoutSession({route}: RootProps) {

  const systemTheme = useSystemTheme()

  const [workoutStarted, setWorkoutStarted] = useState<boolean>(false)
  const [cancelWorkoutVisible, setCancelWorkoutVisible] = useState<boolean>(false)

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

  console.log(route.params)

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
        <Text style={{fontSize: 18, color: systemTheme.colors.text}}>00:00</Text>
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
        <Text style={{fontSize: 28, color: systemTheme.colors.text, fontWeight: 'bold'}}>Push Day</Text>
      </View>
      <View style={styles.exercisesContainer}>

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
    minHeight: '60%',
    borderColor: 'red',
    borderWidth: 1,
    paddingBottom: 30
  }
})