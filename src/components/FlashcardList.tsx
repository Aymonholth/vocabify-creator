
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlarmClock, VolumeX, Check, X } from 'lucide-react';
import { useFlashcards } from '@/contexts/FlashcardContext';

const FlashcardList: React.FC = () => {
  const { words } = useFlashcards();
  
  if (words.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed rounded-lg">
        <p className="text-muted-foreground">
          No flashcards added yet. Add words above to get started.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {words.map(word => (
        <Card key={word.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-lg">
                  {word.targetWord || word.sourceWord}
                </h3>
                <StatusBadge status={word.status} />
              </div>
            </div>
            
            {word.status === 'pending' && (
              <div className="p-4 flex justify-center items-center h-32">
                <p className="text-muted-foreground">Waiting to be processed...</p>
              </div>
            )}
            
            {word.status === 'processing' && (
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
                
                <div className="flex justify-between">
                  <Skeleton className="h-8 w-28" />
                  <Skeleton className="h-8 w-28" />
                </div>
              </div>
            )}
            
            {word.status === 'completed' && (
              <div className="divide-y">
                <div className="p-4 space-y-2">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Definition</p>
                      <p>{word.definition}</p>
                    </div>
                    {word.audioUrls.definition && (
                      <AudioButton url={word.audioUrls.definition} label="Play Definition" />
                    )}
                  </div>
                </div>
                
                <div className="p-4 space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Example Sentence 1</p>
                    <p>{word.exampleSentence1}</p>
                    {word.audioUrls.exampleSentence1 && (
                      <AudioButton url={word.audioUrls.exampleSentence1} label="Play Example 1" />
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Example Sentence 2</p>
                    <p>{word.exampleSentence2}</p>
                    {word.audioUrls.exampleSentence2 && (
                      <AudioButton url={word.audioUrls.exampleSentence2} label="Play Example 2" />
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {word.status === 'error' && (
              <div className="p-4 text-center text-destructive">
                <X className="h-8 w-8 mx-auto mb-2" />
                <p>Error processing this word.</p>
                {word.error && <p className="text-sm mt-2">{word.error}</p>}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Helper components
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  switch (status) {
    case 'pending':
      return (
        <Badge variant="outline" className="bg-muted text-muted-foreground">
          <AlarmClock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      );
    case 'processing':
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 animate-pulse-slow">
          Processing...
        </Badge>
      );
    case 'completed':
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
          <Check className="h-3 w-3 mr-1" />
          Completed
        </Badge>
      );
    case 'error':
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
          <X className="h-3 w-3 mr-1" />
          Error
        </Badge>
      );
    default:
      return null;
  }
};

const AudioButton: React.FC<{ url: string; label: string }> = ({ url, label }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  
  const playAudio = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(url);
      audioRef.current.onended = () => setIsPlaying(false);
    }
    
    audioRef.current.play()
      .then(() => setIsPlaying(true))
      .catch(error => {
        console.error('Audio playback error:', error);
        setIsPlaying(false);
      });
  };
  
  React.useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  return (
    <button
      onClick={playAudio}
      disabled={isPlaying}
      className={`
        inline-flex items-center justify-center px-3 py-1 rounded-full text-xs
        ${isPlaying
          ? 'bg-secondary text-secondary-foreground'
          : 'bg-secondary/40 hover:bg-secondary/60 text-secondary-foreground'
        }
        transition-colors
      `}
      aria-label={label}
    >
      {isPlaying ? (
        <>
          <span className="sr-only">Playing</span>
          <span className="relative flex h-2 w-2 mr-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-foreground opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary-foreground"></span>
          </span>
        </>
      ) : (
        <VolumeX className="h-3 w-3 mr-1.5" />
      )}
      <span>{label}</span>
    </button>
  );
};

export default FlashcardList;
