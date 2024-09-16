import { RootNativeStackParamList } from "@/types/navigation";
import { createNavigationContainerRef } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

const useRootNavigation = createNavigationContainerRef<RootNativeStackParamList>();

type RootProps = NativeStackScreenProps<RootNativeStackParamList, 'WorkoutSession'>

export {
  useRootNavigation,
  RootProps
}