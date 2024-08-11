import { CameraCapturedPicture, CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { ActivityIndicator, Alert, Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Entypo, AntDesign} from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import axios, { AxiosError } from 'axios';

export default function Scan() {
  const camera = useRef<CameraView>(null)
  
  const [loading, setLoading] = useState<Boolean>(false)
  const [photo, setPhoto] = useState<CameraCapturedPicture | null>(null)
  const [cameraReady, setCameraReady] = useState<boolean>(false)
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
        const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/equipment/identify`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        if (response.status !== 200) {
          Alert.alert(response.data.message)
        }

        if (response.data.equipment === 'none') {
          Alert.alert('Error: this equipment cannot be identified.')
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

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
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

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={'large'}/>
      </View>
    )
  }
  
  if (!photo) {
    return (
      <View style={styles.container}>
        <CameraView style={styles.camera} facing={'back'} onCameraReady={toggleCameraReady} ref={camera} zoom={1}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity disabled={!cameraReady} style={styles.button} onPress={capture}>
              <View style={styles.capture}></View>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    )
  } else {
    return (
      <View style={styles.container}>
        <View style={{position: 'relative'}}>
          <Image style={{height: '100%', width: '100%'}} resizeMethod='resize' source={photo} />
          <View style={{position: 'absolute', bottom: 50, width: '100%', justifyContent: 'space-around', alignItems: 'center', flexDirection: 'row'}}>
            <AntDesign name="check" size={40} color="white" onPress={uploadImage} />
            <Entypo name='cross' size={50} color='white' onPress={removeImage} />
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    fontSize: 17
  },
  camera: {
    flex: 1
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    borderWidth: 2,
    borderRadius: 100,
    padding: 35,
    borderColor: 'white'
  },
});
