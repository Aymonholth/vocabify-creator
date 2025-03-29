
import { FlashcardWord, FlashcardSettings, VoiceOption } from '@/types/flashcard';

// Mock data for development until we integrate with actual APIs
const MOCK_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ru', name: 'Russian' },
  { code: 'pt', name: 'Portuguese' },
];

const MOCK_VOICES: VoiceOption[] = [
  { id: 'en-US-JennyNeural', name: 'Jenny', language: 'en', gender: 'Female' },
  { id: 'en-US-GuyNeural', name: 'Guy', language: 'en', gender: 'Male' },
  { id: 'es-ES-ElviraNeural', name: 'Elvira', language: 'es', gender: 'Female' },
  { id: 'es-ES-AlvaroNeural', name: 'Alvaro', language: 'es', gender: 'Male' },
  { id: 'fr-FR-DeniseNeural', name: 'Denise', language: 'fr', gender: 'Female' },
  { id: 'fr-FR-HenriNeural', name: 'Henri', language: 'fr', gender: 'Male' },
  { id: 'de-DE-KatjaNeural', name: 'Katja', language: 'de', gender: 'Female' },
  { id: 'de-DE-ConradNeural', name: 'Conrad', language: 'de', gender: 'Male' },
];

// In a real app, we'd use actual API calls with error handling and retries
export const apiService = {
  getAvailableLanguages: async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_LANGUAGES;
  },
  
  getAvailableVoices: async (languageCode: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    return MOCK_VOICES.filter(voice => voice.language === languageCode);
  },
  
  processWord: async (
    word: string, 
    settings: FlashcardSettings, 
    onProgress: (update: Partial<FlashcardWord>) => void
  ): Promise<FlashcardWord> => {
    const id = Date.now().toString();
    
    // Create initial flashcard object
    const flashcard: FlashcardWord = {
      id,
      sourceWord: word,
      targetWord: '',
      definition: '',
      exampleSentence1: '',
      exampleSentence2: '',
      audioUrls: {},
      status: 'processing',
    };
    
    // Simulate translation process
    onProgress({ ...flashcard });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate getting translation and definition
    if (settings.translationDirection === 'sourceToTarget') {
      flashcard.targetWord = `${word} (translated to ${settings.targetLanguage})`;
      flashcard.definition = `Definition of "${word}" in ${settings.sourceLanguage}`;
    } else {
      flashcard.sourceWord = `${word} (translated to ${settings.sourceLanguage})`;
      flashcard.targetWord = word;
      flashcard.definition = `Definition of "${word}" in ${settings.sourceLanguage}`;
    }
    
    onProgress({ 
      ...flashcard, 
      targetWord: flashcard.targetWord,
      definition: flashcard.definition 
    });
    
    // Simulate generating example sentences
    await new Promise(resolve => setTimeout(resolve, 1500));
    flashcard.exampleSentence1 = `This is an example sentence using "${word}" with ${settings.toneInstructions || 'neutral'} tone.`;
    onProgress({ ...flashcard, exampleSentence1: flashcard.exampleSentence1 });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    flashcard.exampleSentence2 = `Here is another example sentence with "${word}" showing different usage.`;
    onProgress({ ...flashcard, exampleSentence2: flashcard.exampleSentence2 });
    
    // Simulate generating audio files
    await new Promise(resolve => setTimeout(resolve, 2000));
    flashcard.audioUrls = {
      targetWord: `/api/audio/${id}-target.mp3`, // These would be actual URLs in production
      definition: `/api/audio/${id}-definition.mp3`,
      exampleSentence1: `/api/audio/${id}-example1.mp3`,
      exampleSentence2: `/api/audio/${id}-example2.mp3`,
    };
    
    // Mark as completed
    flashcard.status = 'completed';
    onProgress({ ...flashcard, audioUrls: flashcard.audioUrls, status: 'completed' });
    
    return flashcard;
  },
  
  exportFlashcards: async (words: FlashcardWord[], format: string, settings: FlashcardSettings) => {
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real app, this would call the backend to generate the files
    const downloadUrl = `/api/export?format=${format}&timestamp=${Date.now()}`;
    
    return { url: downloadUrl };
  }
};
