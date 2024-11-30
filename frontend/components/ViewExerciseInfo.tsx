import useSystemTheme from "@/hooks/useSystemTheme"
import exerciseService from "@/services/exercise.service"
import { useState } from "react"
import { Alert, Pressable, Text } from "react-native"
import { Button, Dialog, Icon, Portal } from "react-native-paper"
import YoutubePlayer from "react-native-youtube-iframe";

type ViewExerciseInfoProps = {
  id: number
}

const ViewExerciseInfo = ({id}: ViewExerciseInfoProps) => {

  const systemTheme = useSystemTheme()

  const [visible, setVisible] = useState<boolean>(false)
  const [currentSelectedExercise, setCurrentSelectedExercise] = useState<{ name: string, instructions: string, video_id: string | null }>({ name: '', instructions: '', video_id: '' });

  const onPressSelectExercise = async (id: number) => {
    const getExercise = await exerciseService.getExerciseById(id)

    if (getExercise[0]?.custom === 1) return Alert.alert('This exercise is custom, you cannot view it.')

    setCurrentSelectedExercise({
      name: getExercise[0].name,
      instructions: getExercise[0].instructions ?? '',
      video_id: getExercise[0].video_id ?? ''
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
          <Dialog.Content style={{gap: 10}}>
            {
              currentSelectedExercise.video_id && <YoutubePlayer height={150} videoId={currentSelectedExercise.video_id} />
            }
            <Text style={{color: systemTheme.colors.text, textAlign: 'justify'}}>{currentSelectedExercise?.instructions}</Text>
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