
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
    <div className="media-toolbar">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => exportMatchesToCSV(filteredMatches)}
        className="toolbar-button"
      >
        <FileDown className="toolbar-icon" />
        {!isMobile && "Export CSV"}
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handlePrint}
        className="toolbar-button"
      >
        <Printer className="toolbar-icon" />
        {!isMobile && "Print"}
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleCopyForMedia}
        className="toolbar-button"
      >
        <ClipboardCopy className="toolbar-icon" />
        {!isMobile && "Copy for Media"}
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleShare}
        className="toolbar-button"
      >
        <Share2 className="toolbar-icon" />
        {!isMobile && "Share"}
      </Button>
    </div>
  );
};

export default MediaToolbar;
