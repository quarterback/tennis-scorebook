
import React from 'react';
import { Match, School, Team, Player, Flight } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Check, Edit, ChevronDown, ChevronUp } from 'lucide-react';

interface MatchCardProps {
  match: Match;
  expandedMatchId: string | null;
  setExpandedMatchId: (id: string | null) => void;
  getTeamName: (teamId: string) => string;
  canEditMatch: (match: Match) => boolean;
  openEditDialog: (match: Match) => void;
  players: Player[];
}

const MatchCard: React.FC<MatchCardProps> = ({
  match,
  expandedMatchId,
  setExpandedMatchId,
  getTeamName,
  canEditMatch,
  openEditDialog,
  players
}) => {
  return (
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
  );
};

export default MatchCard;
