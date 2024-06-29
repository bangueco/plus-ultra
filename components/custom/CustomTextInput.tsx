import { useState } from "react"
import { StyleSheet, TextInput, TextInputProps } from "react-native"

const CustomTextInput: React.FC<TextInputProps> = (props) => {
  const [isFocused, setIsFocused] = useState<boolean>(false)
  return (
    <>
      <TextInput
        style={[styles.defaultInputStyle, isFocused && styles.focusedStyle]}
        placeholderTextColor={'gray'}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
    </>
  )
}

const styles = StyleSheet.create({
  defaultInputStyle: {
    backgroundColor: '#FFFF',
    borderRadius: 3,
    padding: 10,
    borderWidth: 1
  },
  focusedStyle: {
    borderColor: 'red',
    borderWidth: 1
  }
})

export default CustomTextInput