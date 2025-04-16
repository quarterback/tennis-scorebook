
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trophy, Calendar, Users, Info, PlayCircle, FlaskConical, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTournamentBracket } from '@/hooks/useTournamentBracket';
import { Gender, Classification, Match } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import BracketDisplay from './BracketDisplay';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PostSeasonSimulatorProps {
  gender: Gender;
  classification: Classification;
}

const PostSeasonSimulator: React.FC<PostSeasonSimulatorProps> = ({ gender, classification }) => {
  const { 
    bracket, 
    qualifiedTeams, 
    playoffTiebreakers,
    generateQualifiedTeams, 
    autoGenerateBracket, 
    simulateRound,
    simulateTiebreaker,
    qualificationRules
  } = useTournamentBracket(gender, classification);
  
  const { toast } = useToast();
  const [selectedMatchDetails, setSelectedMatchDetails] = useState<Match | null>(null);
  const [showMatchDetailsDialog, setShowMatchDetailsDialog] = useState(false);
  const [tiedMatches, setTiedMatches] = useState<{id: string; team1Name: string; team2Name: string;}[]>([]);
  
  useEffect(() => {
    // Collect any matches that end in a tie and need tiebreakers
    const newTiedMatches: {id: string; team1Name: string; team2Name: string;}[] = [];
    
    bracket.rounds.forEach(round => {
      round.matches.forEach(match => {
        // Filter for matches with both teams assigned but no winner yet
        if (match.team1.id && match.team2.id && !match.winner && match.score) {
          // If the score is tied (e.g., "4-4")
          const [home, away] = match.score.split('-').map(Number);
          if (home === away) {
            newTiedMatches.push({
              id: match.id,
              team1Name: match.team1.name,
              team2Name: match.team2.name
            });
          }
        }
      });
    });
    
    setTiedMatches(newTiedMatches);
  }, [bracket]);
  
  const handleGenerateBracket = () => {
    generateQualifiedTeams();
    autoGenerateBracket();
    toast({
      title: "Tournament Bracket Generated",
      description: `Created a ${classification} ${gender} tournament bracket with qualified teams`
    });
  };
  
  const handleSimulateRound = (roundIndex: number) => {
    simulateRound(roundIndex);
    
    const round = bracket.rounds[roundIndex];
    if (round) {
      toast({
        title: "Round Simulated",
        description: `Simulated ${round.name} matches with detailed results`
      });
    }
  };
  
  const handleViewMatchDetails = (match: any) => {
    if (match.matchDetails) {
      setSelectedMatchDetails(match.matchDetails);
      setShowMatchDetailsDialog(true);
    } else {
      toast({
        title: "No Match Details",
        description: "This match hasn't been simulated yet",
        variant: "destructive"
      });
    }
  };
  
  const handleResolveTiebreaker = (matchId: string) => {
    simulateTiebreaker(matchId);
    
    toast({
      title: "Tiebreaker Resolved",
      description: "The playoff tiebreaker has been simulated and a winner determined"
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            {classification} {gender} Post-Season Tournament
          </CardTitle>
          <CardDescription>
            Simulate the state tennis tournament with qualified teams
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-500" />
              <AlertDescription className="text-blue-800">
                {qualificationRules.totalSpots} total spots: {qualificationRules.automaticBids} automatic bids 
                (1 per league) and {qualificationRules.atLargeBids} at-large bids
              </AlertDescription>
            </Alert>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-500" />
                <span className="font-medium">
                  {qualifiedTeams.length} of {qualificationRules.totalSpots} teams qualified
                </span>
              </div>
              <Button 
                onClick={handleGenerateBracket} 
                className="gap-2 bg-green-600 hover:bg-green-700"
              >
                <FlaskConical className="h-4 w-4" />
                Generate Tournament Bracket
              </Button>
            </div>
            
            {bracket.rounds.length > 0 && (
              <Tabs defaultValue="bracket" className="mt-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="bracket">Tournament Bracket</TabsTrigger>
                  <TabsTrigger value="simulation">Simulation Controls</TabsTrigger>
                </TabsList>
                
                <TabsContent value="bracket" className="p-4 bg-white rounded-md">
                  <BracketDisplay 
                    rounds={bracket.rounds}
                    onViewMatch={handleViewMatchDetails}
                  />
                </TabsContent>
                
                <TabsContent value="simulation" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-md p-4 space-y-4">
                      <h3 className="font-medium flex items-center gap-2">
                        <PlayCircle className="h-5 w-5 text-purple-500" />
                        Simulate Tournament Rounds
                      </h3>
                      <div className="space-y-3">
                        {bracket.rounds.map((round, index) => (
                          <Button
                            key={index}
                            onClick={() => handleSimulateRound(index)}
                            variant="outline"
                            className="w-full justify-between"
                            disabled={round.matches.every(m => m.completed)}
                          >
                            <span>{round.name}</span>
                            <Calendar className="h-4 w-4 text-gray-500" />
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-4 space-y-4">
                      <h3 className="font-medium flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-yellow-500" />
                        Playoff Tiebreakers
                      </h3>
                      
                      {tiedMatches.length > 0 ? (
                        <div className="space-y-3">
                          {tiedMatches.map(match => (
                            <div key={match.id} className="p-3 bg-gray-50 rounded-md">
                              <p className="mb-2 font-medium">{match.team1Name} vs {match.team2Name}</p>
                              <Button 
                                onClick={() => handleResolveTiebreaker(match.id)}
                                className="w-full"
                                variant="secondary"
                              >
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Resolve Tiebreaker
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">
                          No tied matches currently need tiebreakers.
                        </p>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Match Details Dialog */}
      <Dialog open={showMatchDetailsDialog} onOpenChange={setShowMatchDetailsDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Match Details</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[500px] pr-4">
            {selectedMatchDetails && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 text-center py-3 bg-gray-100 rounded-md mb-4">
                  <div>{selectedMatchDetails.homeTeamScore}</div>
                  <div className="font-bold">Final Score</div>
                  <div>{selectedMatchDetails.awayTeamScore}</div>
                </div>
                
                <div className="space-y-6">
                  <h3 className="font-semibold text-lg border-b pb-2">Singles Matches</h3>
                  {selectedMatchDetails.flights
                    .filter(f => f.type === 'singles')
                    .sort((a, b) => a.position - b.position)
                    .map(flight => (
                      <div key={flight.id} className="border p-3 rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Singles Position {flight.position}</h4>
                          <span className={`px-2 py-1 rounded text-xs ${flight.homePlayerWon ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                            Winner: {flight.homePlayerWon ? 'Home' : 'Away'}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <Label className="text-xs text-gray-500">Home Player</Label>
                            <p className="font-medium">{flight.homePlayers[0]}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500">Away Player</Label>
                            <p className="font-medium">{flight.awayPlayers[0]}</p>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 p-2 rounded">
                          <div className="text-xs font-medium mb-1">Set Scores</div>
                          <div className="space-y-1">
                            {flight.sets.map((set, idx) => (
                              <div key={idx} className="flex justify-between">
                                <span>Set {idx+1}:</span>
                                <span className="font-medium">{set.homeScore}-{set.awayScore}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                
                <div className="space-y-6">
                  <h3 className="font-semibold text-lg border-b pb-2">Doubles Matches</h3>
                  {selectedMatchDetails.flights
                    .filter(f => f.type === 'doubles')
                    .sort((a, b) => a.position - b.position)
                    .map(flight => (
                      <div key={flight.id} className="border p-3 rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Doubles Position {flight.position}</h4>
                          <span className={`px-2 py-1 rounded text-xs ${flight.homePlayerWon ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                            Winner: {flight.homePlayerWon ? 'Home' : 'Away'}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <Label className="text-xs text-gray-500">Home Players</Label>
                            <p className="font-medium">{flight.homePlayers.join(', ')}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500">Away Players</Label>
                            <p className="font-medium">{flight.awayPlayers.join(', ')}</p>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 p-2 rounded">
                          <div className="text-xs font-medium mb-1">Set Scores</div>
                          <div className="space-y-1">
                            {flight.sets.map((set, idx) => (
                              <div key={idx} className="flex justify-between">
                                <span>Set {idx+1}:</span>
                                <span className="font-medium">{set.homeScore}-{set.awayScore}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PostSeasonSimulator;
