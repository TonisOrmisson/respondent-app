import { apiService } from './api';
import { Survey } from '../types';

export class SurveyService {
  async getSurveys(): Promise<Survey[]> {
    return await apiService.get<Survey[]>('/surveys');
  }

  async getSurvey(id: string): Promise<Survey> {
    return await apiService.get<Survey>(`/surveys/${id}`);
  }

  async markSurveyCompleted(surveyId: string): Promise<void> {
    await apiService.post(`/surveys/${surveyId}/complete`);
  }

  async registerForNotifications(deviceToken: string): Promise<void> {
    await apiService.post('/notifications/register', { deviceToken });
  }
}

export const surveyService = new SurveyService();