import { useState, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { TeamRanking, QualifiedTeam, ClassificationQualifications } from '@/types/ranking';
import { Gender, Classification, TeamStanding } from '@/types';
import { useRankingCalculator } from '@/hooks/rankings/useRankingCalculator';

// Configuration for state tournament qualifications by classification
const qualificationRules: ClassificationQualifications[] = [
  {
    classification: '6A',
    totalSpots: 16,
    automaticBids: 7, // 7 leagues, 1 automatic bid each
    atLargeBids: 9
  },
  {
    classification: '5A',
    totalSpots: 12,
    automaticBids: 4, // 4 conferences, 1 automatic bid each
    atLargeBids: 8
  },
  {
    classification: '4A/3A/2A/1A',
    totalSpots: 8,
    automaticBids: 4, // 4 special districts, 1 automatic bid each
    atLargeBids: 4
  }
];

export const useTournamentBracket = (gender: Gender, classification: Classification) => {
  const { teams, schools, districts, getStandings } = useData();
  const { calculateRankings } = useRankingCalculator();
  
  const [bracket, setBracket] = useState<{
    rounds: Array<{
      name: string;
      matches: Array<{
        id: string;
        team1: { id: string; name: string; school: string; seed: number };
        team2: { id: string; name: string; school: string; seed: number };
        winner?: 'team1' | 'team2';
        roundIndex: number;
        matchIndex: number;
      }>;
    }>;
  }>({ rounds: [] });
  
  const [qualifiedTeams, setQualifiedTeams] = useState<QualifiedTeam[]>([]);

  // Get qualification rules for the selected classification
  const getQualificationRules = (): ClassificationQualifications => {
    return qualificationRules.find(rule => rule.classification === classification) || {
      classification,
      totalSpots: 8,
      automaticBids: 4,
      atLargeBids: 4
    };
  };

  // Generate qualified teams based on rankings
  const generateQualifiedTeams = () => {
    const rules = getQualificationRules();
    
    // Use the ranking calculator to get properly ranked and qualified teams
    const rankings = calculateRankings();
    
    // Filter rankings by gender and classification
    const relevantRankings = rankings.filter(
      team => team.gender === gender && team.classification === classification
    );
    
    // Get qualified teams (those marked as automatic or at-large)
    const qualified = relevantRankings.filter(
      team => team.qualificationStatus === 'automatic' || team.qualificationStatus === 'at-large'
    );
    
    // Sort by seed
    const sortedQualified = qualified.sort((a, b) => 
      (a.qualificationSeed || 999) - (b.qualificationSeed || 999)
    );
    
    // Convert to QualifiedTeam format
    const qualifiedTeamsResult = sortedQualified.map(team => ({
      teamId: team.teamId,
      teamName: team.teamName,
      schoolName: team.schoolName,
      gender: team.gender as Gender,
      districtName: team.districtName,
      qualificationType: team.qualificationStatus === 'automatic' ? 'automatic' : 'at-large',
      seed: team.qualificationSeed || 999,
      compositeScore: team.compositeScore
    }));
    
    setQualifiedTeams(qualifiedTeamsResult);
    return qualifiedTeamsResult;
  };

  // Generate bracket based on qualified teams
  const generateBracket = (qualifiedTeams: QualifiedTeam[]) => {
    const rules = getQualificationRules();
    const totalTeams = qualifiedTeams.length;
    
    // If no teams, return empty bracket
    if (totalTeams === 0) return { rounds: [] };
    
    // Calculate number of rounds needed
    const roundCount = Math.ceil(Math.log2(totalTeams));
    const rounds = [];
    
    // Generate first round with matchups
    const firstRoundMatches = [];
    for (let i = 0; i < totalTeams / 2; i++) {
      const topSeed = qualifiedTeams[i];
      const bottomSeed = qualifiedTeams[totalTeams - i - 1]; // Match highest vs lowest seed
      
      firstRoundMatches.push({
        id: `match-round1-${i}`,
        team1: {
          id: topSeed.teamId,
          name: topSeed.teamName,
          school: topSeed.schoolName,
          seed: topSeed.seed
        },
        team2: {
          id: bottomSeed.teamId,
          name: bottomSeed.teamName,
          school: bottomSeed.schoolName,
          seed: bottomSeed.seed
        },
        roundIndex: 0,
        matchIndex: i
      });
    }
    
    rounds.push({
      name: totalTeams === 16 ? "First Round" : 
            totalTeams === 8 ? "Quarterfinals" : 
            totalTeams === 4 ? "Semifinals" : "Opening Round",
      matches: firstRoundMatches
    });
    
    // Generate subsequent rounds with placeholders
    for (let i = 1; i < roundCount; i++) {
      const matchesInRound = Math.pow(2, roundCount - i - 1);
      const matches = [];
      
      for (let j = 0; j < matchesInRound; j++) {
        matches.push({
          id: `match-round${i+1}-${j}`,
          team1: { id: "", name: "TBD", school: "", seed: 0 },
          team2: { id: "", name: "TBD", school: "", seed: 0 },
          roundIndex: i,
          matchIndex: j
        });
      }
      
      rounds.push({
        name: i === roundCount - 1 ? "Championship" :
              i === roundCount - 2 ? "Semifinals" :
              i === roundCount - 3 ? "Quarterfinals" : `Round ${i+1}`,
        matches
      });
    }
    
    setBracket({ rounds });
    return { rounds };
  };

  // Handle winner selection and update bracket
  const handleWinnerSelect = (matchId: string, winner: 'team1' | 'team2') => {
    const updatedBracket = { ...bracket };
    
    // Find the match in the bracket
    let matchFound = false;
    let winningTeam;
    let roundIndex = -1;
    let matchIndex = -1;
    
    for (let i = 0; i < updatedBracket.rounds.length; i++) {
      const roundMatches = updatedBracket.rounds[i].matches;
      
      for (let j = 0; j < roundMatches.length; j++) {
        if (roundMatches[j].id === matchId) {
          // Update the winner
          updatedBracket.rounds[i].matches[j].winner = winner;
          
          // Store the winning team info
          winningTeam = winner === 'team1' 
            ? updatedBracket.rounds[i].matches[j].team1 
            : updatedBracket.rounds[i].matches[j].team2;
          
          roundIndex = i;
          matchIndex = j;
          matchFound = true;
          break;
        }
      }
      
      if (matchFound) break;
    }
    
    // If match is found and it's not the final round, update the next round
    if (matchFound && roundIndex < updatedBracket.rounds.length - 1 && winningTeam) {
      const nextRoundIndex = roundIndex + 1;
      const nextMatchIndex = Math.floor(matchIndex / 2);
      
      // Determine if this winner goes into team1 or team2 slot
      const isTeam1Slot = matchIndex % 2 === 0;
      
      // Update the appropriate slot in the next round
      if (isTeam1Slot) {
        updatedBracket.rounds[nextRoundIndex].matches[nextMatchIndex].team1 = winningTeam;
      } else {
        updatedBracket.rounds[nextRoundIndex].matches[nextMatchIndex].team2 = winningTeam;
      }
    }
    
    setBracket(updatedBracket);
  };

  // Auto-generate bracket with qualified teams
  const autoGenerateBracket = () => {
    const teams = generateQualifiedTeams();
    return generateBracket(teams);
  };

  return {
    bracket,
    qualifiedTeams,
    generateQualifiedTeams,
    generateBracket,
    handleWinnerSelect,
    autoGenerateBracket,
    qualificationRules: getQualificationRules()
  };
};
