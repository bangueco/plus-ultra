import { StyleSheet, TextInput, View } from "react-native"

type SearchProps = {
  inputStyle?: object
}

const SearchInput = ({inputStyle} : SearchProps) => {
  return (
    <View>
      <TextInput
        style={[styles.defaultInputStyle, inputStyle]}
        placeholder="Search"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  defaultInputStyle: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
  }
})

export default SearchInput