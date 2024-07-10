import { Text } from "react-native"

type ErrorMessageType = {
  text: string
}

const ErrorMessage = ({text}: ErrorMessageType) => {
  return (
    <Text style={{color: 'red'}}>
      {text}
    </Text>
  )
}

export default ErrorMessage