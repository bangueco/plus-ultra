import useSystemTheme from "@/hooks/useSystemTheme"
import exerciseService from "@/services/exercise.service"
import { useState } from "react"
import { Alert, Pressable, Text, View } from "react-native"
import { Button, Dialog, Icon, Portal } from "react-native-paper"
import YoutubePlayer from "react-native-youtube-iframe";

type ViewExerciseInfoProps = {
  id: number
}

const ViewExerciseInfo = ({id}: ViewExerciseInfoProps) => {

  const systemTheme = useSystemTheme()

  const [visible, setVisible] = useState<boolean>(false)
  const [currentSelectedExercise, setCurrentSelectedExercise] = useState<{ name: string, instructions: string, video_id: string | null, difficulty: string }>({ name: '', instructions: '', video_id: '', difficulty: '' });

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
    <Pressable
      onPress={() => onPressSelectExercise(id)}
    >
      <Icon
        source='information'
        size={23}
        color={systemTheme.colors.primary}
      />
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
          <Dialog.Content style={{gap: 10}}>
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
    </Pressable>
  )
}

export default ViewExerciseInfo