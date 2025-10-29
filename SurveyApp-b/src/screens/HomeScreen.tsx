import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Button } from '../components';
import { useAuthStore, useSurveyStore } from '../store';

interface HomeScreenProps {
  navigation: any; // TODO: Type properly with navigation prop
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user, clearAuth } = useAuthStore();
  const { surveys } = useSurveyStore();
  const nextSurvey = surveys[0];
  const totalRewards = surveys.reduce((sum, item) => sum + item.reward, 0);

  const handleViewSurveys = () => {
    navigation.navigate('SurveyList');
  };

  const handleLogout = async () => {
    await clearAuth();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.welcome}>Welcome back!</Text>
        {user && (
          <Text style={styles.phoneNumber}>{user.phoneNumber}</Text>
        )}

        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Surveys waiting</Text>
            <Text style={styles.metricValue}>{surveys.length}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Potential rewards</Text>
            <Text style={styles.metricValue}>${totalRewards.toFixed(2)}</Text>
          </View>
        </View>

        {nextSurvey && (
          <View style={styles.featureCard}>
            <Text style={styles.featureBadge}>Featured survey</Text>
            <Text style={styles.featureTitle}>{nextSurvey.title}</Text>
            <Text style={styles.featureDescription}>{nextSurvey.description}</Text>
            <Text style={styles.featureReward}>Earn ${nextSurvey.reward.toFixed(2)}</Text>
            <Button
              title="Start now"
              onPress={() =>
                navigation.navigate('Survey', {
                  surveyId: nextSurvey.id,
                  surveyUrl: nextSurvey.url,
                })
              }
              size="medium"
            />
          </View>
        )}

        <View style={styles.buttonContainer}>
          <Button
            title="View Available Surveys"
            onPress={handleViewSurveys}
            size="large"
          />

          <Button
            title="Logout"
            onPress={handleLogout}
            variant="secondary"
            size="medium"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  phoneNumber: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    gap: 16,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    maxWidth: 320,
    marginBottom: 24,
  },
  metricCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#007AFF',
  },
  featureCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 32,
    gap: 12,
  },
  featureBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8F1FF',
    color: '#0061D6',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 13,
    fontWeight: '600',
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
  },
  featureDescription: {
    fontSize: 15,
    color: '#555',
    lineHeight: 21,
  },
  featureReward: {
    fontSize: 15,
    fontWeight: '600',
    color: '#007AFF',
  },
});
