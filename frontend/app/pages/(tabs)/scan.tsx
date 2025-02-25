import { CameraCapturedPicture, CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useRef, useEffect } from 'react';
import { ActivityIndicator, Alert, Pressable, SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Entypo, AntDesign} from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import axios, { AxiosError, AxiosResponse } from 'axios';
import * as ImagePicker from 'expo-image-picker';
import useSystemTheme from '@/hooks/useSystemTheme';
import { getExercisesFromEquipment } from '@/services/equipment.service';
import { EquipmentExercises } from '@/types/equipment';
import { Button, Dialog, Portal, SegmentedButtons } from 'react-native-paper';
import sortByMuscleGroup from '@/hooks/sortByMuscleGroup';
import CustomPressable from '@/components/custom/CustomPressable';
import { ExerciseInfo } from '@/types/exercise';
import { Image } from 'expo-image';
import { equipmentImages } from '@/constants/equipmentImages';
import { SecureStore } from '@/lib/secureStore';
import { User } from '@/types/user';
import exerciseService from '@/services/exercise.service';
import YoutubePlayer from "react-native-youtube-iframe";
import { useUserStore } from '@/store/useUserStore';
import EquipmentDescription from '@/components/EquipmentDescription';

export default function Scan() {
  const camera = useRef<CameraView>(null)
  
  const systemTheme = useSystemTheme()

  const [cameraActive, setCameraActive] = useState<Boolean>(false)
  const [equipmentExercises, setEquipmentExercises] = useState<EquipmentExercises>()
  const [loading, setLoading] = useState<Boolean>(false)
  const [photo, setPhoto] = useState<CameraCapturedPicture | ImagePicker.ImagePickerAsset | null>(null)
  const [cameraReady, setCameraReady] = useState<Boolean>(false)
  const [permission, requestPermission] = useCameraPermissions()

  const { preferences, getUserPreferences } = useUserStore()

  const [currentSelectedExercise, setCurrentSelectedExercise] = useState<{ name: string, instructions: string, video_id: string, difficulty: string}>({ name: '', instructions: '', video_id: '', difficulty: '' });
  const [visible, setVisible] = useState<boolean>(false)

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

  useEffect(() => {
    getUserPreferences().then(() => console.log("Preferences set successfully!"))
  }, [])

  const filterByDifficulty = (exercise: Array<ExerciseInfo>) => {

    if (!preferences) return exercise

    if (preferences.fitnessLevel === 'Beginner') {
      return exercise.filter(diff => diff.difficulty === 'Beginner')
    } else if (preferences.fitnessLevel === 'Intermediate') {
      return exercise.filter(diff => diff.difficulty !== 'Advanced')
    } else {
      return exercise
    }
  }

  const toggleCameraReady = () => {
    setCameraReady(true)
  }

  const capture = async () => {
    if (camera.current && cameraReady) {
      try {
        const pic = await camera.current.takePictureAsync()
        if (pic) setPhoto(pic)
      } catch(error) {
        console.error(error)
      }
    }
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(null);
    }

    if (result && result.assets) {
      setPhoto(result.assets[0])
    }

  }

  const removeImage = () => {
    setPhoto(null)
  }

  const uploadImage = async () => {

    const user = SecureStore.getItem('user')

    if (!user) return

    const parsedUser : User = JSON.parse(user)

    if (photo) {
      const formData = new FormData
      // Attach image to form
      formData.append('image', {
        uri: photo.uri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      } as any); // TODO: Create typechecking here instead of any, in-order to avoid any stupid things that will happen.
      // Remove photo from state
      setPhoto(null)
      // Enable loading indicator
      setLoading(!loading)

      // Upload image to api
      try {
        const response: AxiosResponse<{equipment: string}> = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/equipment/identify`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${parsedUser.accessToken}`
          }
        })

        if (response.status !== 200) {
          Alert.alert(`Error: ${response.status}`)
        } else if (response.data.equipment === 'none') {
          Alert.alert('Error: this equipment cannot be identified.')
        } else {
          const equipmentExercises = await getExercisesFromEquipment(response.data.equipment)
          setEquipmentExercises(equipmentExercises)
        }

      } catch (error) {
        if (error instanceof AxiosError) console.error(error.response?.data.error)
        } finally {
          setLoading(false)
        }
    } else {
      Alert.alert('Photo not found.')
    }
  }

  if (loading || !permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={'large'}/>
      </View>
    )
  }

  if (!permission.granted && permission.canAskAgain) {
    return (
      <View style={styles.container}>
        <Text style={{color: systemTheme.colors.text}}>We need your permission to show the camera</Text>
        <Button mode='contained' onPress={requestPermission}>Grant Permission</Button>
      </View>
    );
  }

  if (!permission.granted && !permission.canAskAgain) {
    return (
      <View style={styles.container}>
        <Text style={{color: systemTheme.colors.text}}>In-order to use the scanner, you need to manually go to settings and enable the permissions.</Text>
        <Button icon="cog" mode='contained' onPress={() => Linking.openSettings()}>Go to settings</Button>
      </View>
    );
  }

  if (equipmentExercises) {
    return (
      <View style={{paddingTop: '15%', justifyContent: 'center', alignItems: 'center', gap: 10, flex: 1, position: 'relative'}}>
        <Pressable style={{position: 'absolute', top: '5%', left: 5}} onPress={() => setEquipmentExercises(undefined)}>
          <Text style={{color: systemTheme.colors.primary, paddingLeft: 10, fontSize: 15}}>Back</Text>
        </Pressable>
        <Text style={{color: systemTheme.colors.text}}>{equipmentExercises.equipment_name.toUpperCase()}</Text>
        <Image
          source={equipmentImages[equipmentExercises.equipment_name] ?? require('@/assets/images/equipments/no-image.jpg')}
          style={{height: 200, width: '100%', resizeMode: 'center'}}
        />
        <EquipmentDescription equipment_name={equipmentExercises.equipment_name} />
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
        <View style={{flex: 1}}>
        <Text style={{color: systemTheme.colors.primary, fontSize: 20, textAlign: 'center'}}>Recommended</Text>
        <SectionList
            extraData={preferences.fitnessLevel}
            sections={sortByMuscleGroup(filterByDifficulty(equipmentExercises.exercises))}
            renderItem={({item}) => (
              <CustomPressable
                key={item.id} 
                text={item.name} 
                textStyle={{fontSize: 17, textAlign: 'center', color: systemTheme.colors.text}} 
                buttonStyle={{padding: 10, borderBottomWidth: 1, borderBottomColor: systemTheme.colors.border, backgroundColor: 'transparent'}}
                onPress={() => onPressSelectExercise(item.id)}
              />
            )}
            renderSectionHeader={({section: {title}}) => (
              <View style={{padding: 5, marginTop: 10}}>
                <Text style={{fontSize: 10, color: systemTheme.colors.text}}># {title.toUpperCase()}</Text>
              </View>
            )}
            stickySectionHeadersEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    )
  }

  if (photo) {
    return (
      <View style={styles.photoContainer}>
        <View style={{alignItems: 'center', flexDirection: 'column', gap: 30, width: '100%'}}>
          <Image style={{height: 350, width: 350}} source={{uri: photo.uri}} />
          <View style={{flexDirection: 'row', gap: 20}}>
            <Pressable style={{flexDirection: 'row', alignItems: 'center', backgroundColor: systemTheme.colors.primary, padding: 5, borderRadius: 10}} onPress={uploadImage}>
              <AntDesign name="check" size={30} color="white" />
              <Text style={{fontSize: 20, color: 'white'}}>Send Photo</Text>
            </Pressable>
            <Pressable style={{flexDirection: 'row', alignItems: 'center', backgroundColor: systemTheme.colors.primary, padding: 5, borderRadius: 10}} onPress={removeImage}>
              <Entypo name='cross' size={30} color='red' />
              <Text style={{fontSize: 20, color: 'white'}}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    )
  }

  // Check if camera mode is active
  if (cameraActive) {
    return (
      <View style={[styles.cameraContainer, {backgroundColor: 'black'}]}>
        <Pressable onPress={() => setCameraActive(!cameraActive)}>
          <Text style={{color: systemTheme.colors.primary, paddingLeft: 10, fontSize: 15}}>Back</Text>
        </Pressable>
        <CameraView style={styles.camera} facing={'back'} onCameraReady={toggleCameraReady} ref={camera} zoom={1}>
        </CameraView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity disabled={!cameraReady} style={styles.button} onPress={capture}>
            <View style={styles.capture}></View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={{color: systemTheme.colors.text, fontSize: 30}}>Identify Gym Equipments</Text>
      <View style={{flexDirection: 'row', gap: 20}}>
        <Pressable style={{backgroundColor: systemTheme.colors.primary, padding: 25, borderRadius: 20}} onPress={() => setCameraActive(!cameraActive)}>
          <Entypo name="camera" size={44} color={systemTheme.colors.text} />
        </Pressable>
        <Pressable style={{backgroundColor: systemTheme.colors.primary, padding: 25, borderRadius: 20}} onPress={pickImage}>
          <Entypo name="image" size={44} color={systemTheme.colors.text} />
        </Pressable>
      </View>
      <View>
        <Text style={{color: systemTheme.colors.text}}>Note: Make sure the image is not blurry.</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    fontSize: 17
  },
  camera: {
    height: 500
  },
  buttonContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    padding: 10
  },
  button: {
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    borderWidth: 2,
    borderRadius: 100,
    padding: 35,
    borderColor: 'white'
  },
  photoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 20
  }
});
