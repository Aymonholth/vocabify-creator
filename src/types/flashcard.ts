export interface FlashcardWord {
  id: string;
  sourceWord: string;
  targetWord: string;
  definition: string;
  exampleSentence1: string;
  exampleSentence2: string;
  audioUrls: {
    targetWord?: string;
    definition?: string;
    exampleSentence1?: string;
    exampleSentence2?: string;
  };
  status: 'pending' | 'processing' | 'completed' | 'error';
  error?: string;
}

export interface FlashcardSettings {
  sourceLanguage: 'en';
  targetLanguage: string;
  translationDirection: 'sourceToTarget' | 'targetToSource';
  toneInstructions: string;
  selectedVoice: string;
}

export interface VoiceOption {
  id: string;
  name: string;
  language: string;
  gender: string;
}

export type ExportFormat = 'html' | 'csv' | 'anki';
