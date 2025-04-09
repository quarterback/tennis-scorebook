import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { Match, Flight, Set } from '@/types';
import MatchTabContent from '@/components/matches/MatchTabContent';
import MatchForm from '@/components/matches/MatchForm';
import useMatchFunctions from '@/hooks/useMatchFunctions';

const Matches = () => {
  const { schools, teams, players, matches, addMatch, updateMatch } = useData();
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
  
  const {
    matchFormData,
    setMatchFormData,
    handleFlightPlayerChange,
    handleSetScoreChange,
    handleTiebreakScoreChange,
    toggleTiebreak,
    addSet,
    removeSet,
    calculateTeamWinner,
    resetMatchForm
  } = useMatchFunctions(initialFlights);

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
    
    resetMatchForm(today);
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
  
  const canEditMatch = (match: Match) => {
    if (user?.role === 'admin') return true;
    if (user?.role === 'coach' && user.schoolId) {
      const homeTeam = teams.find(t => t.id === match.homeTeamId);
      const awayTeam = teams.find(t => t.id === match.awayTeamId);
      return homeTeam?.schoolId === user.schoolId || awayTeam?.schoolId === user.schoolId;
    }
    return false;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Matches</h1>
        
        <Button 
          className="bg-tennis-blue hover:bg-tennis-darkBlue"
          onClick={() => {
            resetMatchForm(today);
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
        
        {(['upcoming', 'completed', 'all'] as const).map((tabValue) => (
          <MatchTabContent
            key={tabValue}
            tabValue={tabValue}
            matches={filteredMatches}
            expandedMatchId={expandedMatchId}
            setExpandedMatchId={setExpandedMatchId}
            getTeamName={getTeamName}
            canEditMatch={canEditMatch}
            openEditDialog={openEditDialog}
            players={players}
          />
        ))}
      </Tabs>
      
      {/* Add Match Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="w-full max-w-5xl">
          <DialogHeader>
            <DialogTitle>Add New Match</DialogTitle>
          </DialogHeader>
          
          <MatchForm
            matchFormData={matchFormData}
            setMatchFormData={setMatchFormData}
            schools={schools}
            teams={teams}
            filteredTeams={filteredTeams}
            getTeamPlayersForSelect={getTeamPlayersForSelect}
            handleFlightPlayerChange={handleFlightPlayerChange}
            handleSetScoreChange={handleSetScoreChange}
            handleTiebreakScoreChange={handleTiebreakScoreChange}
            toggleTiebreak={toggleTiebreak}
            addSet={addSet}
            removeSet={removeSet}
            calculateTeamWinner={calculateTeamWinner}
            onSubmit={handleAddMatchSubmit}
            onCancel={() => setIsAddDialogOpen(false)}
            submitButtonText="Save Match"
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Match Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-full max-w-5xl">
          <DialogHeader>
            <DialogTitle>Edit Match</DialogTitle>
          </DialogHeader>
          
          <MatchForm
            matchFormData={matchFormData}
            setMatchFormData={setMatchFormData}
            schools={schools}
            teams={teams}
            filteredTeams={filteredTeams}
            getTeamPlayersForSelect={getTeamPlayersForSelect}
            handleFlightPlayerChange={handleFlightPlayerChange}
            handleSetScoreChange={handleSetScoreChange}
            handleTiebreakScoreChange={handleTiebreakScoreChange}
            toggleTiebreak={toggleTiebreak}
            addSet={addSet}
            removeSet={removeSet}
            calculateTeamWinner={calculateTeamWinner}
            onSubmit={handleEditMatchSubmit}
            onCancel={() => {
              setIsEditDialogOpen(false);
              setSelectedMatch(null);
            }}
            submitButtonText="Update Match"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Matches;
