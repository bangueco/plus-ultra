import AsyncStorage from '@react-native-async-storage/async-storage';

const setItem = async (key: string, value: any) => {
  const jsonValue = JSON.stringify(value)
  return await AsyncStorage.setItem(key, jsonValue)
}

const removeItem = async (key: string) => {
  return await AsyncStorage.removeItem(key)
}

const getItem = async (key: string) => {
  return await AsyncStorage.getItem(key)
}

export default {
  setItem, removeItem, getItem
}