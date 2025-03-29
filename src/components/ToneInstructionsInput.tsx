
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useFlashcards } from '@/contexts/FlashcardContext';

const ToneInstructionsInput: React.FC = () => {
  const { settings, updateSettings } = useFlashcards();
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateSettings({ toneInstructions: e.target.value });
  };
  
  return (
    <div className="space-y-2">
      <Label htmlFor="tone-instructions">
        Tone Instructions (Optional)
      </Label>
      <Textarea
        id="tone-instructions"
        placeholder="E.g., 'formal', 'colloquial', 'Mexican Spanish', etc."
        value={settings.toneInstructions}
        onChange={handleChange}
        className="min-h-[80px]"
      />
    </div>
  );
};

export default ToneInstructionsInput;
