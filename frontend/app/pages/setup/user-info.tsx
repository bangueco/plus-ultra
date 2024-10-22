import { fitnessLevel } from "@/constants/exercise";
import { useRootNavigation } from "@/hooks/useRootNavigation";
import useSystemTheme from "@/hooks/useSystemTheme"
import asyncStore from "@/lib/asyncStore";
import { StackActions } from "@react-navigation/native";
import { useState } from "react";
import { Alert, View } from "react-native"
import { Button, Text } from "react-native-paper"

import RNPickerSelect from 'react-native-picker-select';

const UserInfo = () => {

  const { colors } = useSystemTheme()

  const [userFitnessLevel, setUserFitnessLevel] = useState<string>()

  console.log(userFitnessLevel)

  const onValueChangeFitnessLevel = (value: string) => {
    return setUserFitnessLevel(value)
  }

  const onPressSubmitInfo = async () => {
    if (userFitnessLevel === undefined) {
      return Alert.alert('Please select your current fitness level')
    }

    await asyncStore.setItem('preferences', {firstTime: false, darkMode: false, fitnessLevel: userFitnessLevel})

    return useRootNavigation.dispatch(StackActions.replace('Tabs'))
  }

  return (
    <View style={{paddingTop: '15%', justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{color: colors.primary, fontSize: 23, fontWeight: 'bold'}}>First Time User Setup</Text>
      <RNPickerSelect
        onValueChange={onValueChangeFitnessLevel}
        items={fitnessLevel}
        placeholder={{label: 'What is your fitness level?'}}
      />
      <View>
        <Button mode="contained" onPress={onPressSubmitInfo}>Submit</Button>
      </View>
    </View>
  )
}

export default UserInfo