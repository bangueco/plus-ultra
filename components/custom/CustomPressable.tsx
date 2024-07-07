import { useState } from "react"
import { Pressable, StyleSheet, Text, PressableProps } from "react-native"

type CustomPressableProps = PressableProps & {
  text: string,
  buttonStyle?: object,
  textStyle?: object
}

const CustomPressable = ({ text, buttonStyle, textStyle, ...props }: CustomPressableProps) => {

  const [isPressed, setIsPressed] = useState(false)

  return (
    <Pressable 
      style={[styles.defaultButtonStyle, buttonStyle, isPressed && styles.buttonPressed]}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      {...props}
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