
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ChevronDown, 
  ChevronUp,
  Calendar,
  MapPin,
  Trophy,
  CheckSquare,
  XSquare
} from 'lucide-react';
import { format } from 'date-fns';
import { useMatches } from '@/context/MatchesContext';
import MatchActions from './MatchActions';

interface EnhancedMatchCardProps {
  matchId: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
  showExpandButton?: boolean;
}

const EnhancedMatchCard: React.FC<EnhancedMatchCardProps> = ({
  matchId,
  isExpanded,
  onToggleExpand,
  showExpandButton = true
}) => {
  const { 
    filteredMatches, 
    expandedMatchId, 
    setExpandedMatchId,
    getTeamName,
    approveMatch,
    canApproveMatch
  } = useMatches();
  
  const match = filteredMatches.find(m => m.id === matchId);
  if (!match) return null;
  
  const formattedDate = format(new Date(match.date), 'EEE, MMM d, yyyy');
  const homeTeamName = match.homeTeamName || getTeamName(match.homeTeamId);
  const awayTeamName = match.awayTeamName || getTeamName(match.awayTeamId);
  const hasScores = match.isComplete && (match.homeTeamScore !== undefined || match.awayTeamScore !== undefined);
  
  const toggleExpand = () => {
    onToggleExpand();
    if (expandedMatchId === matchId) {
      setExpandedMatchId(null);
    } else {
      setExpandedMatchId(matchId);
    }
  };
  
  const getStatusBadge = () => {
    if (match.isComplete) {
      return <Badge className="bg-green-600">Completed</Badge>;
    }
    
    const matchDate = new Date(match.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (matchDate < today) {
      return <Badge variant="outline" className="border-yellow-500 text-yellow-700">Past Due</Badge>;
    }
    
    if (matchDate.getTime() === today.getTime()) {
      return <Badge className="bg-blue-600">Today</Badge>;
    }
    
    return <Badge variant="outline">Upcoming</Badge>;
  };
  
  const getApprovalStatus = (team: 'home' | 'away') => {
    const isApproved = team === 'home' ? match.homeCoachApproved : match.awayCoachApproved;
    const canApprove = canApproveMatch(match, team);
    
    if (isApproved) {
      return (
        <Button 
          variant="outline" 
          size="sm" 
          className="h-7 gap-1 border-green-500 text-green-700"
          onClick={() => canApprove && approveMatch(matchId, team)}
          disabled={!canApprove}
        >
          <CheckSquare className="h-3.5 w-3.5" />
          Approved
        </Button>
      );
    }
    
    return (
      <Button 
        variant="outline" 
        size="sm" 
        className="h-7 gap-1 border-gray-300 text-gray-500"
        onClick={() => canApprove && approveMatch(matchId, team)}
        disabled={!canApprove}
      >
        <XSquare className="h-3.5 w-3.5" />
        {canApprove ? "Approve" : "Pending"}
      </Button>
    );
  };

  return (
    <Card className={`mb-4 overflow-hidden transition-all ${isExpanded ? 'ring-1 ring-primary' : ''}`}>
      <CardHeader className="pb-2 pt-3 px-4 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          {getStatusBadge()}
          {match.isLeagueMatch && (
            <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
              League Match
            </Badge>
          )}
        </div>
        <div className="flex items-center">
          <MatchActions matchId={matchId} isComplete={match.isComplete} />
          
          {showExpandButton && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleExpand}
              className="h-7 w-7 p-0"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="px-4 pb-3 pt-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
          <div className="flex items-center mb-2 sm:mb-0">
            <Calendar className="h-4 w-4 mr-1.5 text-gray-400" />
            <span className="text-sm">{formattedDate}</span>
          </div>
          
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1.5 text-gray-400" />
            <span className="text-sm">Home: {homeTeamName}</span>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-md p-3">
          <div className="flex justify-between items-center">
            {/* Team Names */}
            <div className="text-left flex-1">
              <div className="font-medium">{awayTeamName}</div>
              <div className="text-xs text-gray-500">Away</div>
            </div>
            
            {/* Score */}
            {hasScores ? (
              <div className="flex items-center">
                <div className={`text-lg font-bold ${match.homeTeamWon ? 'opacity-50' : 'text-primary'}`}>
                  {match.awayTeamScore}
                </div>
                <div className="mx-1 text-xs text-gray-400">vs</div>
                <div className={`text-lg font-bold ${!match.homeTeamWon ? 'opacity-50' : 'text-primary'}`}>
                  {match.homeTeamScore}
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-400">vs</div>
            )}
            
            <div className="text-right flex-1">
              <div className="font-medium">{homeTeamName}</div>
              <div className="text-xs text-gray-500">Home</div>
            </div>
          </div>
          
          {match.isComplete && match.homeTeamWon !== undefined && (
            <div className="mt-2 pt-2 border-t flex justify-center items-center">
              <Trophy className="h-4 w-4 mr-1.5 text-amber-500" />
              <span className="text-sm font-medium">
                {match.homeTeamWon ? homeTeamName : awayTeamName} wins
              </span>
            </div>
          )}
        </div>
        
        {match.isComplete && (
          <div className="mt-3 pt-2 border-t flex justify-between">
            <div>
              {getApprovalStatus('away')}
            </div>
            <div>
              {getApprovalStatus('home')}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedMatchCard;
