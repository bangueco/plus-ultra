import { CameraCapturedPicture, CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { ActivityIndicator, Alert, Button, FlatList, Image, Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Entypo, AntDesign} from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import axios, { AxiosError, AxiosResponse } from 'axios';
import * as ImagePicker from 'expo-image-picker';
import useSystemTheme from '@/hooks/useSystemTheme';
import { getExercisesFromEquipment } from '@/services/equipment.service';
import { EquipmentExercises } from '@/types/equipment';

export default function Scan() {
  const camera = useRef<CameraView>(null)
  
  const systemTheme = useSystemTheme()

  const [cameraActive, setCameraActive] = useState<Boolean>(false)
  const [equipmentExercises, setEquipmentExercises] = useState<EquipmentExercises | null>(null)
  const [loading, setLoading] = useState<Boolean>(false)
  const [photo, setPhoto] = useState<CameraCapturedPicture | ImagePicker.ImagePickerAsset | null>(null)
  const [cameraReady, setCameraReady] = useState<Boolean>(false)
  const [permission, requestPermission] = useCameraPermissions()

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
            'Content-Type': 'multipart/form-data'
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
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  if (!permission.granted && !permission.canAskAgain) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>In-order to use the scanner, you need to manually go to settings and enable the permissions.</Text>
        <Button onPress={() => Linking.openSettings()} title="Go to settings" />
      </View>
    );
  }

  if (equipmentExercises) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Equipment: {equipmentExercises.equipment_name}</Text>
        <FlatList
          data={equipmentExercises.exercises}
          renderItem={({item}) => <Text key={item.id}>{item.title}</Text>}
        />
      </SafeAreaView>
    )
  }

  if (photo) {
    return (
      <View style={styles.photoContainer}>
        <View style={{alignItems: 'center', flexDirection: 'column', gap: 30, width: '100%'}}>
          <Image style={{height: 350, width: 350}} resizeMethod='resize' source={{uri: photo.uri}} />
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
    gap: 20
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
