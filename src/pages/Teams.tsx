
import React, { useState, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, UserPlus, Plus, Trash } from 'lucide-react';
import { Team, Gender, Player } from '@/types';

const Teams = () => {
  const { schools, teams, addTeam, updateTeam, deleteTeam, players, addPlayer, deletePlayer, districts } = useData();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const schoolIdParam = searchParams.get('school');
  
  const [isAddTeamDialogOpen, setIsAddTeamDialogOpen] = useState(false);
  const [isAddPlayerDialogOpen, setIsAddPlayerDialogOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(schoolIdParam);
  
  const [teamFormData, setTeamFormData] = useState<{ schoolId: string; gender: Gender }>({
    schoolId: selectedSchoolId || '',
    gender: 'Boys'
  });
  
  const [playerFormData, setPlayerFormData] = useState<Omit<Player, 'id'>>({
    name: '',
    grade: 9,
    teamId: ''
  });
  
  // Filter schools if coach
  const filteredSchools = user?.role === 'coach' && user.schoolId
    ? schools.filter(school => school.id === user.schoolId)
    : schools;
  
  // Set initial school selection based on URL parameter or first available school
  useEffect(() => {
    if (schoolIdParam && schools.some(s => s.id === schoolIdParam)) {
      setSelectedSchoolId(schoolIdParam);
      setTeamFormData(prev => ({ ...prev, schoolId: schoolIdParam }));
    } else if (filteredSchools.length > 0 && !selectedSchoolId) {
      setSelectedSchoolId(filteredSchools[0].id);
      setTeamFormData(prev => ({ ...prev, schoolId: filteredSchools[0].id }));
    }
  }, [schoolIdParam, schools, filteredSchools, selectedSchoolId]);
  
  // Get teams for the selected school
  const schoolTeams = teams.filter(team => 
    team.schoolId === selectedSchoolId
  );
  
  // Get the selected school
  const selectedSchool = schools.find(s => s.id === selectedSchoolId);

  // Get the district for the selected school
  const selectedDistrict = selectedSchool 
    ? districts.find(d => d.id === selectedSchool.districtId)
    : undefined;
  
  // Get players for the selected team
  const teamPlayers = selectedTeamId
    ? players.filter(player => player.teamId === selectedTeamId)
      .sort((a, b) => b.grade - a.grade || a.name.localeCompare(b.name))
    : [];
  
  const handleAddTeam = (e: React.FormEvent) => {
    e.preventDefault();
    addTeam({
      schoolId: teamFormData.schoolId,
      gender: teamFormData.gender,
      players: [],
      coaches: user?.role === 'coach' && user.id ? [user.id] : []
    });
    setIsAddTeamDialogOpen(false);
  };
  
  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTeamId) {
      addPlayer({
        name: playerFormData.name,
        grade: playerFormData.grade,
        teamId: selectedTeamId
      });
      setPlayerFormData({
        name: '',
        grade: 9,
        teamId: selectedTeamId
      });
      setIsAddPlayerDialogOpen(false);
    }
  };
  
  const handleRemovePlayer = (playerId: string) => {
    if (confirm('Are you sure you want to remove this player?')) {
      deletePlayer(playerId);
    }
  };
  
  const handleDeleteTeam = (teamId: string) => {
    if (confirm('Are you sure you want to delete this team? All players will be removed.')) {
      deleteTeam(teamId);
      if (selectedTeamId === teamId) {
        setSelectedTeamId(null);
      }
    }
  };
  
  const canEditTeam = (teamId: string) => {
    if (user?.role === 'admin') return true;
    if (user?.role === 'coach') {
      const team = teams.find(t => t.id === teamId);
      return team?.schoolId === user.schoolId;
    }
    return false;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Teams</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-tennis-blue" />
                  Schools
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedSchoolId || ''}
                onValueChange={(value) => {
                  setSelectedSchoolId(value);
                  setSelectedTeamId(null);
                  setTeamFormData(prev => ({ ...prev, schoolId: value }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a school" />
                </SelectTrigger>
                <SelectContent>
                  {filteredSchools.map((school) => (
                    <SelectItem key={school.id} value={school.id}>
                      {school.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedSchool && (
                <div className="mt-4 text-sm">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="font-medium">Classification:</span> {selectedSchool.classification}
                    </div>
                    <div>
                      <span className="font-medium">District:</span> {selectedDistrict?.name || 'Unknown'}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="font-medium">Teams</div>
                    
                    {canEditTeam(selectedSchoolId as string) && (
                      <Dialog open={isAddTeamDialogOpen} onOpenChange={setIsAddTeamDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="flex items-center">
                            <Plus className="h-4 w-4 mr-1" />
                            Add Team
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add New Team</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleAddTeam} className="space-y-4 pt-4">
                            <div className="space-y-2">
                              <Label htmlFor="team-school">School</Label>
                              <Select
                                value={teamFormData.schoolId}
                                onValueChange={(value) => setTeamFormData({ ...teamFormData, schoolId: value })}
                                disabled={user?.role === 'coach'}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a school" />
                                </SelectTrigger>
                                <SelectContent>
                                  {filteredSchools.map((school) => (
                                    <SelectItem key={school.id} value={school.id}>
                                      {school.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="team-gender">Gender</Label>
                              <Select
                                value={teamFormData.gender}
                                onValueChange={(value) => setTeamFormData({ ...teamFormData, gender: value as Gender })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Boys">Boys</SelectItem>
                                  <SelectItem value="Girls">Girls</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="flex justify-end pt-4">
                              <Button type="submit" className="bg-tennis-blue hover:bg-tennis-darkBlue">
                                Add Team
                              </Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              )}
              
              {selectedSchool && schoolTeams.length > 0 ? (
                <div className="mt-4 space-y-2">
                  {schoolTeams.map((team) => (
                    <div
                      key={team.id}
                      className={`tennis-card ${team.gender === 'Boys' ? 'team-boys' : 'team-girls'} cursor-pointer p-3 ${
                        selectedTeamId === team.id ? 'bg-gray-100' : ''
                      }`}
                      onClick={() => setSelectedTeamId(team.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="font-medium">{selectedSchool.name} {team.gender}</div>
                        
                        {canEditTeam(team.id) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 opacity-70 hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTeam(team.id);
                            }}
                          >
                            <Trash className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {players.filter(p => p.teamId === team.id).length} Players
                      </div>
                    </div>
                  ))}
                </div>
              ) : selectedSchool ? (
                <div className="mt-4 text-center text-gray-500 py-6">
                  No teams available for this school
                </div>
              ) : (
                <div className="mt-4 text-center text-gray-500 py-6">
                  Select a school to view teams
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <UserPlus className="h-5 w-5 mr-2 text-tennis-green" />
                  {selectedTeamId ? 'Team Roster' : 'Select a Team'}
                </span>
                
                {selectedTeamId && canEditTeam(selectedTeamId) && (
                  <Dialog open={isAddPlayerDialogOpen} onOpenChange={setIsAddPlayerDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-tennis-green hover:bg-green-600">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Player
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Player</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleAddPlayer} className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label htmlFor="player-name">Player Name</Label>
                          <input
                            id="player-name"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={playerFormData.name}
                            onChange={(e) => setPlayerFormData({ ...playerFormData, name: e.target.value })}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="player-grade">Grade</Label>
                          <Select
                            value={playerFormData.grade.toString()}
                            onValueChange={(value) => setPlayerFormData({ ...playerFormData, grade: parseInt(value) })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select grade" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="9">9th Grade</SelectItem>
                              <SelectItem value="10">10th Grade</SelectItem>
                              <SelectItem value="11">11th Grade</SelectItem>
                              <SelectItem value="12">12th Grade</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex justify-end pt-4">
                          <Button type="submit" className="bg-tennis-green hover:bg-green-600">
                            Add Player
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              {selectedTeamId ? (
                teamPlayers.length > 0 ? (
                  <Tabs defaultValue="12">
                    <TabsList className="grid grid-cols-4">
                      <TabsTrigger value="12">Seniors</TabsTrigger>
                      <TabsTrigger value="11">Juniors</TabsTrigger>
                      <TabsTrigger value="10">Sophomores</TabsTrigger>
                      <TabsTrigger value="9">Freshmen</TabsTrigger>
                    </TabsList>
                    
                    {[12, 11, 10, 9].map((grade) => (
                      <TabsContent key={grade} value={grade.toString()} className="space-y-2 mt-4">
                        {teamPlayers.filter(p => p.grade === grade).length > 0 ? (
                          teamPlayers
                            .filter(p => p.grade === grade)
                            .map((player) => (
                              <div key={player.id} className="tennis-card p-3">
                                <div className="flex justify-between items-center">
                                  <div className="font-medium">{player.name}</div>
                                  
                                  {canEditTeam(selectedTeamId) && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 w-7 p-0 opacity-70 hover:opacity-100"
                                      onClick={() => handleRemovePlayer(player.id)}
                                    >
                                      <Trash className="h-4 w-4 text-red-500" />
                                    </Button>
                                  )}
                                </div>
                                <div className="text-sm text-gray-500">
                                  Grade {player.grade}
                                </div>
                              </div>
                            ))
                        ) : (
                          <div className="text-center text-gray-500 py-6">
                            No {grade === 12 ? 'seniors' : grade === 11 ? 'juniors' : grade === 10 ? 'sophomores' : 'freshmen'} on this team
                          </div>
                        )}
                      </TabsContent>
                    ))}
                  </Tabs>
                ) : (
                  <div className="text-center text-gray-500 py-10">
                    No players added to this team yet
                  </div>
                )
              ) : (
                <div className="text-center text-gray-500 py-10">
                  Select a team to view and manage players
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Teams;
