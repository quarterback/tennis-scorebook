
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trophy, Calendar, Users, Info, PlayCircle, FlaskConical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTournamentBracket } from '@/hooks/useTournamentBracket';
import { Gender, Classification } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SelectValue, SelectTrigger, SelectContent, SelectItem, Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import BracketDisplay from './BracketDisplay';
import { useToast } from '@/hooks/use-toast';

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
    handleWinnerSelect,
    setupPlayoffTiebreaker,
    simulateTiebreaker,
    qualificationRules
  } = useTournamentBracket(gender, classification);
  
  const { toast } = useToast();
  const [selectedTiebreaker, setSelectedTiebreaker] = useState<string | null>(null);
  const [tiebreakMatches, setTiebreakMatches] = useState<{
    id: string;
    team1Name: string;
    team2Name: string;
  }[]>([]);
  
  useEffect(() => {
    // Collect any matches that end in a tie that need tiebreakers
    const tiedMatches: {id: string; team1Name: string; team2Name: string;}[] = [];
    
    bracket.rounds.forEach(round => {
      round.matches.forEach(match => {
        // Filter for matches with both teams assigned but no winner yet
        if (match.team1.id && match.team2.id && !match.winner && match.score) {
          // If the score is tied (e.g., "4-4")
          const [home, away] = match.score.split('-').map(Number);
          if (home === away) {
            tiedMatches.push({
              id: match.id,
              team1Name: match.team1.name,
              team2Name: match.team2.name
            });
          }
        }
      });
    });
    
    setTiebreakMatches(tiedMatches);
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
    const round = bracket.rounds[roundIndex];
    if (!round) return;
    
    // Simulate all matches in this round
    round.matches.forEach(match => {
      // Only simulate if both teams are assigned and match isn't completed
      if (match.team1.id && match.team2.id && !match.completed) {
        // Random winner (60% chance higher seed wins)
        const higherSeedWins = Math.random() < 0.6;
        
        // Determine if team1 is higher seed
        const team1IsHigherSeed = match.team1.seed < match.team2.seed;
        
        // Set winner based on seeding and random chance
        const winner = (team1IsHigherSeed && higherSeedWins) || 
                      (!team1IsHigherSeed && !higherSeedWins) ? 'team1' : 'team2';
                      
        handleWinnerSelect(match.id, winner);
      }
    });
    
    toast({
      title: "Round Simulated",
      description: `Simulated ${round.name} matches with detailed results`
    });
  };
  
  const handleSimulateTiebreaker = () => {
    if (!selectedTiebreaker) return;
    
    const winner = simulateTiebreaker(selectedTiebreaker);
    
    if (winner) {
      toast({
        title: "Tiebreaker Completed",
        description: `Team ${winner === 'team1' ? '1' : '2'} won the playoff tiebreaker`
      });
      
      // Reset selection
      setSelectedTiebreaker(null);
    }
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
                    bracket={bracket} 
                    onWinnerSelect={handleWinnerSelect} 
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
                      
                      {tiebreakMatches.length > 0 ? (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="tiebreaker-select">Select tied match:</Label>
                            <Select 
                              value={selectedTiebreaker || ""}
                              onValueChange={setSelectedTiebreaker}
                            >
                              <SelectTrigger id="tiebreaker-select">
                                <SelectValue placeholder="Select a tied match" />
                              </SelectTrigger>
                              <SelectContent>
                                {tiebreakMatches.map(match => (
                                  <SelectItem key={match.id} value={match.id}>
                                    {match.team1Name} vs {match.team2Name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <Button 
                            onClick={handleSimulateTiebreaker}
                            disabled={!selectedTiebreaker}
                            className="w-full"
                          >
                            Simulate Tiebreaker Matches
                          </Button>
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
    </div>
  );
};

export default PostSeasonSimulator;
