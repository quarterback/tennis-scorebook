
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  FileDown, 
  Printer, 
  ClipboardCopy, 
  Share2 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMatches } from '@/context/MatchesContext';
import { exportMatchesToCSV } from '@/utils/exportData';

const MediaToolbar = () => {
  const { toast } = useToast();
  const { filteredMatches, getTeamName } = useMatches();

  const handlePrint = () => {
    window.print();
  };

  const handleCopyForMedia = () => {
    const mediaText = filteredMatches.map(match => {
      const homeTeam = getTeamName(match.homeTeamId);
      const awayTeam = getTeamName(match.awayTeamId);
      const score = match.isComplete ? 
        `${homeTeam} ${match.homeTeamScore}, ${awayTeam} ${match.awayTeamScore}` :
        'Match scheduled';
      return `${homeTeam} vs ${awayTeam} - ${score}`;
    }).join('\n');

    navigator.clipboard.writeText(mediaText);
    toast({
      title: "Copied to clipboard",
      description: "Match details have been copied in media format"
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Tennis Match Results',
          text: 'Check out the latest tennis match results!',
          url: window.location.href
        });
      } catch (error) {
        toast({
          title: "Sharing failed",
          description: "Unable to share match results",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Sharing not supported",
        description: "Your browser doesn't support the Web Share API",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex gap-2 flex-wrap">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => exportMatchesToCSV(filteredMatches)}
        className="gap-1.5"
      >
        <FileDown className="h-4 w-4" />
        <span className="hidden sm:inline">Export CSV</span>
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handlePrint}
        className="gap-1.5"
      >
        <Printer className="h-4 w-4" />
        <span className="hidden sm:inline">Print</span>
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleCopyForMedia}
        className="gap-1.5"
      >
        <ClipboardCopy className="h-4 w-4" />
        <span className="hidden sm:inline">Copy for Media</span>
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleShare}
        className="gap-1.5"
      >
        <Share2 className="h-4 w-4" />
        <span className="hidden sm:inline">Share</span>
      </Button>
    </div>
  );
};

export default MediaToolbar;
