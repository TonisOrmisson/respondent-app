import React, { useMemo } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Linking, Alert, ScrollView } from 'react-native';
import type { RouteProp } from '@react-navigation/native';
import { Button } from '../components';
import { useSurveyStore } from '../store';
import { DEMO_SURVEYS } from '../utils/demoSurveyData';
import { Survey, RootStackParamList } from '../types';

interface SurveyDetailScreenProps {
  navigation: any;
  route: RouteProp<RootStackParamList, 'Survey'>;
}

export const SurveyDetailScreen: React.FC<SurveyDetailScreenProps> = ({ navigation, route }) => {
  const { surveyId, surveyUrl } = route.params;
  const { surveys } = useSurveyStore();

  const survey: Survey | undefined = useMemo(() => {
    return surveys.find((item) => item.id === surveyId) || DEMO_SURVEYS.find((item) => item.id === surveyId);
  }, [surveys, surveyId]);

  const handleLaunchSurvey = async () => {
    try {
      const supported = await Linking.canOpenURL(surveyUrl);
      if (supported) {
        await Linking.openURL(surveyUrl);
      } else {
        Alert.alert('Unable to open link', 'Try copying the link into a browser: ' + surveyUrl);
      }
    } catch (error) {
      Alert.alert('Something went wrong', 'Please try again later.');
    }
  };

  if (!survey) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Survey not found</Text>
          <Text style={styles.subtitle}>Return to the survey list to refresh the demo data.</Text>
          <Button title="Back to surveys" onPress={() => navigation.goBack()} size="medium" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.badge}>Reward · ${survey.reward.toFixed(2)}</Text>
          <Text style={styles.title}>{survey.title}</Text>
          <Text style={styles.subtitle}>{survey.description}</Text>

          <View style={styles.metaSection}>
            <Text style={styles.metaHeading}>What to expect</Text>
            <Text style={styles.metaText}>• 8-10 minutes to complete
• Designed for mobile
• Earn rewards instantly once submitted</Text>
          </View>

          <Button title="Start survey" onPress={handleLaunchSurvey} size="large" />

          <Text style={styles.helperText}>
            This sample opens a browser link to simulate the hand-off to your survey platform. Swap this with an in-app webview or native survey experience when integrating the real API.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 24,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8F1FF',
    color: '#0061D6',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
    marginBottom: 24,
  },
  metaSection: {
    backgroundColor: '#F6F7FB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  metaHeading: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2f2f2f',
    marginBottom: 8,
  },
  metaText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#444',
  },
  helperText: {
    marginTop: 20,
    fontSize: 14,
    color: '#777',
    lineHeight: 20,
  },
});
