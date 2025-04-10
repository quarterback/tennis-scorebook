
import React from 'react';
import { Match } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, Edit, ChevronDown, ChevronUp, ShieldCheck, ShieldX 
} from 'lucide-react';
import { format } from 'date-fns';
import { useMatches } from '@/context/MatchesContext';

interface MatchCardProps {
  match: Match;
}

const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  const { 
    getTeamName, expandedMatchId, setExpandedMatchId, 
    canEditMatch, openEditDialog, approveMatch, canApproveMatch 
  } = useMatches();
  
  const isExpanded = expandedMatchId === match.id;
  
  const toggleExpand = () => {
    setExpandedMatchId(isExpanded ? null : match.id);
  };
  
  const homeTeamName = getTeamName(match.homeTeamId);
  const awayTeamName = getTeamName(match.awayTeamId);
  
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
                      {match.homeTeamWon ? homeTeamName : awayTeamName} won
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
            {/* Match details section */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm">Varsity Singles</h4>
              <div className="space-y-2">
                {match.flights
                  .filter(f => f.level === 'varsity' && f.type === 'singles')
                  .sort((a, b) => a.position - b.position)
                  .map((flight, index) => (
                    <div key={index} className="flex justify-between border-b pb-2">
                      <div className="flex-1">
                        <div className="text-sm">Singles {flight.position}</div>
                      </div>
                      <div className="flex-1">
                        {flight.sets.map((set, setIndex) => (
                          <div key={setIndex} className="text-sm">
                            {set.homeScore}-{set.awayScore}
                            {set.tiebreak && ` (${set.tiebreak.homeScore}-${set.tiebreak.awayScore})`}
                            {setIndex < flight.sets.length - 1 ? ', ' : ''}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
              
              <h4 className="font-medium text-sm">Varsity Doubles</h4>
              <div className="space-y-2">
                {match.flights
                  .filter(f => f.level === 'varsity' && f.type === 'doubles')
                  .sort((a, b) => a.position - b.position)
                  .map((flight, index) => (
                    <div key={index} className="flex justify-between border-b pb-2">
                      <div className="flex-1">
                        <div className="text-sm">Doubles {flight.position}</div>
                      </div>
                      <div className="flex-1">
                        {flight.sets.map((set, setIndex) => (
                          <div key={setIndex} className="text-sm">
                            {set.homeScore}-{set.awayScore}
                            {set.tiebreak && ` (${set.tiebreak.homeScore}-${set.tiebreak.awayScore})`}
                            {setIndex < flight.sets.length - 1 ? ', ' : ''}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
              
              {match.hasJvMatches && (
                <>
                  <h4 className="font-medium text-sm">JV Singles</h4>
                  <div className="space-y-2">
                    {match.flights
                      .filter(f => f.level === 'jv' && f.type === 'singles')
                      .sort((a, b) => a.position - b.position)
                      .map((flight, index) => (
                        <div key={`jvs-${index}`} className="flex justify-between border-b pb-2">
                          <div className="flex-1">
                            <div className="text-sm">Singles {flight.position}</div>
                          </div>
                          <div className="flex-1">
                            {flight.sets.map((set, setIndex) => (
                              <div key={setIndex} className="text-sm">
                                {set.homeScore}-{set.awayScore}
                                {set.tiebreak && ` (${set.tiebreak.homeScore}-${set.tiebreak.awayScore})`}
                                {setIndex < flight.sets.length - 1 ? ', ' : ''}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                  
                  <h4 className="font-medium text-sm">JV Doubles</h4>
                  <div className="space-y-2">
                    {match.flights
                      .filter(f => f.level === 'jv' && f.type === 'doubles')
                      .sort((a, b) => a.position - b.position)
                      .map((flight, index) => (
                        <div key={`jvd-${index}`} className="flex justify-between border-b pb-2">
                          <div className="flex-1">
                            <div className="text-sm">Doubles {flight.position}</div>
                          </div>
                          <div className="flex-1">
                            {flight.sets.map((set, setIndex) => (
                              <div key={setIndex} className="text-sm">
                                {set.homeScore}-{set.awayScore}
                                {set.tiebreak && ` (${set.tiebreak.homeScore}-${set.tiebreak.awayScore})`}
                                {setIndex < flight.sets.length - 1 ? ', ' : ''}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                </>
              )}
            </div>
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
            {canApproveMatch(match, 'home') && !match.homeCoachApproved && (
              <Button
                variant="default"
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => approveMatch(match.id, 'home')}
              >
                Approve as Home Coach
              </Button>
            )}
            
            {canApproveMatch(match, 'away') && !match.awayCoachApproved && (
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
