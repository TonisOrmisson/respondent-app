import { useSurveyStore } from '../../store/surveyStore';
import { Survey } from '../../types';

describe('surveyStore', () => {
  beforeEach(() => {
    // Reset store state
    useSurveyStore.setState({
      surveys: [],
      currentSurvey: null,
      isLoading: false,
      error: null,
    });
  });

  describe('setSurveys', () => {
    it('should set surveys and clear error', () => {
      const mockSurveys: Survey[] = [
        {
          id: '1',
          title: 'Test Survey',
          description: 'Test Description',
          reward: 5.00,
          url: 'https://example.com/survey/1',
          status: 'available',
        },
      ];

      // Set initial error
      useSurveyStore.setState({ error: 'Previous error' });

      useSurveyStore.getState().setSurveys(mockSurveys);

      const state = useSurveyStore.getState();
      expect(state.surveys).toEqual(mockSurveys);
      expect(state.error).toBeNull();
    });
  });

  describe('setCurrentSurvey', () => {
    it('should set current survey', () => {
      const mockSurvey: Survey = {
        id: '1',
        title: 'Test Survey',
        description: 'Test Description',
        reward: 5.00,
        url: 'https://example.com/survey/1',
        status: 'available',
      };

      useSurveyStore.getState().setCurrentSurvey(mockSurvey);

      const state = useSurveyStore.getState();
      expect(state.currentSurvey).toEqual(mockSurvey);
    });

    it('should clear current survey when null is passed', () => {
      const mockSurvey: Survey = {
        id: '1',
        title: 'Test Survey',
        description: 'Test Description',
        reward: 5.00,
        url: 'https://example.com/survey/1',
        status: 'available',
      };

      // Set initial survey
      useSurveyStore.setState({ currentSurvey: mockSurvey });

      useSurveyStore.getState().setCurrentSurvey(null);

      const state = useSurveyStore.getState();
      expect(state.currentSurvey).toBeNull();
    });
  });

  describe('setLoading', () => {
    it('should update loading state', () => {
      useSurveyStore.getState().setLoading(true);
      expect(useSurveyStore.getState().isLoading).toBe(true);

      useSurveyStore.getState().setLoading(false);
      expect(useSurveyStore.getState().isLoading).toBe(false);
    });
  });

  describe('setError', () => {
    it('should set error message', () => {
      const errorMessage = 'Test error message';
      useSurveyStore.getState().setError(errorMessage);

      const state = useSurveyStore.getState();
      expect(state.error).toBe(errorMessage);
    });

    it('should clear error when null is passed', () => {
      // Set initial error
      useSurveyStore.setState({ error: 'Previous error' });

      useSurveyStore.getState().setError(null);

      const state = useSurveyStore.getState();
      expect(state.error).toBeNull();
    });
  });

  describe('clearError', () => {
    it('should clear error', () => {
      // Set initial error
      useSurveyStore.setState({ error: 'Test error' });

      useSurveyStore.getState().clearError();

      const state = useSurveyStore.getState();
      expect(state.error).toBeNull();
    });
  });
});