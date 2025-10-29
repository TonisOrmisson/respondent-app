import { Survey } from '../types';

export const DEMO_SURVEYS: Survey[] = [
  {
    id: 'survey-001',
    title: 'Customer Satisfaction Deep Dive',
    description: 'Tell us about your latest shopping experience so we can keep improving.',
    reward: 7.5,
    url: 'https://example.com/surveys/customer-satisfaction',
    status: 'available',
  },
  {
    id: 'survey-002',
    title: 'New Feature Concept Test',
    description: 'Preview upcoming app concepts and vote on what should ship next.',
    reward: 12,
    url: 'https://example.com/surveys/feature-concept',
    status: 'available',
  },
  {
    id: 'survey-003',
    title: 'Weekly Lifestyle Pulse',
    description: 'Quick five-minute pulse about your daily routines and media habits.',
    reward: 4,
    url: 'https://example.com/surveys/lifestyle-pulse',
    status: 'available',
  },
];
