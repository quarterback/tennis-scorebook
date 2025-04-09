
import React from 'react';
import { Match, Flight, Set, Team, School } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import FlightForm from './FlightForm';

interface MatchFormProps {
  matchFormData: {
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
  };
  setMatchFormData: React.Dispatch<React.SetStateAction<any>>;
  schools: School[];
  teams: Team[];
  filteredTeams: Team[];
  getTeamPlayersForSelect: (teamId: string) => { id: string; name: string }[];
  handleFlightPlayerChange: (flightIndex: number, team: 'home' | 'away', playerIndex: number, playerId: string) => void;
  handleSetScoreChange: (flightIndex: number, setIndex: number, team: 'home' | 'away', score: number) => void;
  handleTiebreakScoreChange: (flightIndex: number, setIndex: number, team: 'home' | 'away', score: number) => void;
  toggleTiebreak: (flightIndex: number, setIndex: number) => void;
  addSet: (flightIndex: number) => void;
  removeSet: (flightIndex: number, setIndex: number) => void;
  calculateTeamWinner: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  submitButtonText: string;
}

const MatchForm: React.FC<MatchFormProps> = ({
  matchFormData,
  setMatchFormData,
  schools,
  teams,
  filteredTeams,
  getTeamPlayersForSelect,
  handleFlightPlayerChange,
  handleSetScoreChange,
  handleTiebreakScoreChange,
  toggleTiebreak,
  addSet,
  removeSet,
  calculateTeamWinner,
  onSubmit,
  onCancel,
  submitButtonText
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 pt-4">
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
                        <FlightForm
                          key={`${flight.type}-${flight.position}-${flight.level}`}
                          flight={flight}
                          flightIndex={actualIndex}
                          homeTeamPlayers={getTeamPlayersForSelect(matchFormData.homeTeamId)}
                          awayTeamPlayers={getTeamPlayersForSelect(matchFormData.awayTeamId)}
                          onPlayerChange={handleFlightPlayerChange}
                          onSetScoreChange={handleSetScoreChange}
                          onTiebreakScoreChange={handleTiebreakScoreChange}
                          toggleTiebreak={toggleTiebreak}
                          addSet={addSet}
                          removeSet={removeSet}
                        />
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
                        <FlightForm
                          key={`${flight.type}-${flight.position}-${flight.level}`}
                          flight={flight}
                          flightIndex={actualIndex}
                          homeTeamPlayers={getTeamPlayersForSelect(matchFormData.homeTeamId)}
                          awayTeamPlayers={getTeamPlayersForSelect(matchFormData.awayTeamId)}
                          onPlayerChange={handleFlightPlayerChange}
                          onSetScoreChange={handleSetScoreChange}
                          onTiebreakScoreChange={handleTiebreakScoreChange}
                          toggleTiebreak={toggleTiebreak}
                          addSet={addSet}
                          removeSet={removeSet}
                        />
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
                        <FlightForm
                          key={`${flight.type}-${flight.position}-${flight.level}`}
                          flight={flight}
                          flightIndex={actualIndex}
                          homeTeamPlayers={getTeamPlayersForSelect(matchFormData.homeTeamId)}
                          awayTeamPlayers={getTeamPlayersForSelect(matchFormData.awayTeamId)}
                          onPlayerChange={handleFlightPlayerChange}
                          onSetScoreChange={handleSetScoreChange}
                          onTiebreakScoreChange={handleTiebreakScoreChange}
                          toggleTiebreak={toggleTiebreak}
                          addSet={addSet}
                          removeSet={removeSet}
                        />
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
                        <FlightForm
                          key={`${flight.type}-${flight.position}-${flight.level}`}
                          flight={flight}
                          flightIndex={actualIndex}
                          homeTeamPlayers={getTeamPlayersForSelect(matchFormData.homeTeamId)}
                          awayTeamPlayers={getTeamPlayersForSelect(matchFormData.awayTeamId)}
                          onPlayerChange={handleFlightPlayerChange}
                          onSetScoreChange={handleSetScoreChange}
                          onTiebreakScoreChange={handleTiebreakScoreChange}
                          toggleTiebreak={toggleTiebreak}
                          addSet={addSet}
                          removeSet={removeSet}
                        />
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
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit" className="bg-tennis-blue hover:bg-tennis-darkBlue">
          {submitButtonText}
        </Button>
      </div>
    </form>
  );
};

export default MatchForm;
