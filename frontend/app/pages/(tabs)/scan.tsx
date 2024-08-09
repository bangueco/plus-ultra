import { CameraCapturedPicture, CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Entypo, AntDesign} from '@expo/vector-icons';
import * as Linking from 'expo-linking';

export default function Scan() {
  const camera = useRef<CameraView>(null)
  
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

  return (
    <View style={styles.container}>
      {
        (photo === null) ? (
        <CameraView style={styles.camera} facing={'back'} onCameraReady={toggleCameraReady} ref={camera} zoom={1}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity disabled={!cameraReady} style={styles.button} onPress={capture}>
              <View style={styles.capture}></View>
            </TouchableOpacity>
          </View>
        </CameraView>
        )
        : (
          <View style={{position: 'relative'}}>
            <Image style={{height: '100%', width: '100%'}} resizeMethod='resize' source={photo} />
            <View style={{position: 'absolute', bottom: 50, width: '100%', justifyContent: 'space-around', alignItems: 'center', flexDirection: 'row'}}>
              <AntDesign name="check" size={40} color="white" />
              <Entypo name='cross' size={50} color='white' onPress={removeImage} />
            </View>
          </View>
        )
      }
    </View>
  );
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
