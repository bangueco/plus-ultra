import { useState } from "react"
import { Pressable, StyleSheet, Text } from "react-native"

type PressableProps = {
  text: any,
  buttonStyle?: object,
  textStyle?: object
}

const CustomPressable = ({ text, buttonStyle, textStyle }: PressableProps) => {

  const [isPressed, setIsPressed] = useState(false)

  return (
    <Pressable 
      style={[styles.defaultButtonStyle, buttonStyle, isPressed && styles.buttonPressed]}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
    >
      <Text style={[styles.defaultTextStyle, textStyle]}>
        {text}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  defaultButtonStyle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    backgroundColor: 'red'
  },
  defaultTextStyle: {
    fontSize: 10
  },
  buttonPressed: {
    opacity: 0.7
  }
})

export default CustomPressable