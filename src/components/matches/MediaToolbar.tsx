
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
import { useIsMobile } from '@/hooks/use-mobile';

const MediaToolbar = () => {
  const { toast } = useToast();
  const { filteredMatches, getTeamName } = useMatches();
  const isMobile = useIsMobile();

  const handlePrint = () => {
    window.print();
  };

  const handleCopyForMedia = () => {
    const mediaText = filteredMatches.map(match => {
      const homeTeam = getTeamName(match.homeTeamId);
      const awayTeam = getTeamName(match.awayTeamId);
      const score = match.isComplete ? 
        match.homeTeamWon ? 
          `${homeTeam} ${match.homeTeamScore}-${match.awayTeamScore}` :
          `${awayTeam} ${match.awayTeamScore}-${match.homeTeamScore}` :
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
    <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end mt-2 sm:mt-0">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => exportMatchesToCSV(filteredMatches)}
        className="flex-1 sm:flex-none gap-1.5 text-xs sm:text-sm"
      >
        <FileDown className="h-3 w-3 sm:h-4 sm:w-4" />
        {!isMobile && "Export CSV"}
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handlePrint}
        className="flex-1 sm:flex-none gap-1.5 text-xs sm:text-sm"
      >
        <Printer className="h-3 w-3 sm:h-4 sm:w-4" />
        {!isMobile && "Print"}
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleCopyForMedia}
        className="flex-1 sm:flex-none gap-1.5 text-xs sm:text-sm"
      >
        <ClipboardCopy className="h-3 w-3 sm:h-4 sm:w-4" />
        {!isMobile && "Copy for Media"}
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleShare}
        className="flex-1 sm:flex-none gap-1.5 text-xs sm:text-sm"
      >
        <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
        {!isMobile && "Share"}
      </Button>
    </div>
  );
};

export default MediaToolbar;
