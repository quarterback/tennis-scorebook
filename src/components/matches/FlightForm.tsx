
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { Flight, Set, Player } from '@/types';

interface FlightFormProps {
  flight: {
    type: 'singles' | 'doubles';
    position: number;
    level: 'varsity' | 'jv';
    homePlayers: string[];
    awayPlayers: string[];
    sets: Set[];
    homePlayerWon?: boolean;
  };
  flightIndex: number;
  homeTeamPlayers: { id: string; name: string }[];
  awayTeamPlayers: { id: string; name: string }[];
  onPlayerChange: (flightIndex: number, team: 'home' | 'away', playerIndex: number, playerId: string) => void;
  onSetScoreChange: (flightIndex: number, setIndex: number, team: 'home' | 'away', score: number) => void;
  onTiebreakScoreChange: (flightIndex: number, setIndex: number, team: 'home' | 'away', score: number) => void;
  toggleTiebreak: (flightIndex: number, setIndex: number) => void;
  addSet: (flightIndex: number) => void;
  removeSet: (flightIndex: number, setIndex: number) => void;
}

const FlightForm: React.FC<FlightFormProps> = ({
  flight,
  flightIndex,
  homeTeamPlayers,
  awayTeamPlayers,
  onPlayerChange,
  onSetScoreChange,
  onTiebreakScoreChange,
  toggleTiebreak,
  addSet,
  removeSet
}) => {
  const isSingles = flight.type === 'singles';
  
  return (
    <div className="border rounded-md p-4">
      <div className="flex justify-between items-center mb-3">
        <h6 className="font-medium">
          #{flight.position} {isSingles ? 'Singles' : 'Doubles'}
        </h6>
        
        {flight.homePlayerWon !== undefined && (
          <div className="text-sm">
            Winner: {flight.homePlayerWon ? 'Home' : 'Away'}
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {isSingles ? (
          <>
            <div>
              <Label className="mb-1 block">Home Player</Label>
              <Select
                value={flight.homePlayers[0] || ''}
                onValueChange={(value) => onPlayerChange(flightIndex, 'home', 0, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select player" />
                </SelectTrigger>
                <SelectContent>
                  {homeTeamPlayers.map((player) => (
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
                onValueChange={(value) => onPlayerChange(flightIndex, 'away', 0, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select player" />
                </SelectTrigger>
                <SelectContent>
                  {awayTeamPlayers.map((player) => (
                    <SelectItem key={player.id} value={player.id}>
                      {player.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-4">
              <div>
                <Label className="mb-1 block">Home Player 1</Label>
                <Select
                  value={flight.homePlayers[0] || ''}
                  onValueChange={(value) => onPlayerChange(flightIndex, 'home', 0, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select player" />
                  </SelectTrigger>
                  <SelectContent>
                    {homeTeamPlayers.map((player) => (
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
                  onValueChange={(value) => onPlayerChange(flightIndex, 'home', 1, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select player" />
                  </SelectTrigger>
                  <SelectContent>
                    {homeTeamPlayers.map((player) => (
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
                  onValueChange={(value) => onPlayerChange(flightIndex, 'away', 0, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select player" />
                  </SelectTrigger>
                  <SelectContent>
                    {awayTeamPlayers.map((player) => (
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
                  onValueChange={(value) => onPlayerChange(flightIndex, 'away', 1, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select player" />
                  </SelectTrigger>
                  <SelectContent>
                    {awayTeamPlayers.map((player) => (
                      <SelectItem key={player.id} value={player.id}>
                        {player.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        )}
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
                onChange={(e) => onSetScoreChange(flightIndex, setIndex, 'home', parseInt(e.target.value) || 0)}
              />
              <span>-</span>
              <Input
                type="number"
                min="0"
                className="w-16"
                value={set.awayScore}
                onChange={(e) => onSetScoreChange(flightIndex, setIndex, 'away', parseInt(e.target.value) || 0)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => toggleTiebreak(flightIndex, setIndex)}
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
                    onChange={(e) => onTiebreakScoreChange(flightIndex, setIndex, 'home', parseInt(e.target.value) || 0)}
                  />
                  <span>-</span>
                  <Input
                    type="number"
                    min="0"
                    className="w-12 h-7"
                    value={set.tiebreak.awayScore}
                    onChange={(e) => onTiebreakScoreChange(flightIndex, setIndex, 'away', parseInt(e.target.value) || 0)}
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
                  onClick={() => removeSet(flightIndex, setIndex)}
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
          onClick={() => addSet(flightIndex)}
        >
          Add Set
        </Button>
      </div>
    </div>
  );
};

export default FlightForm;
