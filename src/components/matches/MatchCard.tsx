import React from 'react';
import { Match, Player } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, Edit, ChevronDown, ChevronUp, ShieldCheck, ShieldX,
  Flag, AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import { useMatches } from '@/context/MatchesContext';
import { useAuth } from '@/context/AuthContext';

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
  const { approveMatch, canApproveMatch, isCoachOfTeam } = useMatches();
  const { user } = useAuth();
  
  const isExpanded = expandedMatchId === match.id;
  
  const toggleExpand = () => {
    setExpandedMatchId(isExpanded ? null : match.id);
  };
  
  const homeTeamName = getTeamName(match.homeTeamId);
  const awayTeamName = getTeamName(match.awayTeamId);

  // Check if current user is coach of home or away team
  const isHomeCoach = user?.role === 'coach' && isCoachOfTeam(match.homeTeamId);
  const isAwayCoach = user?.role === 'coach' && isCoachOfTeam(match.awayTeamId);
  
  // Format match score for display
  const getMatchScoreDisplay = () => {
    if (match.homeTeamScore !== undefined && match.awayTeamScore !== undefined) {
      if (match.homeTeamWon) {
        return `${homeTeamName} ${match.homeTeamScore}-${match.awayTeamScore}`;
      } else {
        return `${awayTeamName} ${match.awayTeamScore}-${match.homeTeamScore}`;
      }
    }
    return match.homeTeamWon ? `${homeTeamName} won` : `${awayTeamName} won`;
  };
  
  return (
    <Card className="w-full mb-4">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2 flex-1">
            <div className="flex items-center text-muted-foreground text-sm">
              <Calendar className="h-4 w-4 mr-1" />
              {format(new Date(match.date), 'MMMM d, yyyy')}
              {match.isLeagueMatch && (
                <span className="ml-2 bg-tennis-blue text-white text-xs px-2 py-0.5 rounded-full">
                  League
                </span>
              )}
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-lg font-medium">{homeTeamName} vs {awayTeamName}</div>
              <div className="flex items-center space-x-2">
                {match.isComplete && (
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      <div title={match.homeCoachApproved ? "Home coach approved" : "Awaiting home coach approval"}>
                        {match.homeCoachApproved ? 
                          <ShieldCheck className="h-5 w-5 text-green-500" /> : 
                          <ShieldX className="h-5 w-5 text-gray-300" />
                        }
                      </div>
                      <div title={match.awayCoachApproved ? "Away coach approved" : "Awaiting away coach approval"}>
                        {match.awayCoachApproved ? 
                          <ShieldCheck className="h-5 w-5 text-green-500" /> : 
                          <ShieldX className="h-5 w-5 text-gray-300" />
                        }
                      </div>
                    </div>
                    <span className="text-sm font-semibold">
                      {getMatchScoreDisplay()}
                    </span>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleExpand}
                  className="-mr-2"
                >
                  {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {isExpanded && (
          <div className="mt-4 space-y-6">
            {/* Match Result Visualization */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-sm">Varsity Singles</h4>
                <div className="space-y-2">
                  {match.flights
                    .filter(f => f.level === 'varsity' && f.type === 'singles')
                    .sort((a, b) => a.position - b.position)
                    .map((flight, index) => (
                      <div key={index} className="flex justify-between items-center border-b pb-2">
                        <div className="flex-1">
                          <div className="text-sm flex items-center gap-2">
                            Singles {flight.position}
                            {flight.retired && (
                              <span className="text-orange-500 text-xs flex items-center">
                                <Flag className="h-3 w-3 mr-1" /> Retired
                              </span>
                            )}
                            {flight.defaulted && (
                              <span className="text-red-500 text-xs flex items-center">
                                <AlertTriangle className="h-3 w-3 mr-1" /> Defaulted
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          {flight.sets.map((set, setIndex) => (
                            <div 
                              key={setIndex} 
                              className={`text-sm inline-block mx-1 px-2 py-1 rounded ${
                                set.homeScore > set.awayScore 
                                  ? 'bg-green-100' 
                                  : 'bg-red-100'
                              }`}
                            >
                              {set.homeScore}-{set.awayScore}
                              {set.tiebreak && (
                                <span className="text-xs ml-1">
                                  ({set.tiebreak.homeScore}-{set.tiebreak.awayScore})
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-sm">Varsity Doubles</h4>
                <div className="space-y-2">
                  {match.flights
                    .filter(f => f.level === 'varsity' && f.type === 'doubles')
                    .sort((a, b) => a.position - b.position)
                    .map((flight, index) => (
                      <div key={index} className="flex justify-between items-center border-b pb-2">
                        <div className="flex-1">
                          <div className="text-sm flex items-center gap-2">
                            Doubles {flight.position}
                            {flight.retired && (
                              <span className="text-orange-500 text-xs flex items-center">
                                <Flag className="h-3 w-3 mr-1" /> Retired
                              </span>
                            )}
                            {flight.defaulted && (
                              <span className="text-red-500 text-xs flex items-center">
                                <AlertTriangle className="h-3 w-3 mr-1" /> Defaulted
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          {flight.sets.map((set, setIndex) => (
                            <div 
                              key={setIndex} 
                              className={`text-sm inline-block mx-1 px-2 py-1 rounded ${
                                set.homeScore > set.awayScore 
                                  ? 'bg-green-100' 
                                  : 'bg-red-100'
                              }`}
                            >
                              {set.homeScore}-{set.awayScore}
                              {set.tiebreak && (
                                <span className="text-xs ml-1">
                                  ({set.tiebreak.homeScore}-{set.tiebreak.awayScore})
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* JV Matches Section */}
            {match.hasJvMatches && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-sm">JV Singles</h4>
                  <div className="space-y-2">
                    {match.flights
                      .filter(f => f.level === 'jv' && f.type === 'singles')
                      .sort((a, b) => a.position - b.position)
                      .map((flight, index) => (
                        <div key={`jvs-${index}`} className="flex justify-between items-center border-b pb-2">
                          <div className="flex-1">
                            <div className="text-sm flex items-center gap-2">
                              Singles {flight.position}
                              {flight.retired && (
                                <span className="text-orange-500 text-xs flex items-center">
                                  <Flag className="h-3 w-3 mr-1" /> Retired
                                </span>
                              )}
                              {flight.defaulted && (
                                <span className="text-red-500 text-xs flex items-center">
                                  <AlertTriangle className="h-3 w-3 mr-1" /> Defaulted
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex-1">
                            {flight.sets.map((set, setIndex) => (
                              <div 
                                key={setIndex} 
                                className={`text-sm inline-block mx-1 px-2 py-1 rounded ${
                                  set.homeScore > set.awayScore 
                                    ? 'bg-green-100' 
                                    : 'bg-red-100'
                                }`}
                              >
                                {set.homeScore}-{set.awayScore}
                                {set.tiebreak && (
                                  <span className="text-xs ml-1">
                                    ({set.tiebreak.homeScore}-{set.tiebreak.awayScore})
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium text-sm">JV Doubles</h4>
                  <div className="space-y-2">
                    {match.flights
                      .filter(f => f.level === 'jv' && f.type === 'doubles')
                      .sort((a, b) => a.position - b.position)
                      .map((flight, index) => (
                        <div key={`jvd-${index}`} className="flex justify-between items-center border-b pb-2">
                          <div className="flex-1">
                            <div className="text-sm flex items-center gap-2">
                              Doubles {flight.position}
                              {flight.retired && (
                                <span className="text-orange-500 text-xs flex items-center">
                                  <Flag className="h-3 w-3 mr-1" /> Retired
                                </span>
                              )}
                              {flight.defaulted && (
                                <span className="text-red-500 text-xs flex items-center">
                                  <AlertTriangle className="h-3 w-3 mr-1" /> Defaulted
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex-1">
                            {flight.sets.map((set, setIndex) => (
                              <div 
                                key={setIndex} 
                                className={`text-sm inline-block mx-1 px-2 py-1 rounded ${
                                  set.homeScore > set.awayScore 
                                    ? 'bg-green-100' 
                                    : 'bg-red-100'
                                }`}
                              >
                                {set.homeScore}-{set.awayScore}
                                {set.tiebreak && (
                                  <span className="text-xs ml-1">
                                    ({set.tiebreak.homeScore}-{set.tiebreak.awayScore})
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Match Notes Section */}
            {match.isComplete && (
              <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Match Summary</h4>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>
                    <strong>Final Score:</strong> {getMatchScoreDisplay()}
                  </p>
                  <p>
                    <strong>Date:</strong> {format(new Date(match.date), 'MMMM d, yyyy')}
                  </p>
                  <p>
                    <strong>Match Type:</strong> {match.isLeagueMatch ? 'League Match' : 'Non-League Match'}
                  </p>
                  <p>
                    <strong>Status:</strong>{' '}
                    {match.homeCoachApproved && match.awayCoachApproved 
                      ? 'Approved by both coaches' 
                      : 'Pending approval'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-end space-x-2 pt-0">
        {canEditMatch(match) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => openEditDialog(match)}
            className="flex items-center"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
        
        {match.isComplete && (
          <>
            {(user?.role === 'admin' || isHomeCoach) && !match.homeCoachApproved && (
              <Button
                variant="default"
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => approveMatch(match.id, 'home')}
              >
                Approve as Home Coach
              </Button>
            )}
            
            {(user?.role === 'admin' || isAwayCoach) && !match.awayCoachApproved && (
              <Button
                variant="default"
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => approveMatch(match.id, 'away')}
              >
                Approve as Away Coach
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default MatchCard;
