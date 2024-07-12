import { Text } from "react-native"

type ErrorMessageType = {
  text: string,
  style?: object
}

const ErrorMessage = ({text, style}: ErrorMessageType) => {
  return (
    <Text style={[{color: 'red'}, style]}>
      {text}
    </Text>
  )
}

export default ErrorMessage