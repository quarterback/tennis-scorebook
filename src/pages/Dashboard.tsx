import React from 'react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, School, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import PlayerLeaderboard from '@/components/dashboard/PlayerLeaderboard';
import { useDashboardData } from '@/hooks/useDashboardData';

const Dashboard = () => {
  const { teams, schools, matches } = useData();
  const { user } = useAuth();
  const { data: dashboardData, isLoading } = useDashboardData();
  
  const getTeamName = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return 'Unknown Team';
    
    const school = schools.find(s => s.id === team.schoolId);
    return `${school?.name || 'Unknown'} ${team.gender}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tennis-blue"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  // Get upcoming matches (within next 14 days)
  const today = new Date();
  const twoWeeksFromNow = new Date();
  twoWeeksFromNow.setDate(today.getDate() + 14);
  
  const upcomingMatches = matches
    .filter(match => {
      // If user is a coach, only show matches for their teams
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
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);
  
  // Get recent results
  const recentMatches = matches
    .filter(match => {
      // If user is a coach, only show matches for their teams
      if (user?.role === 'coach' && user.schoolId) {
        const userTeams = teams.filter(team => team.schoolId === user.schoolId);
        const userTeamIds = userTeams.map(team => team.id);
        if (!userTeamIds.includes(match.homeTeamId) && !userTeamIds.includes(match.awayTeamId)) {
          return false;
        }
      }
      
      if (!match.isComplete) return false;
      
      const matchDate = new Date(match.date);
      return matchDate <= today;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-tennis-dark">Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-tennis-blue to-tennis-blue/90">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white">Schools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-white">{dashboardData.stats.schoolsCount}</div>
              <School className="h-8 w-8 text-white opacity-80" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-tennis-green to-tennis-green/90">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white">Teams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-white">{dashboardData.stats.teamsCount}</div>
              <Users className="h-8 w-8 text-white opacity-80" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-tennis-accent to-tennis-accent/90">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white">Upcoming Matches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-white">{dashboardData.stats.upcomingMatchesCount}</div>
              <Calendar className="h-8 w-8 text-white opacity-80" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-tennis-blue to-tennis-blue/90">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white">Completed Matches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-white">{dashboardData.stats.completedMatchesCount}</div>
              <CheckCircle className="h-8 w-8 text-white opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <PlayerLeaderboard 
        topSingles={dashboardData.topSingles}
        topDoubles={dashboardData.topDoubles}
        insights={dashboardData.insights}
        tournaments={dashboardData.tournaments}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-tennis-blue" />
              Upcoming Matches
            </CardTitle>
            <CardDescription>Next 14 days</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingMatches.length > 0 ? (
              <ul className="space-y-2">
                {upcomingMatches.map(match => (
                  <li key={match.id} className="border-b border-gray-100 pb-2 last:border-0">
                    <Link to={`/matches/${match.id}`} className="hover:underline">
                      <div className="flex justify-between">
                        <span className="font-medium">{new Date(match.date).toLocaleDateString()}</span>
                        <span className={match.isLeagueMatch ? 'text-tennis-blue font-medium' : ''}>
                          {match.isLeagueMatch ? 'League' : 'Non-League'}
                        </span>
                      </div>
                      <div className="text-gray-700">
                        {getTeamName(match.homeTeamId)} vs. {getTeamName(match.awayTeamId)}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-500 py-4 text-center">No upcoming matches</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-tennis-green" />
              Recent Results
            </CardTitle>
            <CardDescription>Latest completed matches</CardDescription>
          </CardHeader>
          <CardContent>
            {recentMatches.length > 0 ? (
              <ul className="space-y-2">
                {recentMatches.map(match => (
                  <li key={match.id} className="border-b border-gray-100 pb-2 last:border-0">
                    <Link to={`/matches/${match.id}`} className="hover:underline">
                      <div className="flex justify-between">
                        <span className="font-medium">{new Date(match.date).toLocaleDateString()}</span>
                        <span className={match.isLeagueMatch ? 'text-tennis-blue font-medium' : ''}>
                          {match.isLeagueMatch ? 'League' : 'Non-League'}
                        </span>
                      </div>
                      <div className="text-gray-700">
                        {getTeamName(match.homeTeamId)} vs. {getTeamName(match.awayTeamId)}
                      </div>
                      <div className="text-sm font-medium">
                        {match.homeTeamWon 
                          ? `Winner: ${getTeamName(match.homeTeamId)}`
                          : `Winner: ${getTeamName(match.awayTeamId)}`
                        }
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-500 py-4 text-center">No recent matches</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
