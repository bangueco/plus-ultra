import { useTheme } from "@react-navigation/native"
import { useState } from "react"
import { StyleSheet, TextInput, TextInputProps } from "react-native"

const CustomTextInput: React.FC<TextInputProps> = (props) => {
  const { colors } = useTheme()
  const [isFocused, setIsFocused] = useState<boolean>(false)

  const focusedStyle: object = {
    borderColor: colors.border,
    borderWidth: 2
  }

  return (
    <>
      <TextInput
        style={[styles.defaultInputStyle, {color: colors.text} ,isFocused && focusedStyle]}
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
    borderWidth: 2,
    borderColor: 'gray',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 3,
    fontSize: 16
  }
})

export default CustomTextInput