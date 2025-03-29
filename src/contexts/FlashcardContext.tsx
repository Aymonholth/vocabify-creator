import React, { createContext, useContext, useState, useEffect } from 'react';
import { FlashcardWord, FlashcardSettings, VoiceOption, ExportFormat } from '@/types/flashcard';
import { apiService } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';

interface FlashcardContextType {
  words: FlashcardWord[];
  settings: FlashcardSettings;
  isProcessing: boolean;
  availableLanguages: { code: string; name: string }[];
  availableVoices: VoiceOption[];
  
  updateSettings: (settings: Partial<FlashcardSettings>) => void;
  addWords: (newWords: string[]) => Promise<void>;
  clearWords: () => void;
  exportFlashcards: (format: ExportFormat) => Promise<string | null>;
}

const initialSettings: FlashcardSettings = {
  sourceLanguage: 'en',
  targetLanguage: 'es',
  translationDirection: 'sourceToTarget',
  toneInstructions: '',
  selectedVoice: '',
};

const FlashcardContext = createContext<FlashcardContextType | undefined>(undefined);

export const FlashcardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [words, setWords] = useState<FlashcardWord[]>([]);
  const [settings, setSettings] = useState<FlashcardSettings>(initialSettings);
  const [isProcessing, setIsProcessing] = useState(false);
  const [availableLanguages, setAvailableLanguages] = useState<{ code: string; name: string }[]>([]);
  const [availableVoices, setAvailableVoices] = useState<VoiceOption[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const languages = await apiService.getAvailableLanguages();
        setAvailableLanguages(languages);
      } catch (error) {
        console.error('Failed to fetch languages:', error);
        toast({
          title: 'Error',
          description: 'Failed to load available languages. Please try again.',
          variant: 'destructive',
        });
      }
    };
    
    fetchLanguages();
  }, [toast]);

  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const voices = await apiService.getAvailableVoices(settings.targetLanguage);
        setAvailableVoices(voices);
        
        if (voices.length > 0 && !settings.selectedVoice) {
          setSettings(prev => ({
            ...prev,
            selectedVoice: voices[0].id,
          }));
        }
      } catch (error) {
        console.error('Failed to fetch voices:', error);
        toast({
          title: 'Error',
          description: 'Failed to load available voices. Please try again.',
          variant: 'destructive',
        });
      }
    };
    
    if (settings.targetLanguage) {
      fetchVoices();
    }
  }, [settings.targetLanguage, toast]);

  const updateSettings = (newSettings: Partial<FlashcardSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings,
    }));
  };

  const addWords = async (newWords: string[]) => {
    if (newWords.length === 0) return;
    
    setIsProcessing(true);
    
    try {
      const pendingWords = newWords.map(word => ({
        id: `${word}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        sourceWord: word,
        targetWord: '',
        definition: '',
        exampleSentence1: '',
        exampleSentence2: '',
        audioUrls: {},
        status: 'pending' as const,
      }));
      
      setWords(prev => [...prev, ...pendingWords]);
      
      for (const word of pendingWords) {
        try {
          setWords(prev => 
            prev.map(w => 
              w.id === word.id 
                ? { ...w, status: 'processing' as const } 
                : w
            )
          );
          
          await apiService.processWord(
            word.sourceWord, 
            settings, 
            (update) => {
              setWords(prev => 
                prev.map(w => 
                  w.id === word.id 
                    ? { ...w, ...update } 
                    : w
                )
              );
            }
          );
        } catch (error) {
          console.error(`Error processing word ${word.sourceWord}:`, error);
          
          setWords(prev => 
            prev.map(w => 
              w.id === word.id 
                ? { 
                    ...w, 
                    status: 'error' as const, 
                    error: error instanceof Error ? error.message : 'Unknown error' 
                  } 
                : w
            )
          );
          
          toast({
            title: 'Processing Error',
            description: `Failed to process word "${word.sourceWord}". Please try again.`,
            variant: 'destructive',
          });
        }
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const clearWords = () => {
    if (isProcessing) {
      toast({
        title: 'Cannot Clear Words',
        description: 'Please wait until all words have finished processing.',
        variant: 'destructive',
      });
      return;
    }
    
    setWords([]);
  };

  const exportFlashcards = async (format: ExportFormat) => {
    if (words.length === 0) {
      toast({
        title: 'No Flashcards to Export',
        description: 'Please add and process words before exporting.',
        variant: 'destructive',
      });
      return null;
    }
    
    const completedWords = words.filter(word => word.status === 'completed');
    
    if (completedWords.length === 0) {
      toast({
        title: 'No Completed Flashcards',
        description: 'Please wait until at least one word has finished processing.',
        variant: 'destructive',
      });
      return null;
    }
    
    try {
      const { url } = await apiService.exportFlashcards(completedWords, format, settings);
      
      toast({
        title: 'Export Successful',
        description: `Your flashcards have been exported in ${format.toUpperCase()} format.`,
      });
      
      return url;
    } catch (error) {
      console.error('Export error:', error);
      
      toast({
        title: 'Export Failed',
        description: 'An error occurred while exporting your flashcards. Please try again.',
        variant: 'destructive',
      });
      
      return null;
    }
  };

  const value = {
    words,
    settings,
    isProcessing,
    availableLanguages,
    availableVoices,
    updateSettings,
    addWords,
    clearWords,
    exportFlashcards,
  };

  return (
    <FlashcardContext.Provider value={value}>
      {children}
    </FlashcardContext.Provider>
  );
};

export const useFlashcards = () => {
  const context = useContext(FlashcardContext);
  
  if (context === undefined) {
    throw new Error('useFlashcards must be used within a FlashcardProvider');
  }
  
  return context;
};
