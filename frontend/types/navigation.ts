type RootNativeStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  Tabs: undefined;
  WorkoutSession: {templateId: number}
};

type TabsParamList = {
  Profile: undefined;
  Workout: undefined;
  Scan: undefined;
  History: undefined;
  Exercise: undefined;
}

export {
  RootNativeStackParamList,
  TabsParamList
}