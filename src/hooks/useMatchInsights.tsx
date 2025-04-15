
import { useMemo } from 'react';
import { Match, Team, School, Player } from '@/types';

export const useMatchInsights = (
  matches: Match[],
  teams: Team[],
  schools: School[],
  players: Player[],
  getTeamName: (teamId: string) => string
) => {
  return useMemo(() => {
    const insights = {
      undefeatedPlayers: [],
      longestWinStreak: {
        player: null as null | string,
        streak: 0,
        teamName: ''
      },
      mostImproved: {
        teamName: '',
        improvement: 0
      },
      upsetOfSeason: null as null | {
        winner: string,
        loser: string,
        date: string
      },
      crossClassificationWins: [] as {
        teamName: string,
        wins: number,
        classification: string
      }[]
    };

    // Calculate undefeated players
    const playerRecords = new Map();
    matches.forEach(match => {
      match.flights.forEach(flight => {
        if (flight.type === 'singles' && flight.level === 'varsity' && flight.position === 1) {
          flight.homePlayers.forEach(playerId => {
            const player = players.find(p => p.id === playerId);
            if (player) {
              const record = playerRecords.get(playerId) || { wins: 0, losses: 0 };
              if (flight.homePlayerWon) {
                record.wins++;
              } else {
                record.losses++;
              }
              playerRecords.set(playerId, record);
            }
          });
        }
      });
    });

    playerRecords.forEach((record, playerId) => {
      if (record.wins >= 10 && record.losses === 0) {
        const player = players.find(p => p.id === playerId);
        if (player) {
          insights.undefeatedPlayers.push({
            name: player.name,
            wins: record.wins,
            teamName: getTeamName(player.teamId)
          });
        }
      }
    });

    // Calculate win percentages for most improved
    const teamWinRates = new Map();
    matches.forEach(match => {
      const winner = match.homeTeamWon ? match.homeTeamId : match.awayTeamId;
      const winnerRecord = teamWinRates.get(winner) || { wins: 0, matches: 0 };
      winnerRecord.wins++;
      winnerRecord.matches++;
      teamWinRates.set(winner, winnerRecord);

      const loser = match.homeTeamWon ? match.awayTeamId : match.homeTeamId;
      const loserRecord = teamWinRates.get(loser) || { wins: 0, matches: 0 };
      loserRecord.matches++;
      teamWinRates.set(loser, loserRecord);
    });

    return insights;
  }, [matches, teams, schools, players, getTeamName]);
};
