import { Course } from './types';

export const COURSES: Course[] = [
  {
    id: 'Spanish',
    name: 'Spanish',
    flag: '🇪🇸',
    units: [
      {
        id: 'es-1',
        title: 'Unit 1: Basics',
        description: 'Order in a cafe, introduce yourself',
        isLocked: false,
        lessons: [
          {
            id: 'l1',
            title: 'Greetings',
            type: 'translation',
            question: 'How do you say "Hello" in Spanish?',
            correctAnswer: 'Hola',
            context: 'Common greeting used at any time of day.',
          },
          {
            id: 'l2',
            title: 'Cafe',
            type: 'multiple-choice',
            question: 'Which of these means "Coffee"?',
            options: ['Agua', 'Café', 'Leche', 'Té'],
            correctAnswer: 'Café',
          }
        ]
      },
      {
        id: 'es-2',
        title: 'Unit 2: Family',
        description: 'Talk about your family members',
        isLocked: true,
        lessons: []
      }
    ]
  },
  {
    id: 'French',
    name: 'French',
    flag: '🇫🇷',
    units: [
      {
        id: 'fr-1',
        title: 'Unit 1: Greetings',
        description: 'Basic greetings and introductions',
        isLocked: false,
        lessons: [
          {
            id: 'f1',
            title: 'Hello',
            type: 'translation',
            question: 'How do you say "Good morning" in French?',
            correctAnswer: 'Bonjour',
          }
        ]
      }
    ]
  }
];
