
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  FileText, 
  Table, 
  BookOpen,
  Loader2
} from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useFlashcards } from '@/contexts/FlashcardContext';
import { ExportFormat } from '@/types/flashcard';

const ExportOptions: React.FC = () => {
  const { exportFlashcards, words, isProcessing } = useFlashcards();
  const [activeExport, setActiveExport] = React.useState<ExportFormat | null>(null);
  
  const handleExport = async (format: ExportFormat) => {
    setActiveExport(format);
    
    try {
      const downloadUrl = await exportFlashcards(format);
      
      if (downloadUrl) {
        // Create a temporary link and trigger download
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `flashcards-${format}-${new Date().toISOString().slice(0, 10)}.${getExtension(format)}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } finally {
      setActiveExport(null);
    }
  };
  
  const getExtension = (format: ExportFormat) => {
    switch (format) {
      case 'html': return 'html';
      case 'csv': return 'csv';
      case 'anki': return 'apkg';
      default: return 'txt';
    }
  };
  
  const completedCount = words.filter(w => w.status === 'completed').length;
  const isDisabled = isProcessing || completedCount === 0;
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Export Flashcards</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <ExportButton
          format="html"
          icon={<FileText className="h-4 w-4 mr-2" />}
          label="HTML"
          description="Web page with flashcards table"
          onClick={() => handleExport('html')}
          isLoading={activeExport === 'html'}
          disabled={isDisabled}
        />
        
        <ExportButton
          format="csv"
          icon={<Table className="h-4 w-4 mr-2" />}
          label="CSV"
          description="Spreadsheet compatible format"
          onClick={() => handleExport('csv')}
          isLoading={activeExport === 'csv'}
          disabled={isDisabled}
        />
        
        <ExportButton
          format="anki"
          icon={<BookOpen className="h-4 w-4 mr-2" />}
          label="Anki"
          description="Ready to import into Anki"
          onClick={() => handleExport('anki')}
          isLoading={activeExport === 'anki'}
          disabled={isDisabled}
        />
      </div>
      
      {completedCount === 0 && words.length > 0 && (
        <p className="text-sm text-muted-foreground">
          Complete processing at least one word to enable export options.
        </p>
      )}
    </div>
  );
};

interface ExportButtonProps {
  format: ExportFormat;
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
  isLoading: boolean;
  disabled: boolean;
}

const ExportButton: React.FC<ExportButtonProps> = ({
  format,
  icon,
  label,
  description,
  onClick,
  isLoading,
  disabled
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            className="h-auto py-4 justify-start w-full"
            onClick={onClick}
            disabled={disabled || isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              icon
            )}
            <div className="flex flex-col items-start">
              <span>{label}</span>
              <span className="text-xs text-muted-foreground mt-1">
                {description}
              </span>
            </div>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Export as {format.toUpperCase()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ExportOptions;
