
import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Check, Plus, X, Edit, ChevronDown, ChevronUp } from 'lucide-react';
import { Match, Flight, Set, School, Team, Player } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';

const Matches = () => {
  const { schools, teams, players, matches, addMatch, updateMatch, deleteMatch } = useData();
  const { user } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);
  
  const today = new Date().toISOString().split('T')[0];
  
  const initialFlights: {
    type: 'singles' | 'doubles';
    position: number;
    level: 'varsity' | 'jv';
    homePlayers: string[];
    awayPlayers: string[];
    sets: Set[];
  }[] = [
    { type: 'singles', position: 1, level: 'varsity', homePlayers: [], awayPlayers: [], sets: [{ homeScore: 0, awayScore: 0 }] },
    { type: 'singles', position: 2, level: 'varsity', homePlayers: [], awayPlayers: [], sets: [{ homeScore: 0, awayScore: 0 }] },
    { type: 'singles', position: 3, level: 'varsity', homePlayers: [], awayPlayers: [], sets: [{ homeScore: 0, awayScore: 0 }] },
    { type: 'doubles', position: 1, level: 'varsity', homePlayers: [], awayPlayers: [], sets: [{ homeScore: 0, awayScore: 0 }] },
    { type: 'doubles', position: 2, level: 'varsity', homePlayers: [], awayPlayers: [], sets: [{ homeScore: 0, awayScore: 0 }] },
    { type: 'singles', position: 1, level: 'jv', homePlayers: [], awayPlayers: [], sets: [{ homeScore: 0, awayScore: 0 }] },
    { type: 'singles', position: 2, level: 'jv', homePlayers: [], awayPlayers: [], sets: [{ homeScore: 0, awayScore: 0 }] },
    { type: 'doubles', position: 1, level: 'jv', homePlayers: [], awayPlayers: [], sets: [{ homeScore: 0, awayScore: 0 }] }
  ];
  
  const emptyFlight = (matchId: string, type: 'singles' | 'doubles', position: number, level: 'varsity' | 'jv'): Flight => ({
    id: crypto.randomUUID(),
    matchId,
    type,
    position,
    level,
    homePlayers: [],
    awayPlayers: [],
    sets: [{ homeScore: 0, awayScore: 0 }]
  });
  
  const [matchFormData, setMatchFormData] = useState<{
    date: string;
    homeTeamId: string;
    awayTeamId: string;
    isLeagueMatch: boolean;
    isComplete: boolean;
    homeTeamWon?: boolean;
    flights: Array<{
      type: 'singles' | 'doubles';
      position: number;
      level: 'varsity' | 'jv';
      homePlayers: string[];
      awayPlayers: string[];
      sets: Set[];
      homePlayerWon?: boolean;
    }>;
  }>({
    date: today,
    homeTeamId: '',
    awayTeamId: '',
    isLeagueMatch: true,
    isComplete: false,
    flights: initialFlights
  });

  // Filter matches if coach
  const filteredMatches = user?.role === 'coach' && user.schoolId
    ? matches.filter(match => {
        const homeTeam = teams.find(t => t.id === match.homeTeamId);
        const awayTeam = teams.find(t => t.id === match.awayTeamId);
        return homeTeam?.schoolId === user.schoolId || awayTeam?.schoolId === user.schoolId;
      })
    : matches;
  
  // Filter teams based on user role
  const filteredTeams = user?.role === 'coach' && user.schoolId
    ? teams.filter(team => team.schoolId === user.schoolId)
    : teams;
  
  const getTeamName = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return 'Unknown Team';
    
    const school = schools.find(s => s.id === team.schoolId);
    return `${school?.name || 'Unknown'} ${team.gender}`;
  };
  
  const getTeamPlayersForSelect = (teamId: string) => {
    if (!teamId) return [];
    
    return players
      .filter(p => p.teamId === teamId)
      .map(p => ({ id: p.id, name: p.name }));
  };
  
  const handleAddMatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create flights based on form data
    const newMatchId = crypto.randomUUID();
    
    const newFlights = matchFormData.flights.map(flight => ({
      ...flight,
      id: crypto.randomUUID(),
      matchId: newMatchId
    }));
    
    addMatch({
      date: matchFormData.date,
      homeTeamId: matchFormData.homeTeamId,
      awayTeamId: matchFormData.awayTeamId,
      isLeagueMatch: matchFormData.isLeagueMatch,
      isComplete: matchFormData.isComplete,
      homeTeamWon: matchFormData.homeTeamWon,
      flights: newFlights
    });
    
    resetMatchForm();
    setIsAddDialogOpen(false);
  };
  
  const handleEditMatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedMatch) {
      // Update with form data, but keep existing IDs
      const updatedFlights = matchFormData.flights.map((formFlight, index) => {
        const existingFlight = selectedMatch.flights.find(
          f => f.type === formFlight.type && 
              f.position === formFlight.position && 
              f.level === formFlight.level
        );
        
        return {
          ...formFlight,
          id: existingFlight?.id || crypto.randomUUID(),
          matchId: selectedMatch.id
        };
      });
      
      updateMatch({
        ...selectedMatch,
        date: matchFormData.date,
        homeTeamId: matchFormData.homeTeamId,
        awayTeamId: matchFormData.awayTeamId,
        isLeagueMatch: matchFormData.isLeagueMatch,
        isComplete: matchFormData.isComplete,
        homeTeamWon: matchFormData.homeTeamWon,
        flights: updatedFlights
      });
      
      setIsEditDialogOpen(false);
      setSelectedMatch(null);
    }
  };
  
  const openEditDialog = (match: Match) => {
    setSelectedMatch(match);
    
    // Initialize form with match data
    setMatchFormData({
      date: match.date,
      homeTeamId: match.homeTeamId,
      awayTeamId: match.awayTeamId,
      isLeagueMatch: match.isLeagueMatch,
      isComplete: match.isComplete,
      homeTeamWon: match.homeTeamWon,
      flights: match.flights.map(flight => ({
        type: flight.type,
        position: flight.position,
        level: flight.level,
        homePlayers: flight.homePlayers,
        awayPlayers: flight.awayPlayers,
        sets: flight.sets,
        homePlayerWon: flight.homePlayerWon
      }))
    });
    
    setIsEditDialogOpen(true);
  };
  
  const resetMatchForm = () => {
    setMatchFormData({
      date: today,
      homeTeamId: '',
      awayTeamId: '',
      isLeagueMatch: true,
      isComplete: false,
      flights: initialFlights.map(f => ({
        ...f,
        homePlayers: [],
        awayPlayers: [],
        sets: [{ homeScore: 0, awayScore: 0 }]
      }))
    });
  };
  
  const canEditMatch = (match: Match) => {
    if (user?.role === 'admin') return true;
    if (user?.role === 'coach' && user.schoolId) {
      const homeTeam = teams.find(t => t.id === match.homeTeamId);
      const awayTeam = teams.find(t => t.id === match.awayTeamId);
      return homeTeam?.schoolId === user.schoolId || awayTeam?.schoolId === user.schoolId;
    }
    return false;
  };
  
  const handleFlightPlayerChange = (
    flightIndex: number, 
    team: 'home' | 'away', 
    playerIndex: number, 
    playerId: string
  ) => {
    setMatchFormData(prev => {
      const newFlights = [...prev.flights];
      
      if (!newFlights[flightIndex][team === 'home' ? 'homePlayers' : 'awayPlayers']) {
        newFlights[flightIndex][team === 'home' ? 'homePlayers' : 'awayPlayers'] = [];
      }
      
      const players = [...newFlights[flightIndex][team === 'home' ? 'homePlayers' : 'awayPlayers']];
      players[playerIndex] = playerId;
      
      newFlights[flightIndex][team === 'home' ? 'homePlayers' : 'awayPlayers'] = players;
      
      return { ...prev, flights: newFlights };
    });
  };
  
  const handleSetScoreChange = (
    flightIndex: number,
    setIndex: number,
    team: 'home' | 'away',
    score: number
  ) => {
    setMatchFormData(prev => {
      const newFlights = [...prev.flights];
      
      if (!newFlights[flightIndex].sets[setIndex]) {
        newFlights[flightIndex].sets[setIndex] = { homeScore: 0, awayScore: 0 };
      }
      
      newFlights[flightIndex].sets[setIndex] = {
        ...newFlights[flightIndex].sets[setIndex],
        [team === 'home' ? 'homeScore' : 'awayScore']: score
      };
      
      // Calculate if home player won based on sets
      const sets = newFlights[flightIndex].sets;
      let homeWins = 0;
      let awayWins = 0;
      
      sets.forEach(set => {
        if (set.homeScore > set.awayScore) homeWins++;
        else if (set.homeScore < set.awayScore) awayWins++;
      });
      
      newFlights[flightIndex].homePlayerWon = homeWins > awayWins;
      
      return { ...prev, flights: newFlights };
    });
  };
  
  const handleTiebreakScoreChange = (
    flightIndex: number,
    setIndex: number,
    team: 'home' | 'away',
    score: number
  ) => {
    setMatchFormData(prev => {
      const newFlights = [...prev.flights];
      
      if (!newFlights[flightIndex].sets[setIndex].tiebreak) {
        newFlights[flightIndex].sets[setIndex].tiebreak = { homeScore: 0, awayScore: 0 };
      }
      
      if (newFlights[flightIndex].sets[setIndex].tiebreak) {
        newFlights[flightIndex].sets[setIndex].tiebreak = {
          ...newFlights[flightIndex].sets[setIndex].tiebreak!,
          [team === 'home' ? 'homeScore' : 'awayScore']: score
        };
      }
      
      return { ...prev, flights: newFlights };
    });
  };
  
  const toggleTiebreak = (flightIndex: number, setIndex: number) => {
    setMatchFormData(prev => {
      const newFlights = [...prev.flights];
      
      if (newFlights[flightIndex].sets[setIndex].tiebreak) {
        delete newFlights[flightIndex].sets[setIndex].tiebreak;
      } else {
        newFlights[flightIndex].sets[setIndex].tiebreak = { homeScore: 0, awayScore: 0 };
      }
      
      return { ...prev, flights: newFlights };
    });
  };
  
  const addSet = (flightIndex: number) => {
    setMatchFormData(prev => {
      const newFlights = [...prev.flights];
      newFlights[flightIndex].sets.push({ homeScore: 0, awayScore: 0 });
      return { ...prev, flights: newFlights };
    });
  };
  
  const removeSet = (flightIndex: number, setIndex: number) => {
    setMatchFormData(prev => {
      const newFlights = [...prev.flights];
      if (newFlights[flightIndex].sets.length > 1) {
        newFlights[flightIndex].sets.splice(setIndex, 1);
      }
      return { ...prev, flights: newFlights };
    });
  };
  
  const calculateTeamWinner = () => {
    const varsityFlights = matchFormData.flights.filter(f => f.level === 'varsity');
    const homeWins = varsityFlights.filter(f => f.homePlayerWon).length;
    const awayWins = varsityFlights.filter(f => f.homePlayerWon === false).length;
    
    if (homeWins > awayWins) {
      setMatchFormData(prev => ({ ...prev, homeTeamWon: true }));
    } else if (awayWins > homeWins) {
      setMatchFormData(prev => ({ ...prev, homeTeamWon: false }));
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Matches</h1>
        
        <Button 
          className="bg-tennis-blue hover:bg-tennis-darkBlue"
          onClick={() => {
            resetMatchForm();
            setIsAddDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Match
        </Button>
      </div>
      
      <Tabs defaultValue="upcoming">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="all">All Matches</TabsTrigger>
        </TabsList>
        
        {['upcoming', 'completed', 'all'].map((tabValue) => (
          <TabsContent key={tabValue} value={tabValue} className="space-y-4">
            {filteredMatches
              .filter(match => {
                if (tabValue === 'all') return true;
                if (tabValue === 'upcoming') return !match.isComplete;
                return match.isComplete;
              })
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map((match) => (
                <Card key={match.id} className="overflow-hidden">
                  <CardHeader className="pb-4 cursor-pointer" onClick={() => setExpandedMatchId(expandedMatchId === match.id ? null : match.id)}>
                    <div className="flex justify-between">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5 text-tennis-blue" />
                        <span className="font-medium">
                          {new Date(match.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${match.isLeagueMatch ? 'bg-tennis-blue text-white' : 'bg-gray-200'}`}>
                          {match.isLeagueMatch ? 'League' : 'Non-League'}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {match.isComplete && (
                          <span className="flex items-center text-green-600">
                            <Check className="h-4 w-4 mr-1" />
                            Complete
                          </span>
                        )}
                        
                        {expandedMatchId === match.id ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex-1">
                        <div className="font-semibold">{getTeamName(match.homeTeamId)}</div>
                        <div className="text-gray-500">Home</div>
                      </div>
                      
                      <div className="px-4 font-bold text-lg">vs.</div>
                      
                      <div className="flex-1 text-right">
                        <div className="font-semibold">{getTeamName(match.awayTeamId)}</div>
                        <div className="text-gray-500">Away</div>
                      </div>
                    </div>
                    
                    {match.isComplete && match.homeTeamWon !== undefined && (
                      <div className="text-center mt-2 font-medium">
                        Winner: {match.homeTeamWon ? getTeamName(match.homeTeamId) : getTeamName(match.awayTeamId)}
                      </div>
                    )}
                  </CardHeader>
                  
                  {expandedMatchId === match.id && (
                    <CardContent>
                      <div className="border-t border-gray-100 pt-4">
                        <h3 className="font-semibold mb-3">Match Results</h3>
                        
                        <div className="space-y-6">
                          {match.flights.length > 0 ? (
                            <>
                              <div>
                                <h4 className="text-sm font-medium mb-2 bg-tennis-blue text-white px-3 py-1">Varsity</h4>
                                <div className="space-y-3">
                                  {match.flights
                                    .filter(f => f.level === 'varsity')
                                    .sort((a, b) => {
                                      if (a.type !== b.type) {
                                        return a.type === 'singles' ? -1 : 1;
                                      }
                                      return a.position - b.position;
                                    })
                                    .map((flight, i) => (
                                      <div key={flight.id} className="tennis-card">
                                        <div className="font-medium mb-1">
                                          {flight.type === 'singles' ? `#${flight.position} Singles` : `#${flight.position} Doubles`}
                                          {flight.homePlayerWon !== undefined && (
                                            <span className="ml-2">
                                              {flight.homePlayerWon ? (
                                                <span className="text-green-600">(Home Won)</span>
                                              ) : (
                                                <span className="text-red-600">(Away Won)</span>
                                              )}
                                            </span>
                                          )}
                                        </div>
                                        
                                        <div className="flex justify-between items-center text-sm">
                                          <div className="flex-1">
                                            <div className="font-medium">Home:</div>
                                            {flight.homePlayers.map(playerId => {
                                              const player = players.find(p => p.id === playerId);
                                              return player ? (
                                                <div key={player.id}>{player.name}</div>
                                              ) : (
                                                <div key={playerId}>Unknown Player</div>
                                              );
                                            })}
                                          </div>
                                          
                                          <div className="flex-1 text-right">
                                            <div className="font-medium">Away:</div>
                                            {flight.awayPlayers.map(playerId => {
                                              const player = players.find(p => p.id === playerId);
                                              return player ? (
                                                <div key={player.id}>{player.name}</div>
                                              ) : (
                                                <div key={playerId}>Unknown Player</div>
                                              );
                                            })}
                                          </div>
                                        </div>
                                        
                                        <div className="mt-2 pt-2 border-t border-gray-100">
                                          <div className="flex space-x-4">
                                            {flight.sets.map((set, setIdx) => (
                                              <div key={setIdx} className="flex space-x-1">
                                                <div className="text-center">
                                                  <div className="text-xs text-gray-500">Set {setIdx + 1}</div>
                                                  <div className="font-medium">{set.homeScore}-{set.awayScore}</div>
                                                  {set.tiebreak && (
                                                    <div className="text-xs text-gray-500">
                                                      TB: {set.tiebreak.homeScore}-{set.tiebreak.awayScore}
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              </div>
                              
                              {match.flights.some(f => f.level === 'jv') && (
                                <div>
                                  <h4 className="text-sm font-medium mb-2 bg-tennis-green text-white px-3 py-1">JV</h4>
                                  <div className="space-y-3">
                                    {match.flights
                                      .filter(f => f.level === 'jv')
                                      .sort((a, b) => {
                                        if (a.type !== b.type) {
                                          return a.type === 'singles' ? -1 : 1;
                                        }
                                        return a.position - b.position;
                                      })
                                      .map((flight) => (
                                        <div key={flight.id} className="tennis-card">
                                          <div className="font-medium mb-1">
                                            {flight.type === 'singles' ? `#${flight.position} Singles` : `#${flight.position} Doubles`}
                                            {flight.homePlayerWon !== undefined && (
                                              <span className="ml-2">
                                                {flight.homePlayerWon ? (
                                                  <span className="text-green-600">(Home Won)</span>
                                                ) : (
                                                  <span className="text-red-600">(Away Won)</span>
                                                )}
                                              </span>
                                            )}
                                          </div>
                                          
                                          <div className="flex justify-between items-center text-sm">
                                            <div className="flex-1">
                                              <div className="font-medium">Home:</div>
                                              {flight.homePlayers.map(playerId => {
                                                const player = players.find(p => p.id === playerId);
                                                return player ? (
                                                  <div key={player.id}>{player.name}</div>
                                                ) : (
                                                  <div key={playerId}>Unknown Player</div>
                                                );
                                              })}
                                            </div>
                                            
                                            <div className="flex-1 text-right">
                                              <div className="font-medium">Away:</div>
                                              {flight.awayPlayers.map(playerId => {
                                                const player = players.find(p => p.id === playerId);
                                                return player ? (
                                                  <div key={player.id}>{player.name}</div>
                                                ) : (
                                                  <div key={playerId}>Unknown Player</div>
                                                );
                                              })}
                                            </div>
                                          </div>
                                          
                                          <div className="mt-2 pt-2 border-t border-gray-100">
                                            <div className="flex space-x-4">
                                              {flight.sets.map((set, setIdx) => (
                                                <div key={setIdx} className="flex space-x-1">
                                                  <div className="text-center">
                                                    <div className="text-xs text-gray-500">Set {setIdx + 1}</div>
                                                    <div className="font-medium">{set.homeScore}-{set.awayScore}</div>
                                                    {set.tiebreak && (
                                                      <div className="text-xs text-gray-500">
                                                        TB: {set.tiebreak.homeScore}-{set.tiebreak.awayScore}
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="text-center text-gray-500 py-4">
                              No flight information available
                            </div>
                          )}
                        </div>
                        
                        {canEditMatch(match) && (
                          <div className="mt-6 flex justify-end">
                            <Button 
                              onClick={() => openEditDialog(match)}
                              className="bg-tennis-blue hover:bg-tennis-darkBlue"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Match
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            
            {filteredMatches.filter(match => {
              if (tabValue === 'all') return true;
              if (tabValue === 'upcoming') return !match.isComplete;
              return match.isComplete;
            }).length === 0 && (
              <div className="text-center text-gray-500 py-10">
                No {tabValue === 'upcoming' ? 'upcoming' : tabValue === 'completed' ? 'completed' : ''} matches found
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
      
      {/* Add Match Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="w-full max-w-5xl">
          <DialogHeader>
            <DialogTitle>Add New Match</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleAddMatchSubmit} className="space-y-4 pt-4">
            <ScrollArea className="h-[70vh] pr-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="match-date">Match Date</Label>
                  <Input
                    id="match-date"
                    type="date"
                    value={matchFormData.date}
                    onChange={(e) => setMatchFormData({ ...matchFormData, date: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={matchFormData.isLeagueMatch}
                        onCheckedChange={(checked) => 
                          setMatchFormData({ ...matchFormData, isLeagueMatch: checked as boolean })
                        }
                      />
                      <span>League Match</span>
                    </div>
                  </Label>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="home-team">Home Team</Label>
                  <Select
                    value={matchFormData.homeTeamId}
                    onValueChange={(value) => setMatchFormData({ ...matchFormData, homeTeamId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select home team" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredTeams.map((team) => {
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
                  <Label htmlFor="away-team">Away Team</Label>
                  <Select
                    value={matchFormData.awayTeamId}
                    onValueChange={(value) => setMatchFormData({ ...matchFormData, awayTeamId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select away team" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team) => {
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
                  <Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={matchFormData.isComplete}
                        onCheckedChange={(checked) => 
                          setMatchFormData({ ...matchFormData, isComplete: checked as boolean })
                        }
                      />
                      <span>Match Complete</span>
                    </div>
                  </Label>
                </div>
                
                {matchFormData.isComplete && (
                  <div className="space-y-2">
                    <Label>
                      <div className="flex items-center space-x-2">
                        <span>Winner:</span>
                      </div>
                    </Label>
                    <div className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={matchFormData.homeTeamWon === true}
                          onCheckedChange={(checked) => 
                            setMatchFormData({ ...matchFormData, homeTeamWon: checked ? true : undefined })
                          }
                        />
                        <span>Home Team</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={matchFormData.homeTeamWon === false}
                          onCheckedChange={(checked) => 
                            setMatchFormData({ ...matchFormData, homeTeamWon: checked ? false : undefined })
                          }
                        />
                        <span>Away Team</span>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={calculateTeamWinner}
                      >
                        Calculate from Flights
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Flights Section */}
              <div className="space-y-6 mb-6">
                <h3 className="font-semibold text-lg">Match Lineup</h3>
                
                <div>
                  <h4 className="text-sm font-medium mb-4 bg-tennis-blue text-white px-3 py-1">Varsity</h4>
                  <div className="space-y-6">
                    {/* Singles Flights */}
                    <div>
                      <h5 className="text-sm font-medium mb-2">Singles</h5>
                      <div className="space-y-4">
                        {matchFormData.flights
                          .filter(f => f.level === 'varsity' && f.type === 'singles')
                          .sort((a, b) => a.position - b.position)
                          .map((flight, flightIndex) => {
                            const actualIndex = matchFormData.flights.findIndex(
                              f => f.type === flight.type && f.position === flight.position && f.level === flight.level
                            );
                            
                            return (
                              <div key={`${flight.type}-${flight.position}-${flight.level}`} className="border rounded-md p-4">
                                <div className="flex justify-between items-center mb-3">
                                  <h6 className="font-medium">#{flight.position} Singles</h6>
                                  
                                  {flight.homePlayerWon !== undefined && (
                                    <div className="text-sm">
                                      Winner: {flight.homePlayerWon ? 'Home' : 'Away'}
                                    </div>
                                  )}
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <Label className="mb-1 block">Home Player</Label>
                                    <Select
                                      value={flight.homePlayers[0] || ''}
                                      onValueChange={(value) => handleFlightPlayerChange(actualIndex, 'home', 0, value)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select player" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {getTeamPlayersForSelect(matchFormData.homeTeamId).map((player) => (
                                          <SelectItem key={player.id} value={player.id}>
                                            {player.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  
                                  <div>
                                    <Label className="mb-1 block">Away Player</Label>
                                    <Select
                                      value={flight.awayPlayers[0] || ''}
                                      onValueChange={(value) => handleFlightPlayerChange(actualIndex, 'away', 0, value)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select player" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {getTeamPlayersForSelect(matchFormData.awayTeamId).map((player) => (
                                          <SelectItem key={player.id} value={player.id}>
                                            {player.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                
                                <div className="space-y-3">
                                  <h6 className="text-sm font-medium">Sets</h6>
                                  {flight.sets.map((set, setIndex) => (
                                    <div key={setIndex} className="flex items-center gap-4">
                                      <div className="text-sm">Set {setIndex + 1}</div>
                                      
                                      <div className="flex items-center gap-2">
                                        <Input
                                          type="number"
                                          min="0"
                                          className="w-16"
                                          value={set.homeScore}
                                          onChange={(e) => handleSetScoreChange(actualIndex, setIndex, 'home', parseInt(e.target.value) || 0)}
                                        />
                                        <span>-</span>
                                        <Input
                                          type="number"
                                          min="0"
                                          className="w-16"
                                          value={set.awayScore}
                                          onChange={(e) => handleSetScoreChange(actualIndex, setIndex, 'away', parseInt(e.target.value) || 0)}
                                        />
                                      </div>
                                      
                                      <div className="flex items-center gap-2">
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="icon"
                                          className="h-7 w-7"
                                          onClick={() => toggleTiebreak(actualIndex, setIndex)}
                                        >
                                          {set.tiebreak ? <X className="h-3 w-3" /> : 'TB'}
                                        </Button>
                                        
                                        {set.tiebreak && (
                                          <div className="flex items-center gap-1">
                                            <Input
                                              type="number"
                                              min="0"
                                              className="w-12 h-7"
                                              value={set.tiebreak.homeScore}
                                              onChange={(e) => handleTiebreakScoreChange(actualIndex, setIndex, 'home', parseInt(e.target.value) || 0)}
                                            />
                                            <span>-</span>
                                            <Input
                                              type="number"
                                              min="0"
                                              className="w-12 h-7"
                                              value={set.tiebreak.awayScore}
                                              onChange={(e) => handleTiebreakScoreChange(actualIndex, setIndex, 'away', parseInt(e.target.value) || 0)}
                                            />
                                          </div>
                                        )}
                                      </div>
                                      
                                      <div className="flex-1 flex justify-end">
                                        {flight.sets.length > 1 && (
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={() => removeSet(actualIndex, setIndex)}
                                          >
                                            <X className="h-3 w-3" />
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                  
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addSet(actualIndex)}
                                  >
                                    Add Set
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                    
                    {/* Doubles Flights */}
                    <div>
                      <h5 className="text-sm font-medium mb-2">Doubles</h5>
                      <div className="space-y-4">
                        {matchFormData.flights
                          .filter(f => f.level === 'varsity' && f.type === 'doubles')
                          .sort((a, b) => a.position - b.position)
                          .map((flight, flightIndex) => {
                            const actualIndex = matchFormData.flights.findIndex(
                              f => f.type === flight.type && f.position === flight.position && f.level === flight.level
                            );
                            
                            return (
                              <div key={`${flight.type}-${flight.position}-${flight.level}`} className="border rounded-md p-4">
                                <div className="flex justify-between items-center mb-3">
                                  <h6 className="font-medium">#{flight.position} Doubles</h6>
                                  
                                  {flight.homePlayerWon !== undefined && (
                                    <div className="text-sm">
                                      Winner: {flight.homePlayerWon ? 'Home' : 'Away'}
                                    </div>
                                  )}
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                  <div className="space-y-4">
                                    <div>
                                      <Label className="mb-1 block">Home Player 1</Label>
                                      <Select
                                        value={flight.homePlayers[0] || ''}
                                        onValueChange={(value) => handleFlightPlayerChange(actualIndex, 'home', 0, value)}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select player" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {getTeamPlayersForSelect(matchFormData.homeTeamId).map((player) => (
                                            <SelectItem key={player.id} value={player.id}>
                                              {player.name}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    
                                    <div>
                                      <Label className="mb-1 block">Home Player 2</Label>
                                      <Select
                                        value={flight.homePlayers[1] || ''}
                                        onValueChange={(value) => handleFlightPlayerChange(actualIndex, 'home', 1, value)}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select player" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {getTeamPlayersForSelect(matchFormData.homeTeamId).map((player) => (
                                            <SelectItem key={player.id} value={player.id}>
                                              {player.name}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-4">
                                    <div>
                                      <Label className="mb-1 block">Away Player 1</Label>
                                      <Select
                                        value={flight.awayPlayers[0] || ''}
                                        onValueChange={(value) => handleFlightPlayerChange(actualIndex, 'away', 0, value)}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select player" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {getTeamPlayersForSelect(matchFormData.awayTeamId).map((player) => (
                                            <SelectItem key={player.id} value={player.id}>
                                              {player.name}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    
                                    <div>
                                      <Label className="mb-1 block">Away Player 2</Label>
                                      <Select
                                        value={flight.awayPlayers[1] || ''}
                                        onValueChange={(value) => handleFlightPlayerChange(actualIndex, 'away', 1, value)}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select player" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {getTeamPlayersForSelect(matchFormData.awayTeamId).map((player) => (
                                            <SelectItem key={player.id} value={player.id}>
                                              {player.name}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="space-y-3">
                                  <h6 className="text-sm font-medium">Sets</h6>
                                  {flight.sets.map((set, setIndex) => (
                                    <div key={setIndex} className="flex items-center gap-4">
                                      <div className="text-sm">Set {setIndex + 1}</div>
                                      
                                      <div className="flex items-center gap-2">
                                        <Input
                                          type="number"
                                          min="0"
                                          className="w-16"
                                          value={set.homeScore}
                                          onChange={(e) => handleSetScoreChange(actualIndex, setIndex, 'home', parseInt(e.target.value) || 0)}
                                        />
                                        <span>-</span>
                                        <Input
                                          type="number"
                                          min="0"
                                          className="w-16"
                                          value={set.awayScore}
                                          onChange={(e) => handleSetScoreChange(actualIndex, setIndex, 'away', parseInt(e.target.value) || 0)}
                                        />
                                      </div>
                                      
                                      <div className="flex items-center gap-2">
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="icon"
                                          className="h-7 w-7"
                                          onClick={() => toggleTiebreak(actualIndex, setIndex)}
                                        >
                                          {set.tiebreak ? <X className="h-3 w-3" /> : 'TB'}
                                        </Button>
                                        
                                        {set.tiebreak && (
                                          <div className="flex items-center gap-1">
                                            <Input
                                              type="number"
                                              min="0"
                                              className="w-12 h-7"
                                              value={set.tiebreak.homeScore}
                                              onChange={(e) => handleTiebreakScoreChange(actualIndex, setIndex, 'home', parseInt(e.target.value) || 0)}
                                            />
                                            <span>-</span>
                                            <Input
                                              type="number"
                                              min="0"
                                              className="w-12 h-7"
                                              value={set.tiebreak.awayScore}
                                              onChange={(e) => handleTiebreakScoreChange(actualIndex, setIndex, 'away', parseInt(e.target.value) || 0)}
                                            />
                                          </div>
                                        )}
                                      </div>
                                      
                                      <div className="flex-1 flex justify-end">
                                        {flight.sets.length > 1 && (
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={() => removeSet(actualIndex, setIndex)}
                                          >
                                            <X className="h-3 w-3" />
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                  
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addSet(actualIndex)}
                                  >
                                    Add Set
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-4 bg-tennis-green text-white px-3 py-1">JV</h4>
                  <div className="space-y-6">
                    {/* JV Singles Flights */}
                    <div>
                      <h5 className="text-sm font-medium mb-2">Singles</h5>
                      <div className="space-y-4">
                        {matchFormData.flights
                          .filter(f => f.level === 'jv' && f.type === 'singles')
                          .sort((a, b) => a.position - b.position)
                          .map((flight, flightIndex) => {
                            const actualIndex = matchFormData.flights.findIndex(
                              f => f.type === flight.type && f.position === flight.position && f.level === flight.level
                            );
                            
                            return (
                              <div key={`${flight.type}-${flight.position}-${flight.level}`} className="border rounded-md p-4">
                                <div className="flex justify-between items-center mb-3">
                                  <h6 className="font-medium">#{flight.position} Singles</h6>
                                  
                                  {flight.homePlayerWon !== undefined && (
                                    <div className="text-sm">
                                      Winner: {flight.homePlayerWon ? 'Home' : 'Away'}
                                    </div>
                                  )}
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <Label className="mb-1 block">Home Player</Label>
                                    <Select
                                      value={flight.homePlayers[0] || ''}
                                      onValueChange={(value) => handleFlightPlayerChange(actualIndex, 'home', 0, value)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select player" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {getTeamPlayersForSelect(matchFormData.homeTeamId).map((player) => (
                                          <SelectItem key={player.id} value={player.id}>
                                            {player.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  
                                  <div>
                                    <Label className="mb-1 block">Away Player</Label>
                                    <Select
                                      value={flight.awayPlayers[0] || ''}
                                      onValueChange={(value) => handleFlightPlayerChange(actualIndex, 'away', 0, value)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select player" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {getTeamPlayersForSelect(matchFormData.awayTeamId).map((player) => (
                                          <SelectItem key={player.id} value={player.id}>
                                            {player.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                
                                <div className="space-y-3">
                                  <h6 className="text-sm font-medium">Sets</h6>
                                  {flight.sets.map((set, setIndex) => (
                                    <div key={setIndex} className="flex items-center gap-4">
                                      <div className="text-sm">Set {setIndex + 1}</div>
                                      
                                      <div className="flex items-center gap-2">
                                        <Input
                                          type="number"
                                          min="0"
                                          className="w-16"
                                          value={set.homeScore}
                                          onChange={(e) => handleSetScoreChange(actualIndex, setIndex, 'home', parseInt(e.target.value) || 0)}
                                        />
                                        <span>-</span>
                                        <Input
                                          type="number"
                                          min="0"
                                          className="w-16"
                                          value={set.awayScore}
                                          onChange={(e) => handleSetScoreChange(actualIndex, setIndex, 'away', parseInt(e.target.value) || 0)}
                                        />
                                      </div>
                                      
                                      <div className="flex items-center gap-2">
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="icon"
                                          className="h-7 w-7"
                                          onClick={() => toggleTiebreak(actualIndex, setIndex)}
                                        >
                                          {set.tiebreak ? <X className="h-3 w-3" /> : 'TB'}
                                        </Button>
                                        
                                        {set.tiebreak && (
                                          <div className="flex items-center gap-1">
                                            <Input
                                              type="number"
                                              min="0"
                                              className="w-12 h-7"
                                              value={set.tiebreak.homeScore}
                                              onChange={(e) => handleTiebreakScoreChange(actualIndex, setIndex, 'home', parseInt(e.target.value) || 0)}
                                            />
                                            <span>-</span>
                                            <Input
                                              type="number"
                                              min="0"
                                              className="w-12 h-7"
                                              value={set.tiebreak.awayScore}
                                              onChange={(e) => handleTiebreakScoreChange(actualIndex, setIndex, 'away', parseInt(e.target.value) || 0)}
                                            />
                                          </div>
                                        )}
                                      </div>
                                      
                                      <div className="flex-1 flex justify-end">
                                        {flight.sets.length > 1 && (
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={() => removeSet(actualIndex, setIndex)}
                                          >
                                            <X className="h-3 w-3" />
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                  
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addSet(actualIndex)}
                                  >
                                    Add Set
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                    
                    {/* JV Doubles Flights */}
                    <div>
                      <h5 className="text-sm font-medium mb-2">Doubles</h5>
                      <div className="space-y-4">
                        {matchFormData.flights
                          .filter(f => f.level === 'jv' && f.type === 'doubles')
                          .sort((a, b) => a.position - b.position)
                          .map((flight, flightIndex) => {
                            const actualIndex = matchFormData.flights.findIndex(
                              f => f.type === flight.type && f.position === flight.position && f.level === flight.level
                            );
                            
                            return (
                              <div key={`${flight.type}-${flight.position}-${flight.level}`} className="border rounded-md p-4">
                                <div className="flex justify-between items-center mb-3">
                                  <h6 className="font-medium">#{flight.position} Doubles</h6>
                                  
                                  {flight.homePlayerWon !== undefined && (
                                    <div className="text-sm">
                                      Winner: {flight.homePlayerWon ? 'Home' : 'Away'}
                                    </div>
                                  )}
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                  <div className="space-y-4">
                                    <div>
                                      <Label className="mb-1 block">Home Player 1</Label>
                                      <Select
                                        value={flight.homePlayers[0] || ''}
                                        onValueChange={(value) => handleFlightPlayerChange(actualIndex, 'home', 0, value)}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select player" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {getTeamPlayersForSelect(matchFormData.homeTeamId).map((player) => (
                                            <SelectItem key={player.id} value={player.id}>
                                              {player.name}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    
                                    <div>
                                      <Label className="mb-1 block">Home Player 2</Label>
                                      <Select
                                        value={flight.homePlayers[1] || ''}
                                        onValueChange={(value) => handleFlightPlayerChange(actualIndex, 'home', 1, value)}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select player" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {getTeamPlayersForSelect(matchFormData.homeTeamId).map((player) => (
                                            <SelectItem key={player.id} value={player.id}>
                                              {player.name}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-4">
                                    <div>
                                      <Label className="mb-1 block">Away Player 1</Label>
                                      <Select
                                        value={flight.awayPlayers[0] || ''}
                                        onValueChange={(value) => handleFlightPlayerChange(actualIndex, 'away', 0, value)}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select player" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {getTeamPlayersForSelect(matchFormData.awayTeamId).map((player) => (
                                            <SelectItem key={player.id} value={player.id}>
                                              {player.name}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    
                                    <div>
                                      <Label className="mb-1 block">Away Player 2</Label>
                                      <Select
                                        value={flight.awayPlayers[1] || ''}
                                        onValueChange={(value) => handleFlightPlayerChange(actualIndex, 'away', 1, value)}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select player" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {getTeamPlayersForSelect(matchFormData.awayTeamId).map((player) => (
                                            <SelectItem key={player.id} value={player.id}>
                                              {player.name}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="space-y-3">
                                  <h6 className="text-sm font-medium">Sets</h6>
                                  {flight.sets.map((set, setIndex) => (
                                    <div key={setIndex} className="flex items-center gap-4">
                                      <div className="text-sm">Set {setIndex + 1}</div>
                                      
                                      <div className="flex items-center gap-2">
                                        <Input
                                          type="number"
                                          min="0"
                                          className="w-16"
                                          value={set.homeScore}
                                          onChange={(e) => handleSetScoreChange(actualIndex, setIndex, 'home', parseInt(e.target.value) || 0)}
                                        />
                                        <span>-</span>
                                        <Input
                                          type="number"
                                          min="0"
                                          className="w-16"
                                          value={set.awayScore}
                                          onChange={(e) => handleSetScoreChange(actualIndex, setIndex, 'away', parseInt(e.target.value) || 0)}
                                        />
                                      </div>
                                      
                                      <div className="flex items-center gap-2">
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="icon"
                                          className="h-7 w-7"
                                          onClick={() => toggleTiebreak(actualIndex, setIndex)}
                                        >
                                          {set.tiebreak ? <X className="h-3 w-3" /> : 'TB'}
                                        </Button>
                                        
                                        {set.tiebreak && (
                                          <div className="flex items-center gap-1">
                                            <Input
                                              type="number"
                                              min="0"
                                              className="w-12 h-7"
                                              value={set.tiebreak.homeScore}
                                              onChange={(e) => handleTiebreakScoreChange(actualIndex, setIndex, 'home', parseInt(e.target.value) || 0)}
                                            />
                                            <span>-</span>
                                            <Input
                                              type="number"
                                              min="0"
                                              className="w-12 h-7"
                                              value={set.tiebreak.awayScore}
                                              onChange={(e) => handleTiebreakScoreChange(actualIndex, setIndex, 'away', parseInt(e.target.value) || 0)}
                                            />
                                          </div>
                                        )}
                                      </div>
                                      
                                      <div className="flex-1 flex justify-end">
                                        {flight.sets.length > 1 && (
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={() => removeSet(actualIndex, setIndex)}
                                          >
                                            <X className="h-3 w-3" />
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                  
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addSet(actualIndex)}
                                  >
                                    Add Set
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
            
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-tennis-blue hover:bg-tennis-darkBlue">
                Save Match
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Match Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-full max-w-5xl">
          <DialogHeader>
            <DialogTitle>Edit Match</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleEditMatchSubmit} className="space-y-4 pt-4">
            <ScrollArea className="h-[70vh] pr-4">
              {/* Same content as Add Match form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Date and League Match checkbox */}
                <div className="space-y-2">
                  <Label htmlFor="match-date-edit">Match Date</Label>
                  <Input
                    id="match-date-edit"
                    type="date"
                    value={matchFormData.date}
                    onChange={(e) => setMatchFormData({ ...matchFormData, date: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={matchFormData.isLeagueMatch}
                        onCheckedChange={(checked) => 
                          setMatchFormData({ ...matchFormData, isLeagueMatch: checked as boolean })
                        }
                      />
                      <span>League Match</span>
                    </div>
                  </Label>
                </div>
                
                {/* Home and Away team selects */}
                <div className="space-y-2">
                  <Label htmlFor="home-team-edit">Home Team</Label>
                  <Select
                    value={matchFormData.homeTeamId}
                    onValueChange={(value) => setMatchFormData({ ...matchFormData, homeTeamId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select home team" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredTeams.map((team) => {
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
                  <Label htmlFor="away-team-edit">Away Team</Label>
                  <Select
                    value={matchFormData.awayTeamId}
                    onValueChange={(value) => setMatchFormData({ ...matchFormData, awayTeamId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select away team" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team) => {
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
                
                {/* Match complete and winner */}
                <div className="space-y-2">
                  <Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={matchFormData.isComplete}
                        onCheckedChange={(checked) => 
                          setMatchFormData({ ...matchFormData, isComplete: checked as boolean })
                        }
                      />
                      <span>Match Complete</span>
                    </div>
                  </Label>
                </div>
                
                {matchFormData.isComplete && (
                  <div className="space-y-2">
                    <Label>
                      <div className="flex items-center space-x-2">
                        <span>Winner:</span>
                      </div>
                    </Label>
                    <div className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={matchFormData.homeTeamWon === true}
                          onCheckedChange={(checked) => 
                            setMatchFormData({ ...matchFormData, homeTeamWon: checked ? true : undefined })
                          }
                        />
                        <span>Home Team</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={matchFormData.homeTeamWon === false}
                          onCheckedChange={(checked) => 
                            setMatchFormData({ ...matchFormData, homeTeamWon: checked ? false : undefined })
                          }
                        />
                        <span>Away Team</span>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={calculateTeamWinner}
                      >
                        Calculate from Flights
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Flights section (same as in Add Match form) */}
              {/* ... */}
            </ScrollArea>
            
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setSelectedMatch(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-tennis-blue hover:bg-tennis-darkBlue">
                Update Match
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Matches;

