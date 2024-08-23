import { ReactNavigationDark, ReactNavigationLight, NativePaperDark, NativePaperLight } from "@/constants/theme";
import { useColorScheme } from "react-native";

const useSystemTheme = () => {
  const currentColorScheme = useColorScheme()

  const CombinedDefaultTheme = {
    ...NativePaperLight,
    ...ReactNavigationLight,
    colors: {
      ...NativePaperLight.colors,
      ...ReactNavigationLight.colors,
    },
  };
  const CombinedDarkTheme = {
    ...NativePaperDark,
    ...ReactNavigationDark,
    colors: {
      ...NativePaperDark.colors,
      ...ReactNavigationDark.colors,
    },
  };

  return (currentColorScheme === 'light') ? CombinedDefaultTheme : CombinedDarkTheme
}

export default useSystemTheme