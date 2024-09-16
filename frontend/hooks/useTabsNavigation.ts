import { RootNativeStackParamList, TabsParamList } from "@/types/navigation";
import { createNavigationContainerRef } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

const useTabNavigation = createNavigationContainerRef<TabsParamList>();

type TabProps = NativeStackScreenProps<TabsParamList>

export {
  useTabNavigation,
  TabProps
}