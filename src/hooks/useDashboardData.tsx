
import { useQuery } from '@tanstack/react-query';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';

export interface PlayerStats {
  id: string;
  name: string;
  school: string;
  wins: number;
  losses: number;
  powerRating: number;
}

export interface DoublesTeam {
  id: string;
  players: string;
  school: string;
  wins: number;
  losses: number;
  powerRating: number;
}

export interface TournamentSchedule {
  districtName: string;
  dates: string;
  location: string;
}

export interface DashboardData {
  topSingles: PlayerStats[];
  topDoubles: DoublesTeam[];
  insights: {
    undefeatedCount: number;
    upsetOfSeason: string;
    longestStreak: string;
    crossClassSuccess: string;
    mostImproved: string;
  };
  tournaments: TournamentSchedule[];
  stats: {
    schoolsCount: number;
    teamsCount: number;
    upcomingMatchesCount: number;
    completedMatchesCount: number;
  };
}

export const useDashboardData = () => {
  const { schools, teams, matches } = useData();
  const { user } = useAuth();

  return useQuery({
    queryKey: ['dashboardData', user?.schoolId],
    queryFn: async () => {
      // Filter data based on user role
      const filteredSchools = user?.role === 'coach' && user.schoolId
        ? schools.filter(school => school.id === user.schoolId)
        : schools;

      const filteredTeams = user?.role === 'coach' && user.schoolId
        ? teams.filter(team => team.schoolId === user.schoolId)
        : teams;

      // Calculate upcoming and completed matches
      const today = new Date();
      const twoWeeksFromNow = new Date();
      twoWeeksFromNow.setDate(today.getDate() + 14);

      const upcomingMatches = matches.filter(match => {
        if (user?.role === 'coach' && user.schoolId) {
          const userTeams = teams.filter(team => team.schoolId === user.schoolId);
          const userTeamIds = userTeams.map(team => team.id);
          if (!userTeamIds.includes(match.homeTeamId) && !userTeamIds.includes(match.awayTeamId)) {
            return false;
          }
        }
        
        if (match.isComplete) return false;
        const matchDate = new Date(match.date);
        return matchDate >= today && matchDate <= twoWeeksFromNow;
      });

      const completedMatches = matches.filter(match => {
        if (user?.role === 'coach' && user.schoolId) {
          const userTeams = teams.filter(team => team.schoolId === user.schoolId);
          const userTeamIds = userTeams.map(team => team.id);
          if (!userTeamIds.includes(match.homeTeamId) && !userTeamIds.includes(match.awayTeamId)) {
            return false;
          }
        }
        return match.isComplete;
      });

      // Return calculated dashboard data
      return {
        stats: {
          schoolsCount: filteredSchools.length,
          teamsCount: filteredTeams.length,
          upcomingMatchesCount: upcomingMatches.length,
          completedMatchesCount: completedMatches.length
        },
        // These would come from your actual data source
        topSingles: [],
        topDoubles: [],
        insights: {
          undefeatedCount: 0,
          upsetOfSeason: "",
          longestStreak: "",
          crossClassSuccess: "",
          mostImproved: ""
        },
        tournaments: []
      };
    }
  });
};

