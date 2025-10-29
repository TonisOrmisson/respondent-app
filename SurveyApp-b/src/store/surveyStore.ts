import { create } from 'zustand';
import { Survey } from '../types';

interface SurveyState {
  surveys: Survey[];
  currentSurvey: Survey | null;
  isLoading: boolean;
  error: string | null;
  setSurveys: (surveys: Survey[]) => void;
  setCurrentSurvey: (survey: Survey | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useSurveyStore = create<SurveyState>((set) => ({
  surveys: [],
  currentSurvey: null,
  isLoading: false,
  error: null,

  setSurveys: (surveys: Survey[]) => {
    set({ surveys, error: null });
  },

  setCurrentSurvey: (survey: Survey | null) => {
    set({ currentSurvey: survey });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },
}));