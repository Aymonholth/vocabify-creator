
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

const LanguageSelector: React.FC = () => {
  const { settings, updateSettings, availableLanguages } = useFlashcards();
  
  const handleChange = (value: string) => {
    updateSettings({ targetLanguage: value });
  };
  
  return (
    <div className="space-y-2">
      <Label htmlFor="target-language">Target Language</Label>
      <Select 
        value={settings.targetLanguage} 
        onValueChange={handleChange}
      >
        <SelectTrigger id="target-language" className="w-full">
          <SelectValue placeholder="Select target language" />
        </SelectTrigger>
        <SelectContent>
          {availableLanguages
            .filter(lang => lang.code !== 'en') // Exclude English from target languages
            .map(lang => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.name}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
