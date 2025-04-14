
import React from 'react';
import { Match, Player } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, Edit, ChevronDown, ChevronUp, ShieldCheck, ShieldX,
  Flag, AlertTriangle, FileDown, Printer 
} from 'lucide-react';
import { format } from 'date-fns';
import { useMatches } from '@/context/MatchesContext';
import { useAuth } from '@/context/AuthContext';
import { exportMatchToCSV } from '@/utils/exportData';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  const isExpanded = expandedMatchId === match.id;
  
  const toggleExpand = () => {
    setExpandedMatchId(isExpanded ? null : match.id);
  };
  
  const homeTeamName = getTeamName(match.homeTeamId);
  const awayTeamName = getTeamName(match.awayTeamId);

  const isHomeCoach = user?.role === 'coach' && isCoachOfTeam(match.homeTeamId);
  const isAwayCoach = user?.role === 'coach' && isCoachOfTeam(match.awayTeamId);
  
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

  const handleExportMatch = () => {
    exportMatchToCSV(match);
  };

  const handlePrintMatch = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Match Details: ${homeTeamName} vs ${awayTeamName}</title>
            <style>
              body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
              h1 { text-align: center; margin-bottom: 20px; }
              .match-details { margin: 20px 0; }
              .flight { margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
              .flight-header { font-weight: bold; margin-bottom: 10px; }
              .set { margin: 5px 0; }
              .winner { color: green; }
              .match-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
              .match-date { color: #666; }
              .match-score { font-weight: bold; font-size: 1.2em; }
              .match-teams { font-size: 1.5em; font-weight: bold; margin-bottom: 10px; }
              @media print {
                body { font-size: 12pt; }
                .flight { page-break-inside: avoid; }
              }
            </style>
          </head>
          <body>
            <h1>Match Results</h1>
            <div class="match-header">
              <div class="match-teams">${homeTeamName} vs ${awayTeamName}</div>
              <div class="match-date">${format(new Date(match.date), 'MMMM d, yyyy')}</div>
            </div>
            <div class="match-details">
              <p class="match-score">Final Score: ${getMatchScoreDisplay()}</p>
              <p>Match Type: ${match.isLeagueMatch ? 'League Match' : 'Non-League Match'}</p>
              <p>Status: ${match.homeCoachApproved && match.awayCoachApproved 
                ? 'Approved by both coaches' 
                : 'Pending approval'}</p>
            </div>
            
            <h2>Varsity Singles</h2>
            ${match.flights
              .filter(f => f.level === 'varsity' && f.type === 'singles')
              .sort((a, b) => a.position - b.position)
              .map(flight => `
                <div class="flight">
                  <div class="flight-header">Singles #${flight.position} ${
                    flight.retired ? '(Retired)' : flight.defaulted ? '(Defaulted)' : ''
                  }</div>
                  ${flight.sets.map(set => {
                    // Display winner's score first
                    const homePlayerWon = set.homeScore > set.awayScore;
                    const setScore = homePlayerWon 
                      ? `${set.homeScore}-${set.awayScore}` 
                      : `${set.awayScore}-${set.homeScore}`;
                    
                    let tiebreakText = '';
                    if (set.tiebreak) {
                      const homeTiebreakWon = set.tiebreak.homeScore > set.tiebreak.awayScore;
                      tiebreakText = homeTiebreakWon
                        ? ` (Tiebreak: ${set.tiebreak.homeScore}-${set.tiebreak.awayScore})`
                        : ` (Tiebreak: ${set.tiebreak.awayScore}-${set.tiebreak.homeScore})`;
                    }
                    
                    return `<div class="set">Set: ${setScore}${tiebreakText}</div>`;
                  }).join('')}
                </div>
              `).join('')}
              
            <h2>Varsity Doubles</h2>
            ${match.flights
              .filter(f => f.level === 'varsity' && f.type === 'doubles')
              .sort((a, b) => a.position - b.position)
              .map(flight => `
                <div class="flight">
                  <div class="flight-header">Doubles #${flight.position} ${
                    flight.retired ? '(Retired)' : flight.defaulted ? '(Defaulted)' : ''
                  }</div>
                  ${flight.sets.map(set => {
                    // Display winner's score first
                    const homePlayerWon = set.homeScore > set.awayScore;
                    const setScore = homePlayerWon 
                      ? `${set.homeScore}-${set.awayScore}` 
                      : `${set.awayScore}-${set.homeScore}`;
                    
                    let tiebreakText = '';
                    if (set.tiebreak) {
                      const homeTiebreakWon = set.tiebreak.homeScore > set.tiebreak.awayScore;
                      tiebreakText = homeTiebreakWon
                        ? ` (Tiebreak: ${set.tiebreak.homeScore}-${set.tiebreak.awayScore})`
                        : ` (Tiebreak: ${set.tiebreak.awayScore}-${set.tiebreak.homeScore})`;
                    }
                    
                    return `<div class="set">Set: ${setScore}${tiebreakText}</div>`;
                  }).join('')}
                </div>
              `).join('')}
              
            ${match.hasJvMatches ? `
              <h2>JV Singles</h2>
              ${match.flights
                .filter(f => f.level === 'jv' && f.type === 'singles')
                .sort((a, b) => a.position - b.position)
                .map(flight => `
                  <div class="flight">
                    <div class="flight-header">Singles #${flight.position} ${
                      flight.retired ? '(Retired)' : flight.defaulted ? '(Defaulted)' : ''
                    }</div>
                    ${flight.sets.map(set => {
                      // Display winner's score first
                      const homePlayerWon = set.homeScore > set.awayScore;
                      const setScore = homePlayerWon 
                        ? `${set.homeScore}-${set.awayScore}` 
                        : `${set.awayScore}-${set.homeScore}`;
                      
                      let tiebreakText = '';
                      if (set.tiebreak) {
                        const homeTiebreakWon = set.tiebreak.homeScore > set.tiebreak.awayScore;
                        tiebreakText = homeTiebreakWon
                          ? ` (Tiebreak: ${set.tiebreak.homeScore}-${set.tiebreak.awayScore})`
                          : ` (Tiebreak: ${set.tiebreak.awayScore}-${set.tiebreak.homeScore})`;
                      }
                      
                      return `<div class="set">Set: ${setScore}${tiebreakText}</div>`;
                    }).join('')}
                  </div>
                `).join('')}
                
              <h2>JV Doubles</h2>
              ${match.flights
                .filter(f => f.level === 'jv' && f.type === 'doubles')
                .sort((a, b) => a.position - b.position)
                .map(flight => `
                  <div class="flight">
                    <div class="flight-header">Doubles #${flight.position} ${
                      flight.retired ? '(Retired)' : flight.defaulted ? '(Defaulted)' : ''
                    }</div>
                    ${flight.sets.map(set => {
                      // Display winner's score first
                      const homePlayerWon = set.homeScore > set.awayScore;
                      const setScore = homePlayerWon 
                        ? `${set.homeScore}-${set.awayScore}` 
                        : `${set.awayScore}-${set.homeScore}`;
                      
                      let tiebreakText = '';
                      if (set.tiebreak) {
                        const homeTiebreakWon = set.tiebreak.homeScore > set.tiebreak.awayScore;
                        tiebreakText = homeTiebreakWon
                          ? ` (Tiebreak: ${set.tiebreak.homeScore}-${set.tiebreak.awayScore})`
                          : ` (Tiebreak: ${set.tiebreak.awayScore}-${set.tiebreak.homeScore})`;
                      }
                      
                      return `<div class="set">Set: ${setScore}${tiebreakText}</div>`;
                    }).join('')}
                  </div>
                `).join('')}
            ` : ''}
            
            <script>
              window.onload = function() {
                window.print();
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  // For displaying flight scores with winning team's score first
  const getFormattedSetScore = (set, isHomeWinner) => {
    if (isHomeWinner) {
      return `${set.homeScore}-${set.awayScore}`;
    } else {
      return `${set.awayScore}-${set.homeScore}`;
    }
  };

  return (
    <Card className="match-card">
      <CardContent className="pt-4 sm:pt-6">
        <div className="match-header">
          <div className="space-y-1 sm:space-y-2 flex-1">
            <div className="match-date">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              {format(new Date(match.date), 'MMMM d, yyyy')}
              {match.isLeagueMatch && (
                <span className="match-tag">
                  League
                </span>
              )}
            </div>
            
            <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center">
              <div className="match-title text-base xs:text-lg">{homeTeamName} vs {awayTeamName}</div>
              <div className="flex items-center gap-2 mt-1 xs:mt-0">
                {match.isComplete && (
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="flex">
                      <div title={match.homeCoachApproved ? "Home coach approved" : "Awaiting home coach approval"}>
                        {match.homeCoachApproved ? 
                          <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" /> : 
                          <ShieldX className="h-4 w-4 sm:h-5 sm:w-5 text-gray-300" />
                        }
                      </div>
                      <div title={match.awayCoachApproved ? "Away coach approved" : "Awaiting away coach approval"}>
                        {match.awayCoachApproved ? 
                          <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" /> : 
                          <ShieldX className="h-4 w-4 sm:h-5 sm:w-5 text-gray-300" />
                        }
                      </div>
                    </div>
                    <span className="match-score">
                      {getMatchScoreDisplay()}
                    </span>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleExpand}
                  className="p-1 -mr-2 h-auto"
                >
                  {isExpanded ? <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5" /> : <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {isExpanded && (
          <div className="mt-4 space-y-4 sm:space-y-6">
            <div className="match-content">
              <div className="match-section">
                <h4 className="match-section-title">Varsity Singles</h4>
                <div className="space-y-2">
                  {match.flights
                    .filter(f => f.level === 'varsity' && f.type === 'singles')
                    .sort((a, b) => a.position - b.position)
                    .map((flight, index) => (
                      <div key={index} className="flex justify-between items-center border-b pb-2">
                        <div className="flex-1">
                          <div className="text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
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
                        <div className="flex-1 flex flex-wrap justify-end">
                          {flight.sets.map((set, setIndex) => {
                            const homeWonSet = set.homeScore > set.awayScore;
                            return (
                              <div 
                                key={setIndex} 
                                className={`text-xs sm:text-sm inline-block mx-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded ${
                                  homeWonSet 
                                    ? 'bg-green-100' 
                                    : 'bg-red-100'
                                }`}
                              >
                                {homeWonSet ? 
                                  `${set.homeScore}-${set.awayScore}` : 
                                  `${set.awayScore}-${set.homeScore}`}
                                {set.tiebreak && (
                                  <span className="text-2xs sm:text-xs ml-1">
                                    ({set.tiebreak.homeScore > set.tiebreak.awayScore ? 
                                      `${set.tiebreak.homeScore}-${set.tiebreak.awayScore}` : 
                                      `${set.tiebreak.awayScore}-${set.tiebreak.homeScore}`})
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="match-section">
                <h4 className="match-section-title">Varsity Doubles</h4>
                <div className="space-y-2">
                  {match.flights
                    .filter(f => f.level === 'varsity' && f.type === 'doubles')
                    .sort((a, b) => a.position - b.position)
                    .map((flight, index) => (
                      <div key={index} className="flex justify-between items-center border-b pb-2">
                        <div className="flex-1">
                          <div className="text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
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
                        <div className="flex-1 flex flex-wrap justify-end">
                          {flight.sets.map((set, setIndex) => {
                            const homeWonSet = set.homeScore > set.awayScore;
                            return (
                              <div 
                                key={setIndex} 
                                className={`text-xs sm:text-sm inline-block mx-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded ${
                                  homeWonSet 
                                    ? 'bg-green-100' 
                                    : 'bg-red-100'
                                }`}
                              >
                                {homeWonSet ? 
                                  `${set.homeScore}-${set.awayScore}` : 
                                  `${set.awayScore}-${set.homeScore}`}
                                {set.tiebreak && (
                                  <span className="text-2xs sm:text-xs ml-1">
                                    ({set.tiebreak.homeScore > set.tiebreak.awayScore ? 
                                      `${set.tiebreak.homeScore}-${set.tiebreak.awayScore}` : 
                                      `${set.tiebreak.awayScore}-${set.tiebreak.homeScore}`})
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {match.hasJvMatches && (
              <div className="match-content">
                <div className="match-section">
                  <h4 className="match-section-title">JV Singles</h4>
                  <div className="space-y-2">
                    {match.flights
                      .filter(f => f.level === 'jv' && f.type === 'singles')
                      .sort((a, b) => a.position - b.position)
                      .map((flight, index) => (
                        <div key={`jvs-${index}`} className="flex justify-between items-center border-b pb-2">
                          <div className="flex-1">
                            <div className="text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
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
                          <div className="flex-1 flex flex-wrap justify-end">
                            {flight.sets.map((set, setIndex) => {
                              const homeWonSet = set.homeScore > set.awayScore;
                              return (
                                <div 
                                  key={setIndex} 
                                  className={`text-xs sm:text-sm inline-block mx-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded ${
                                    homeWonSet 
                                      ? 'bg-green-100' 
                                      : 'bg-red-100'
                                  }`}
                                >
                                  {homeWonSet ? 
                                    `${set.homeScore}-${set.awayScore}` : 
                                    `${set.awayScore}-${set.homeScore}`}
                                  {set.tiebreak && (
                                    <span className="text-2xs sm:text-xs ml-1">
                                      ({set.tiebreak.homeScore > set.tiebreak.awayScore ? 
                                        `${set.tiebreak.homeScore}-${set.tiebreak.awayScore}` : 
                                        `${set.tiebreak.awayScore}-${set.tiebreak.homeScore}`})
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                
                <div className="match-section">
                  <h4 className="match-section-title">JV Doubles</h4>
                  <div className="space-y-2">
                    {match.flights
                      .filter(f => f.level === 'jv' && f.type === 'doubles')
                      .sort((a, b) => a.position - b.position)
                      .map((flight, index) => (
                        <div key={`jvd-${index}`} className="flex justify-between items-center border-b pb-2">
                          <div className="flex-1">
                            <div className="text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
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
                          <div className="flex-1 flex flex-wrap justify-end">
                            {flight.sets.map((set, setIndex) => {
                              const homeWonSet = set.homeScore > set.awayScore;
                              return (
                                <div 
                                  key={setIndex} 
                                  className={`text-xs sm:text-sm inline-block mx-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded ${
                                    homeWonSet 
                                      ? 'bg-green-100' 
                                      : 'bg-red-100'
                                  }`}
                                >
                                  {homeWonSet ? 
                                    `${set.homeScore}-${set.awayScore}` : 
                                    `${set.awayScore}-${set.homeScore}`}
                                  {set.tiebreak && (
                                    <span className="text-2xs sm:text-xs ml-1">
                                      ({set.tiebreak.homeScore > set.tiebreak.awayScore ? 
                                        `${set.tiebreak.homeScore}-${set.tiebreak.awayScore}` : 
                                        `${set.tiebreak.awayScore}-${set.tiebreak.homeScore}`})
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
            
            {match.isComplete && (
              <div className="mt-4 bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h4 className="font-medium mb-2 text-sm sm:text-base">Match Summary</h4>
                <div className="text-xs sm:text-sm text-gray-600 space-y-1 sm:space-y-2">
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
      
      <CardFooter className="match-actions flex-wrap pt-1 sm:pt-0 justify-end">
        {canEditMatch(match) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => openEditDialog(match)}
            className="flex-1 xs:flex-none flex items-center justify-center"
          >
            <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            {!isMobile && "Edit"}
          </Button>
        )}
        
        {match.isComplete && (
          <>
            {(user?.role === 'admin' || isHomeCoach) && !match.homeCoachApproved && (
              <Button
                variant="default"
                size="sm"
                className="flex-1 xs:flex-none bg-green-600 hover:bg-green-700 text-xs sm:text-sm"
                onClick={() => approveMatch(match.id, 'home')}
              >
                {isMobile ? "Approve (H)" : "Approve as Home Coach"}
              </Button>
            )}
            
            {(user?.role === 'admin' || isAwayCoach) && !match.awayCoachApproved && (
              <Button
                variant="default"
                size="sm"
                className="flex-1 xs:flex-none bg-green-600 hover:bg-green-700 text-xs sm:text-sm"
                onClick={() => approveMatch(match.id, 'away')}
              >
                {isMobile ? "Approve (A)" : "Approve as Away Coach"}
              </Button>
            )}
          </>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportMatch}
          className="flex-1 xs:flex-none flex items-center justify-center text-xs sm:text-sm"
        >
          <FileDown className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          {!isMobile && "Export"}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrintMatch}
          className="flex-1 xs:flex-none flex items-center justify-center text-xs sm:text-sm"
        >
          <Printer className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          {!isMobile && "Print"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MatchCard;
