import { Dark, Light } from "@/constants/theme";
import { useColorScheme } from "react-native";

const useSystemTheme = () => {
  const currentColorScheme = useColorScheme()

  return (currentColorScheme === 'light') ? Light : Dark
}

export default useSystemTheme