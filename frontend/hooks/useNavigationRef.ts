import { RootNativeStackParamList, TabsParamList } from '@/types/navigation';
import { createNavigationContainerRef } from '@react-navigation/native';

const rootNavigationRef = createNavigationContainerRef<RootNativeStackParamList>();

const tabNavigationRef = createNavigationContainerRef<TabsParamList>();

export {
  rootNavigationRef,
  tabNavigationRef
}