export type RootStackParamList = {
  Login: undefined;
  PhoneInput: undefined;
  OTPVerification: { phoneNumber: string };
  Home: undefined;
  SurveyList: undefined;
  Survey: { surveyId: string; surveyUrl: string };
};

export type NavigationScreens = keyof RootStackParamList;