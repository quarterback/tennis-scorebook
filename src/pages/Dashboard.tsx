
import React from 'react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, School, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import PlayerLeaderboard from '@/components/dashboard/PlayerLeaderboard';

const Dashboard = () => {
  const { schools, teams, matches } = useData();
  const { user } = useAuth();
  
  // If user is a coach, filter to only show their school
  const filteredSchools = user?.role === 'coach' && user.schoolId
    ? schools.filter(school => school.id === user.schoolId)
    : schools;
  
  // Filter teams based on user role
  const filteredTeams = user?.role === 'coach' && user.schoolId
    ? teams.filter(team => team.schoolId === user.schoolId)
    : teams;
  
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
    
  // Find team name by ID
  const getTeamName = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return 'Unknown Team';
    
    const school = schools.find(s => s.id === team.schoolId);
    return `${school?.name || 'Unknown'} ${team.gender}`;
  };

  // Sample data for player leaderboards
  const sampleTopSingles = [
    { id: "s1", name: "Sophia Chen", school: "Catlin Gabel", wins: 13, losses: 0, powerRating: 9.8 },
    { id: "s2", name: "Isabella Martinez", school: "Oregon Episcopal", wins: 12, losses: 1, powerRating: 9.6 },
    { id: "s3", name: "Emma Thompson", school: "Valley Catholic", wins: 11, losses: 2, powerRating: 9.3 },
    { id: "s4", name: "Olivia Jackson", school: "North Valley", wins: 10, losses: 2, powerRating: 9.1 },
    { id: "s5", name: "Madison Taylor", school: "Cascade", wins: 12, losses: 3, powerRating: 8.9 }
  ];

  const sampleTopDoubles = [
    { id: "d1", players: "Lin/Garcia", school: "Catlin Gabel", wins: 12, losses: 1, powerRating: 9.7 },
    { id: "d2", players: "Wilson/Davis", school: "St. Mary's", wins: 11, losses: 1, powerRating: 9.5 },
    { id: "d3", players: "Rodriguez/Kim", school: "La Grande", wins: 10, losses: 2, powerRating: 9.3 },
    { id: "d4", players: "Johnson/Patel", school: "Philomath", wins: 9, losses: 3, powerRating: 9.0 },
    { id: "d5", players: "Lee/Washington", school: "The Dalles", wins: 11, losses: 4, powerRating: 8.8 }
  ];

  const seasonInsights = {
    undefeatedCount: 3,
    upsetOfSeason: "Philomath's Johnson/Patel over Catlin Gabel's Lin/Garcia (April 12)",
    longestStreak: "Sophia Chen (Catlin Gabel) - 24 consecutive matches dating back to 2024",
    crossClassSuccess: "Class 4A La Grande has defeated three 5A teams this season",
    mostImproved: "Estacada (+35% win rate from last season)"
  };

  const tournamentSchedule = [
    { districtName: "Special District 1", dates: "May 10-11", location: "Oregon Episcopal" },
    { districtName: "Special District 2", dates: "May 9-10", location: "Cascade" },
    { districtName: "Special District 3", dates: "May 11-12", location: "North Valley" },
    { districtName: "Special District 4", dates: "May 10-11", location: "The Dalles" },
    { districtName: "Special District 5", dates: "May 9-10", location: "La Grande" }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Schools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{filteredSchools.length}</div>
              <School className="h-8 w-8 text-tennis-blue opacity-80" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Teams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{filteredTeams.length}</div>
              <Users className="h-8 w-8 text-tennis-green opacity-80" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Matches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{upcomingMatches.length}</div>
              <Calendar className="h-8 w-8 text-tennis-blue opacity-80" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed Matches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{recentMatches.length}</div>
              <CheckCircle className="h-8 w-8 text-tennis-green opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Player Leaderboard Component */}
      <PlayerLeaderboard 
        topSingles={sampleTopSingles}
        topDoubles={sampleTopDoubles}
        insights={seasonInsights}
        tournaments={tournamentSchedule}
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
