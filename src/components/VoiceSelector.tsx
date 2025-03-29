
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useFlashcards } from '@/contexts/FlashcardContext';

const VoiceSelector: React.FC = () => {
  const { settings, updateSettings, availableVoices } = useFlashcards();
  
  const handleChange = (value: string) => {
    updateSettings({ selectedVoice: value });
  };
  
  return (
    <div className="space-y-2">
      <Label htmlFor="voice-selector">Target Language Voice</Label>
      <Select 
        value={settings.selectedVoice} 
        onValueChange={handleChange}
        disabled={availableVoices.length === 0}
      >
        <SelectTrigger id="voice-selector" className="w-full">
          <SelectValue placeholder={availableVoices.length === 0 ? "No voices available" : "Select voice"} />
        </SelectTrigger>
        <SelectContent>
          {availableVoices.map(voice => (
            <SelectItem key={voice.id} value={voice.id}>
              {voice.name} ({voice.gender})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default VoiceSelector;
