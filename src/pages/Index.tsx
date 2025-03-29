import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { FlashcardProvider, useFlashcards } from '@/contexts/FlashcardContext';
import LanguageSelector from '@/components/LanguageSelector';
import VoiceSelector from '@/components/VoiceSelector';
import DirectionToggle from '@/components/DirectionToggle';
import ToneInstructionsInput from '@/components/ToneInstructionsInput';
import WordInput from '@/components/WordInput';
import FlashcardList from '@/components/FlashcardList';
import ExportOptions from '@/components/ExportOptions';

const FlashcardApp: React.FC = () => {
  const { clearWords, words, isProcessing } = useFlashcards();
  
  return (
    <div className="container mx-auto py-8 space-y-8">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold text-primary">Vocabify Creator</h1>
        <p className="text-xl text-muted-foreground mt-2">
          Create AI-powered language flashcards with translations, examples, and audio
        </p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Settings Panel */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Language Settings</CardTitle>
              <CardDescription>
                Configure your target language
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-sm text-muted-foreground">
                Source Language: English (fixed)
              </div>
              
              <LanguageSelector />
              
              <Separator />
              
              <DirectionToggle />
              
              <Separator />
              
              <VoiceSelector />
              
              <Separator />
              
              <ToneInstructionsInput />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Export Options</CardTitle>
              <CardDescription>
                Save your flashcards in different formats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExportOptions />
            </CardContent>
          </Card>
        </div>
        
        {/* Content Panel */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Add Words</CardTitle>
                <CardDescription>
                  Enter words to create flashcards
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <WordInput />
            </CardContent>
          </Card>
          
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              Your Flashcards {words.length > 0 && `(${words.length})`}
            </h2>
            
            {words.length > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={clearWords}
                disabled={isProcessing}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>
          
          <FlashcardList />
        </div>
      </div>
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <FlashcardProvider>
      <FlashcardApp />
    </FlashcardProvider>
  );
};

export default Index;
