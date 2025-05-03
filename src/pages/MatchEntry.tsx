import React, { useState, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Match, Flight, Team, School } from '@/types';
import { CalendarIcon, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { calculateFlightWeightedScore } from '@/utils/aprCalculations';
import { useItaRankingCalculator } from '@/hooks/rankings/useItaRankingCalculator';
import { MatchPointsCalculator } from '@/components/matches/MatchPointsCalculator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const MatchEntry = () => {
  const { teams, schools, addMatch } = useData();
  const { toast } = useToast();
  const today = new Date();
  
  const { rankings: itaRankings, calculateRankings: calculateItaRankings } = useItaRankingCalculator();
  const [opponent, setOpponent] = useState<Team | null>(null);
  const [opponentRank, setOpponentRank] = useState<number>(99);
  
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [date, setDate] = useState<Date>(today);
  const [opponentSchoolId, setOpponentSchoolId] = useState<string>('');
  const [homeTeamScore, setHomeTeamScore] = useState<number>(0);
  const [awayTeamScore, setAwayTeamScore] = useState<number>(0);
  const [isHomeTeam, setIsHomeTeam] = useState<boolean>(true);
  const [isLeagueMatch, setIsLeagueMatch] = useState<boolean>(true);
  
  const [flightsWon, setFlightsWon] = useState({
    singles1: false,
    singles2: false,
    singles3: false,
    doubles1: false,
    doubles2: false,
  });
  
  const selectedTeam = teams.find(t => t.id === selectedTeamId);
  const teamSchool = selectedTeam ? schools.find(s => s.id === selectedTeam.schoolId) : null;
  
  const opponentSchools = schools.filter(s => 
    s.id !== teamSchool?.id && 
    (!teamSchool || s.classification === teamSchool.classification)
  );
  
  useEffect(() => {
    setOpponentSchoolId('');
    setHomeTeamScore(0);
    setAwayTeamScore(0);
    setIsHomeTeam(true);
    setIsLeagueMatch(true);
    setFlightsWon({
      singles1: false,
      singles2: false,
      singles3: false,
      doubles1: false,
      doubles2: false,
    });
  }, [selectedTeamId]);
  
  useEffect(() => {
    if (!opponent || !selectedTeam) return;
    
    // Get rankings for the appropriate gender and classification
    calculateItaRankings({
      gender: selectedTeam.gender,
      classification: teamSchool?.classification || '6A',
      includeNonLeagueMatches: true
    });
    
    // Set opponent for display purposes
    const opponentTeams = teams.filter(t => 
      t.schoolId === opponentSchoolId && 
      t.gender === selectedTeam?.gender
    );
    
    if (opponentTeams.length > 0) {
      setOpponent(opponentTeams[0]);
      
      // Find opponent's rank in ITA rankings
      const opponentRanking = itaRankings.find(r => r.teamId === opponentTeams[0].id);
      setOpponentRank(opponentRanking?.classificationRank || 99);
    }
  }, [opponentSchoolId, selectedTeam, calculateItaRankings, itaRankings]);
  
  const handleFlightToggle = (flight: keyof typeof flightsWon) => {
    setFlightsWon(prev => ({
      ...prev,
      [flight]: !prev[flight]
    }));
  };
  
  const createMatchFromForm = (): Omit<Match, 'id'> => {
    const homeTeamId = isHomeTeam ? selectedTeamId : '';
    const awayTeamId = !isHomeTeam ? selectedTeamId : '';
    
    const flights: Flight[] = [
      {
        id: crypto.randomUUID(),
        matchId: '',
        type: 'singles',
        position: 1,
        level: 'varsity',
        homePlayers: [],
        awayPlayers: [],
        sets: [{ homeScore: flightsWon.singles1 ? 6 : 2, awayScore: flightsWon.singles1 ? 2 : 6 }],
        homePlayerWon: isHomeTeam ? flightsWon.singles1 : !flightsWon.singles1,
      },
      {
        id: crypto.randomUUID(),
        matchId: '',
        type: 'singles',
        position: 2,
        level: 'varsity',
        homePlayers: [],
        awayPlayers: [],
        sets: [{ homeScore: flightsWon.singles2 ? 6 : 2, awayScore: flightsWon.singles2 ? 2 : 6 }],
        homePlayerWon: isHomeTeam ? flightsWon.singles2 : !flightsWon.singles2,
      },
      {
        id: crypto.randomUUID(),
        matchId: '',
        type: 'singles',
        position: 3,
        level: 'varsity',
        homePlayers: [],
        awayPlayers: [],
        sets: [{ homeScore: flightsWon.singles3 ? 6 : 2, awayScore: flightsWon.singles3 ? 2 : 6 }],
        homePlayerWon: isHomeTeam ? flightsWon.singles3 : !flightsWon.singles3,
      },
      {
        id: crypto.randomUUID(),
        matchId: '',
        type: 'doubles',
        position: 1,
        level: 'varsity',
        homePlayers: [],
        awayPlayers: [],
        sets: [{ homeScore: flightsWon.doubles1 ? 6 : 2, awayScore: flightsWon.doubles1 ? 2 : 6 }],
        homePlayerWon: isHomeTeam ? flightsWon.doubles1 : !flightsWon.doubles1,
      },
      {
        id: crypto.randomUUID(),
        matchId: '',
        type: 'doubles',
        position: 2,
        level: 'varsity',
        homePlayers: [],
        awayPlayers: [],
        sets: [{ homeScore: flightsWon.doubles2 ? 6 : 2, awayScore: flightsWon.doubles2 ? 2 : 6 }],
        homePlayerWon: isHomeTeam ? flightsWon.doubles2 : !flightsWon.doubles2,
      },
    ];
    
    const opponentTeam = teams.find(t => 
      t.schoolId === opponentSchoolId && 
      t.gender === selectedTeam?.gender
    );
    
    const actualHomeTeamId = isHomeTeam ? selectedTeamId : (opponentTeam?.id || '');
    const actualAwayTeamId = !isHomeTeam ? selectedTeamId : (opponentTeam?.id || '');
    
    const match: Omit<Match, 'id'> = {
      date: format(date, 'yyyy-MM-dd'),
      homeTeamId: actualHomeTeamId,
      awayTeamId: actualAwayTeamId,
      homeTeamScore: isHomeTeam ? homeTeamScore : awayTeamScore,
      awayTeamScore: isHomeTeam ? awayTeamScore : homeTeamScore,
      isLeagueMatch,
      isComplete: true,
      homeTeamWon: isHomeTeam ? homeTeamScore > awayTeamScore : awayTeamScore > homeTeamScore,
      isTie: homeTeamScore === awayTeamScore,
      homeCoachApproved: true,
      awayCoachApproved: true,
      flights
    };
    
    return match;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTeamId) {
      toast({
        title: "Error",
        description: "Please select your team",
        variant: "destructive"
      });
      return;
    }
    
    if (!opponentSchoolId) {
      toast({
        title: "Error",
        description: "Please select an opponent school",
        variant: "destructive"
      });
      return;
    }
    
    const totalFlightsCount = 5;
    const wonFlightsCount = Object.values(flightsWon).filter(Boolean).length;
    const ourTeamScore = isHomeTeam ? homeTeamScore : awayTeamScore;
    
    if (wonFlightsCount !== ourTeamScore) {
      toast({
        title: "Warning",
        description: `You marked ${wonFlightsCount} flights as won, but entered a score of ${ourTeamScore}. Please ensure these match.`,
        variant: "destructive"
      });
      return;
    }
    
    if (homeTeamScore + awayTeamScore > totalFlightsCount) {
      toast({
        title: "Error",
        description: `Total score (${homeTeamScore + awayTeamScore}) exceeds maximum possible flights (${totalFlightsCount})`,
        variant: "destructive"
      });
      return;
    }
    
    const newMatch = createMatchFromForm();
    
    const fws = calculateFlightWeightedScore(newMatch as Match);
    console.log('Match FWS:', fws);
    
    const createdMatch = addMatch(newMatch);
    console.log('Created match with ID:', createdMatch.id);
    
    toast({
      title: "Match Added",
      description: "Match has been recorded successfully"
    });
    
    setHomeTeamScore(0);
    setAwayTeamScore(0);
    setFlightsWon({
      singles1: false,
      singles2: false,
      singles3: false,
      doubles1: false,
      doubles2: false,
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Match Entry</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => window.location.href = '/rankings'}>
            View Rankings
          </Button>
        </div>
      </div>
      
      {/* Match Entry Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Record New Match</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column - main match details */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="selectedTeam">Your Team</Label>
                  <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your team" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map(team => {
                        const school = schools.find(s => s.id === team.schoolId);
                        return (
                          <SelectItem key={team.id} value={team.id}>
                            {school?.name} {team.gender}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date">Match Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(date) => date && setDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="opponent">Opponent School</Label>
                  <Select value={opponentSchoolId} onValueChange={setOpponentSchoolId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select opponent school" />
                    </SelectTrigger>
                    <SelectContent>
                      {opponentSchools.map(school => (
                        <SelectItem key={school.id} value={school.id}>
                          {school.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="isLeagueMatch"
                    checked={isLeagueMatch}
                    onCheckedChange={(checked) => setIsLeagueMatch(checked as boolean)}
                  />
                  <Label htmlFor="isLeagueMatch">League Match</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="isHomeTeam"
                    checked={isHomeTeam}
                    onCheckedChange={(checked) => setIsHomeTeam(checked as boolean)}
                  />
                  <Label htmlFor="isHomeTeam">Home Team</Label>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="homeTeamScore">{isHomeTeam ? 'Your' : 'Opponent'} Score</Label>
                    <Input
                      type="number"
                      id="homeTeamScore"
                      min={0}
                      max={5}
                      value={homeTeamScore}
                      onChange={(e) => setHomeTeamScore(parseInt(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="awayTeamScore">{!isHomeTeam ? 'Your' : 'Opponent'} Score</Label>
                    <Input
                      type="number"
                      id="awayTeamScore"
                      min={0}
                      max={5}
                      value={awayTeamScore}
                      onChange={(e) => setAwayTeamScore(parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
                
                {/* Point calculator */}
                {selectedTeamId && opponentSchoolId && (
                  <MatchPointsCalculator
                    opponentRank={opponentRank}
                    isLeagueMatch={isLeagueMatch}
                    isHomeTeam={isHomeTeam}
                  />
                )}
                
                {!isLeagueMatch && (
                  <Alert>
                    <AlertTitle>Non-league match</AlertTitle>
                    <AlertDescription>
                      Non-league matches count at 50% value for rankings.
                    </AlertDescription>
                  </Alert>
                )}
                
                {!isHomeTeam && (
                  <Alert className="bg-green-50 text-green-800 border-green-200">
                    <AlertTitle>Away match bonus</AlertTitle>
                    <AlertDescription>
                      Away wins receive a 10% bonus in the ITA ranking system.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              
              {/* Right column - flights */}
              <div className="space-y-4">
                <div>
                  <Label className="block mb-2">Flights Won by {teamSchool?.name}</Label>
                  <div className="space-y-3 border p-4 rounded-md">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="singles1"
                        checked={flightsWon.singles1}
                        onCheckedChange={() => handleFlightToggle('singles1')}
                      />
                      <Label htmlFor="singles1">1st Singles</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="singles2"
                        checked={flightsWon.singles2}
                        onCheckedChange={() => handleFlightToggle('singles2')}
                      />
                      <Label htmlFor="singles2">2nd Singles</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="singles3"
                        checked={flightsWon.singles3}
                        onCheckedChange={() => handleFlightToggle('singles3')}
                      />
                      <Label htmlFor="singles3">3rd Singles</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="doubles1"
                        checked={flightsWon.doubles1}
                        onCheckedChange={() => handleFlightToggle('doubles1')}
                      />
                      <Label htmlFor="doubles1">1st Doubles</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="doubles2"
                        checked={flightsWon.doubles2}
                        onCheckedChange={() => handleFlightToggle('doubles2')}
                      />
                      <Label htmlFor="doubles2">2nd Doubles</Label>
                    </div>
                  </div>
                </div>
                
                <Button type="submit" className="w-full">Record Match</Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MatchEntry;
