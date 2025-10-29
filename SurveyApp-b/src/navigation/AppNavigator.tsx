import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuthStore } from '../store';
import { RootStackParamList } from '../types';
import {
  LoginScreen,
  PhoneInputScreen,
  OTPVerificationScreen,
  HomeScreen,
  SurveyListScreen,
  SurveyDetailScreen,
} from '../screens';
import { LoadingSpinner } from '../components';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading, loadAuthFromStorage } = useAuthStore();

  useEffect(() => {
    loadAuthFromStorage();
  }, [loadAuthFromStorage]);

  if (isLoading) {
    return <LoadingSpinner text="Initializing app..." />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {isAuthenticated ? (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: 'Survey App' }}
            />
            <Stack.Screen
              name="SurveyList"
              component={SurveyListScreen}
              options={{ title: 'Surveys' }}
            />
            <Stack.Screen
              name="Survey"
              component={SurveyDetailScreen}
              options={{ title: 'Survey details' }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="PhoneInput"
              component={PhoneInputScreen}
              options={{ title: 'Verify your phone' }}
            />
            <Stack.Screen
              name="OTPVerification"
              component={OTPVerificationScreen}
              options={{ title: 'Enter verification code' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
