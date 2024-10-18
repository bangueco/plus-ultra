import { StyleSheet, View } from "react-native"
import { ActivityIndicator, Text } from "react-native-paper"

export default function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <Text>Loading please wait...</Text>
      <ActivityIndicator animating={true} />
    </View>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  }
})