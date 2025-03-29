
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeftRight } from 'lucide-react';
import { useFlashcards } from '@/contexts/FlashcardContext';

const DirectionToggle: React.FC = () => {
  const { settings, updateSettings, availableLanguages } = useFlashcards();
  
  const handleToggle = (checked: boolean) => {
    updateSettings({ 
      translationDirection: checked ? 'targetToSource' : 'sourceToTarget' 
    });
  };
  
  const sourceLanguage = availableLanguages.find(l => l.code === settings.sourceLanguage)?.name || 'Source';
  const targetLanguage = availableLanguages.find(l => l.code === settings.targetLanguage)?.name || 'Target';
  
  const isTargetToSource = settings.translationDirection === 'targetToSource';
  
  return (
    <div className="flex flex-col space-y-2">
      <Label htmlFor="direction-toggle">Translation Direction</Label>
      <div className="flex items-center space-x-4">
        <span className={`text-sm ${!isTargetToSource ? 'font-bold' : ''}`}>
          {sourceLanguage} → {targetLanguage}
        </span>
        <div className="flex items-center space-x-2">
          <Switch
            id="direction-toggle"
            checked={isTargetToSource}
            onCheckedChange={handleToggle}
          />
          <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
        </div>
        <span className={`text-sm ${isTargetToSource ? 'font-bold' : ''}`}>
          {targetLanguage} → {sourceLanguage}
        </span>
      </div>
    </div>
  );
};

export default DirectionToggle;
