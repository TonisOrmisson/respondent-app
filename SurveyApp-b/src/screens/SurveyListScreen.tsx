import React, { useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { LoadingSpinner, ErrorMessage } from '../components';
import { useSurveyStore } from '../store';
import { Survey } from '../types';
import { DEMO_SURVEYS } from '../utils/demoSurveyData';

interface SurveyListScreenProps {
  navigation: any; // TODO: Type properly with navigation prop
}

export const SurveyListScreen: React.FC<SurveyListScreenProps> = ({ navigation }) => {
  const { surveys, isLoading, error, setSurveys, setLoading, setError } = useSurveyStore();

  const loadSurveys = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setSurveys(DEMO_SURVEYS);
    } catch (err) {
      setError('Failed to load surveys. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [setError, setLoading, setSurveys]);

  useEffect(() => {
    loadSurveys();
  }, [loadSurveys]);

  const handleSurveyPress = (survey: Survey) => {
    navigation.navigate('Survey', {
      surveyId: survey.id,
      surveyUrl: survey.url,
    });
  };

  const renderSurvey = ({ item }: { item: Survey }) => (
    <TouchableOpacity
      style={styles.surveyItem}
      onPress={() => handleSurveyPress(item)}
    >
      <Text style={styles.surveyTitle}>{item.title}</Text>
      <Text style={styles.surveyDescription}>{item.description}</Text>
      <Text style={styles.surveyReward}>Reward: ${item.reward.toFixed(2)}</Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return <LoadingSpinner text="Loading surveys..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadSurveys} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Available Surveys</Text>

      {surveys.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No surveys available at the moment</Text>
        </View>
      ) : (
        <FlatList
          data={surveys}
          renderItem={renderSurvey}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    paddingVertical: 20,
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  surveyItem: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  surveyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  surveyDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  surveyReward: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
