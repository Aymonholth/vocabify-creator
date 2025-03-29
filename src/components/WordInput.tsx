
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, FileUp } from 'lucide-react';
import { useFlashcards } from '@/contexts/FlashcardContext';
import { useToast } from '@/hooks/use-toast';

const WordInput: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const { addWords, isProcessing } = useFlashcards();
  const { toast } = useToast();
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };
  
  const handleAddWords = () => {
    if (!inputText.trim()) {
      toast({
        title: 'No Words Entered',
        description: 'Please enter at least one word to process.',
        variant: 'destructive',
      });
      return;
    }
    
    // Split by commas, newlines, or both, and trim each word
    const words = inputText
      .split(/[\n,]+/)
      .map(word => word.trim())
      .filter(word => word.length > 0);
    
    addWords(words);
    setInputText('');
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Only accept text files
    if (file.type !== 'text/plain' && !file.name.endsWith('.txt')) {
      toast({
        title: 'Invalid File Type',
        description: 'Please upload a plain text (.txt) file.',
        variant: 'destructive',
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setInputText(content);
      }
    };
    reader.onerror = () => {
      toast({
        title: 'File Read Error',
        description: 'Failed to read the uploaded file. Please try again.',
        variant: 'destructive',
      });
    };
    reader.readAsText(file);
    
    // Reset the input to allow uploading the same file again
    e.target.value = '';
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="word-input">
          Enter Words (one per line or comma-separated)
        </Label>
        <Textarea
          id="word-input"
          placeholder="Enter words here..."
          value={inputText}
          onChange={handleTextChange}
          className="min-h-[120px]"
        />
      </div>
      
      <div className="flex gap-2">
        <Button
          onClick={handleAddWords}
          disabled={isProcessing || !inputText.trim()}
          className="flex-1"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Words
        </Button>
        
        <div className="relative">
          <Button
            type="button"
            variant="outline"
            disabled={isProcessing}
            className="flex gap-2"
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <FileUp className="h-4 w-4" />
            Upload
          </Button>
          <input
            id="file-upload"
            type="file"
            accept=".txt,text/plain"
            className="hidden"
            onChange={handleFileUpload}
            disabled={isProcessing}
          />
        </div>
      </div>
    </div>
  );
};

export default WordInput;
