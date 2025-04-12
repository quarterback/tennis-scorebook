
import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Users, UserPlus, School, Transfer, History, 
  ArrowRight, Archive, GraduationCap, UserMinus
} from 'lucide-react';
import { Player, Team, School as SchoolType } from '@/types';
import { useNavigate } from 'react-router-dom';

const PlayerManagement = () => {
  const { 
    players, teams, schools, addPlayer, updatePlayer, deletePlayer, 
    transferPlayer, retirePlayer, progressSeasons, seasons, currentSeason,
    getArchivedSeasons, getPlayersByseason
  } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<string>('active');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [transferTeamId, setTransferTeamId] = useState<string>('');
  const [isAdvanceSeasonDialogOpen, setIsAdvanceSeasonDialogOpen] = useState(false);
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>(currentSeason.id);
  
  // Filter according to user role and active tab
  const filteredPlayers = players.filter(player => {
    // Role-based filtering
    if (user?.role === 'coach' && user.schoolId) {
      const playerTeam = teams.find(team => team.id === player.teamId);
      if (!playerTeam || playerTeam.schoolId !== user.schoolId) {
        return false;
      }
    }
    
    // Tab-based filtering
    if (activeTab === 'active') {
      return player.status === 'active';
    } else if (activeTab === 'retired') {
      return player.status === 'retired';
    } else if (activeTab === 'archives') {
      return player.seasons?.includes(selectedSeasonId);
    }
    
    return true;
  });
  
  // Get school and team info for a player
  const getPlayerSchool = (player: Player): SchoolType | undefined => {
    const team = teams.find(t => t.id === player.teamId);
    if (!team) return undefined;
    return schools.find(s => s.id === team.schoolId);
  };
  
  const getPlayerTeam = (player: Player): Team | undefined => {
    return teams.find(t => t.id === player.teamId);
  };
  
  const getTeamDisplay = (team: Team | undefined, school: SchoolType | undefined): string => {
    if (!team || !school) return 'Unknown Team';
    return `${school.name} ${team.gender}`;
  };
  
  const getGradeDisplay = (grade: number): string => {
    switch (grade) {
      case 9: return 'Freshman (9th)';
      case 10: return 'Sophomore (10th)';
      case 11: return 'Junior (11th)';
      case 12: return 'Senior (12th)';
      default: return `Grade ${grade}`;
    }
  };
  
  const handleTransferSubmit = () => {
    if (!selectedPlayer || !transferTeamId) return;
    transferPlayer(selectedPlayer.id, transferTeamId);
    setIsTransferDialogOpen(false);
    setSelectedPlayer(null);
  };
  
  const handleRetirePlayer = (player: Player) => {
    if (confirm(`Are you sure you want to retire ${player.name}?`)) {
      retirePlayer(player.id);
    }
  };
  
  const handleAdvanceSeason = () => {
    if (confirm('Are you sure you want to advance to the next season? This will:' + 
      '\n1. Retire all senior (12th grade) players' +
      '\n2. Advance all other players to the next grade' +
      '\n3. Create a new current season')) {
      
      progressSeasons();
      setIsAdvanceSeasonDialogOpen(false);
    }
  };
  
  // Only admins can access this page
  if (user?.role !== 'admin' && user?.role !== 'coach') {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p className="mb-6">You don't have permission to access this page.</p>
        <Button onClick={() => navigate('/')}>Return to Dashboard</Button>
      </div>
    );
  }
  
  const archivedSeasons = getArchivedSeasons();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Player Management</h1>
        
        {user?.role === 'admin' && (
          <div className="flex gap-3">
            <Dialog open={isAdvanceSeasonDialogOpen} onOpenChange={setIsAdvanceSeasonDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="bg-amber-50">
                  <Archive className="h-4 w-4 mr-2 text-amber-600" />
                  Advance Season
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Advance to Next Season</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="border-l-4 border-amber-400 pl-4 py-2 bg-amber-50">
                    <p className="text-sm">This action will:</p>
                    <ul className="text-sm list-disc pl-5 mt-2">
                      <li>Create a new season after {currentSeason.name}</li>
                      <li>Automatically retire all senior (12th grade) players</li>
                      <li>Advance all active players to the next grade</li>
                    </ul>
                    <p className="text-sm font-medium mt-3">This action cannot be undone.</p>
                  </div>
                  
                  <Button onClick={handleAdvanceSeason} className="w-full">
                    Confirm Season Advancement
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
      
      <Tabs defaultValue="active" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="active">
            <Users className="h-4 w-4 mr-2" />
            Active Players
          </TabsTrigger>
          <TabsTrigger value="retired">
            <UserMinus className="h-4 w-4 mr-2" />
            Retired Players
          </TabsTrigger>
          <TabsTrigger value="archives">
            <History className="h-4 w-4 mr-2" />
            Season Archives
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Active Players</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>School</TableHead>
                    {user?.role === 'admin' && <TableHead>Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlayers.map(player => {
                    const team = getPlayerTeam(player);
                    const school = getPlayerSchool(player);
                    
                    return (
                      <TableRow key={player.id}>
                        <TableCell>{player.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <GraduationCap className="h-4 w-4 mr-2 text-gray-500" />
                            {getGradeDisplay(player.grade)}
                          </div>
                        </TableCell>
                        <TableCell>{team ? `${team.gender} Team` : 'Unknown'}</TableCell>
                        <TableCell>{school ? school.name : 'Unknown'}</TableCell>
                        {user?.role === 'admin' && (
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedPlayer(player);
                                  setIsTransferDialogOpen(true);
                                }}
                              >
                                <Transfer className="h-4 w-4 text-blue-500" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRetirePlayer(player)}
                              >
                                <UserMinus className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              
              {filteredPlayers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No active players found
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="retired" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Retired Players</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Last Grade</TableHead>
                    <TableHead>Last Team</TableHead>
                    <TableHead>Last School</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlayers.map(player => {
                    const team = getPlayerTeam(player);
                    const school = getPlayerSchool(player);
                    
                    return (
                      <TableRow key={player.id}>
                        <TableCell>{player.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <GraduationCap className="h-4 w-4 mr-2 text-gray-500" />
                            {getGradeDisplay(player.grade)}
                          </div>
                        </TableCell>
                        <TableCell>{team ? `${team.gender} Team` : 'Unknown'}</TableCell>
                        <TableCell>{school ? school.name : 'Unknown'}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              
              {filteredPlayers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No retired players found
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="archives" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Season Archives</CardTitle>
                
                <Select 
                  value={selectedSeasonId} 
                  onValueChange={setSelectedSeasonId}
                >
                  <SelectTrigger className="w-[220px]">
                    <SelectValue placeholder="Select season" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={currentSeason.id}>
                      {currentSeason.name} (Current)
                    </SelectItem>
                    {archivedSeasons.map(season => (
                      <SelectItem key={season.id} value={season.id}>
                        {season.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>School</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlayers.map(player => {
                    const team = getPlayerTeam(player);
                    const school = getPlayerSchool(player);
                    
                    return (
                      <TableRow key={player.id}>
                        <TableCell>{player.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <GraduationCap className="h-4 w-4 mr-2 text-gray-500" />
                            {getGradeDisplay(player.grade)}
                          </div>
                        </TableCell>
                        <TableCell>{team ? `${team.gender} Team` : 'Unknown'}</TableCell>
                        <TableCell>{school ? school.name : 'Unknown'}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${
                            player.status === 'active' ? 'bg-green-100 text-green-800' :
                            player.status === 'retired' ? 'bg-gray-100 text-gray-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {player.status.charAt(0).toUpperCase() + player.status.slice(1)}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              
              {filteredPlayers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No players found for this season
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Transfer Player Dialog */}
      <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transfer Player</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedPlayer && (
              <>
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="font-medium">Current Information</h3>
                  <div className="mt-2 space-y-1 text-sm">
                    <p><span className="font-medium">Player:</span> {selectedPlayer.name}</p>
                    <p><span className="font-medium">Grade:</span> {getGradeDisplay(selectedPlayer.grade)}</p>
                    <p><span className="font-medium">Team:</span> {getTeamDisplay(getPlayerTeam(selectedPlayer), getPlayerSchool(selectedPlayer))}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="new-team">Transfer to Team</Label>
                  <Select value={transferTeamId} onValueChange={setTransferTeamId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination team" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams
                        .filter(team => team.id !== selectedPlayer.teamId)
                        .map(team => {
                          const school = schools.find(s => s.id === team.schoolId);
                          return (
                            <SelectItem key={team.id} value={team.id}>
                              {school ? `${school.name} ${team.gender}` : `Unknown ${team.gender} Team`}
                            </SelectItem>
                          );
                        })}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  onClick={handleTransferSubmit} 
                  className="w-full"
                  disabled={!transferTeamId}
                >
                  <Transfer className="h-4 w-4 mr-2" />
                  Complete Transfer
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlayerManagement;
