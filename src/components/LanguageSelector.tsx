
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

interface LanguageSelectorProps {
  type: 'source' | 'target';
  label: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ type, label }) => {
  const { settings, updateSettings, availableLanguages } = useFlashcards();
  
  const handleChange = (value: string) => {
    if (type === 'source') {
      updateSettings({ sourceLanguage: value });
    } else {
      updateSettings({ targetLanguage: value });
    }
  };
  
  const currentValue = type === 'source' 
    ? settings.sourceLanguage 
    : settings.targetLanguage;
  
  return (
    <div className="space-y-2">
      <Label htmlFor={`${type}-language`}>{label}</Label>
      <Select 
        value={currentValue} 
        onValueChange={handleChange}
      >
        <SelectTrigger id={`${type}-language`} className="w-full">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          {availableLanguages.map(lang => (
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
