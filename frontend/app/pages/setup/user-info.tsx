import { fitnessLevel } from "@/constants/exercise";
import { useRootNavigation } from "@/hooks/useRootNavigation";
import useSystemTheme from "@/hooks/useSystemTheme"
import asyncStore from "@/lib/asyncStore";
import { StackActions } from "@react-navigation/native";
import { useState } from "react";
import { Alert, View } from "react-native"
import { Button, Text, TextInput } from "react-native-paper"

import RNPickerSelect from 'react-native-picker-select';

const UserInfo = () => {

  const { colors } = useSystemTheme()

  const [userFitnessLevel, setUserFitnessLevel] = useState<string>()
  const [userWeight, setUserWeight] = useState<string>()
  const [userHeight, setUserHeight] = useState<string>()

  console.log(userFitnessLevel)

  const onValueChangeFitnessLevel = (value: string) => {
    return setUserFitnessLevel(value)
  }

  const onPressSubmitInfo = async () => {
    if (userFitnessLevel === undefined) {
      return Alert.alert('Please select your current fitness level')
    }

    if (!userWeight || isNaN(Number(userWeight))) {
      return Alert.alert('Please enter a valid weight');
    }

    // Check if userHeight is a valid number
    if (!userHeight || isNaN(Number(userHeight))) {
      return Alert.alert('Please enter a valid height');
    }

    await asyncStore.setItem('preferences', {firstTime: false, darkMode: false, fitnessLevel: userFitnessLevel, weight: userWeight, height: userHeight})

    return useRootNavigation.dispatch(StackActions.replace('Tabs'))
  }

  return (
    <View style={{paddingTop: '15%', alignItems: 'center', height: '100%', padding: 10, position: 'static', gap: 25}}>
      <Text style={{color: colors.primary, fontSize: 23, fontWeight: 'bold'}}>First Time User Setup</Text>
      <RNPickerSelect
        style={{inputAndroid: {color: colors.text}}}
        onValueChange={onValueChangeFitnessLevel}
        items={fitnessLevel}
        placeholder={{label: 'What is your fitness level?'}}
      />
      <TextInput
        mode="outlined"
        label="Weight (kg)"
        style={{width: '100%'}}
        onChangeText={(e) => setUserWeight(e)}
        inputMode="numeric"
      />
      <TextInput
        mode="outlined"
        label="Height (cm)"
        style={{width: '100%'}}
        onChangeText={(e) => setUserHeight(e)}
        inputMode="numeric"
      />
      <View style={{position: 'absolute', bottom: 45}}>
        <Button mode="elevated" maxFontSizeMultiplier={30} onPress={onPressSubmitInfo}>Submit</Button>
      </View>
    </View>
  )
}

export default UserInfo