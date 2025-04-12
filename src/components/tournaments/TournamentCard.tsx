
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Gender, Classification } from '@/types';
import { Medal, Calendar, ChevronRight, Users, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { useData } from '@/context/DataContext';

interface TournamentCardProps {
  type: 'Singles' | 'Doubles';
  gender: Gender;
  classification: Classification;
  districtName?: string;
}

const TournamentCard: React.FC<TournamentCardProps> = ({
  type,
  gender,
  classification,
  districtName
}) => {
  const { getStandings } = useData();
  const isDistrict = !!districtName;
  const [expandedRound, setExpandedRound] = useState<number | null>(null);
  
  // Tournament dates
  const tournamentDate = isDistrict
    ? new Date(2025, 4, 15) // May 15, 2025 for districts
    : new Date(2025, 4, 30); // May 30, 2025 for state
  
  const formattedDate = tournamentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  
  // Generate bracket size based on tournament type
  const bracketSize = isDistrict ? 32 : 48; // Support up to 48 participants for state, 32 for district
  
  // For state tournaments, we show qualifying information
  const qualificationInfo = !isDistrict ? 
    "Top 4 qualifiers from each district tournament advance to state" : "";
  
  // Calculate the number of rounds needed for the bracket
  const numRounds = Math.ceil(Math.log2(bracketSize));
  
  // Generate round names
  const getRoundName = (roundIndex: number, totalRounds: number) => {
    if (roundIndex === totalRounds - 1) return "Finals";
    if (roundIndex === totalRounds - 2) return "Semi-Finals";
    if (roundIndex === totalRounds - 3) return "Quarter-Finals";
    return `Round of ${Math.pow(2, totalRounds - roundIndex)}`;
  };
  
  // Generate rounds for the bracket
  const rounds = Array.from({ length: numRounds }, (_, roundIndex) => {
    const matchesInRound = Math.pow(2, numRounds - roundIndex - 1);
    const roundName = getRoundName(roundIndex, numRounds);
    
    // Generate matches for this round
    const matches = Array.from({ length: matchesInRound }, (_, matchIndex) => {
      // First round has actual participants, other rounds have TBD
      if (roundIndex === 0) {
        const seedNumber = matchIndex + 1;
        return {
          id: `${type.toLowerCase()}-r${roundIndex}-m${matchIndex}`,
          player1: {
            seed: seedNumber,
            name: isDistrict ? `Player ${seedNumber}` : `District ${Math.floor((seedNumber-1)/4) + 1} Qualifier ${((seedNumber-1) % 4) + 1}`,
            school: `School ${seedNumber}`
          },
          player2: {
            seed: bracketSize - seedNumber + 1 > bracketSize / 2 ? bracketSize - seedNumber + 1 : null, 
            name: bracketSize - seedNumber + 1 > bracketSize / 2 ? 
              (isDistrict ? `Player ${bracketSize - seedNumber + 1}` : `District ${Math.floor((bracketSize - seedNumber)/4) + 1} Qualifier ${((bracketSize - seedNumber) % 4) + 1}`) : 
              "Bye",
            school: bracketSize - seedNumber + 1 > bracketSize / 2 ? `School ${bracketSize - seedNumber + 1}` : ""
          },
          result: null // No result yet
        };
      } else {
        // Later rounds have TBD participants
        return {
          id: `${type.toLowerCase()}-r${roundIndex}-m${matchIndex}`,
          player1: { seed: null, name: "TBD", school: "" },
          player2: { seed: null, name: "TBD", school: "" },
          result: null
        };
      }
    });
    
    return {
      name: roundName,
      matches
    };
  });
  
  const toggleRound = (roundIndex: number) => {
    if (expandedRound === roundIndex) {
      setExpandedRound(null);
    } else {
      setExpandedRound(roundIndex);
    }
  };
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <Medal className="h-5 w-5 mr-2 text-tennis-blue" />
            <h3 className="font-medium text-lg">{type} Tournament</h3>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{formattedDate}</span>
          </div>
        </div>
        
        {/* Bracket Size Info */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <Users className="h-4 w-4 mr-1" /> 
            <span>Bracket Size: Up to {bracketSize} participants</span>
          </div>
        </div>
        
        {!isDistrict && qualificationInfo && (
          <div className="mb-4 p-3 bg-blue-50 rounded border border-blue-100 text-sm">
            <div className="flex items-start">
              <Info className="h-4 w-4 mr-2 text-tennis-blue mt-0.5" />
              <p>{qualificationInfo}</p>
            </div>
          </div>
        )}
        
        {/* Tournament Bracket */}
        <div className="space-y-4 mt-4">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Tournament Bracket</h4>
          
          <div className="border rounded-lg overflow-hidden">
            {rounds.map((round, roundIndex) => (
              <div key={round.name} className="border-b last:border-b-0">
                <div 
                  className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
                  onClick={() => toggleRound(roundIndex)}
                >
                  <h3 className="font-medium">{round.name}</h3>
                  <div className="flex items-center text-gray-500">
                    <span className="mr-2 text-sm">{round.matches.length} matches</span>
                    {expandedRound === roundIndex ? 
                      <ChevronUp className="h-4 w-4" /> : 
                      <ChevronDown className="h-4 w-4" />
                    }
                  </div>
                </div>
                
                {expandedRound === roundIndex && (
                  <div className="p-2 divide-y">
                    {round.matches.map((match, matchIndex) => (
                      <div key={match.id} className="py-2">
                        <div className="flex flex-col space-y-1">
                          <div className={`flex justify-between items-center p-2 rounded ${
                            match.result === 'player1' ? 'bg-green-50' : ''
                          }`}>
                            <div className="flex items-center">
                              {match.player1.seed && (
                                <div className="bg-tennis-blue text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 text-xs">
                                  {match.player1.seed}
                                </div>
                              )}
                              <div>
                                <div className="font-medium">{match.player1.name}</div>
                                {match.player1.school && (
                                  <div className="text-xs text-gray-500">{match.player1.school}</div>
                                )}
                              </div>
                            </div>
                            {match.result === 'player1' && <ChevronRight className="h-4 w-4 text-green-600" />}
                          </div>
                          
                          <div className="text-xs text-center text-gray-400 my-1">vs</div>
                          
                          <div className={`flex justify-between items-center p-2 rounded ${
                            match.result === 'player2' ? 'bg-green-50' : ''
                          }`}>
                            <div className="flex items-center">
                              {match.player2.seed && (
                                <div className="bg-tennis-blue text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 text-xs">
                                  {match.player2.seed}
                                </div>
                              )}
                              <div>
                                <div className="font-medium">{match.player2.name}</div>
                                {match.player2.school && (
                                  <div className="text-xs text-gray-500">{match.player2.school}</div>
                                )}
                              </div>
                            </div>
                            {match.result === 'player2' && <ChevronRight className="h-4 w-4 text-green-600" />}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            {isDistrict 
              ? `${districtName} qualifier for the ${classification} ${gender} State Championship`
              : `${classification} ${gender} State Championship Tournament`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TournamentCard;
