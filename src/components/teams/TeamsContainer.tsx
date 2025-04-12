
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import SchoolSelector from './SchoolSelector';
import TeamsList from './TeamsList';
import TeamManager from './TeamManager';
import AddTeamDialog from './AddTeamDialog';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { Team, Gender, Player, School } from '@/types';

interface TeamsContainerProps {
  initialSchoolId: string | null;
}

const TeamsContainer = ({ initialSchoolId }: TeamsContainerProps) => {
  const { schools, teams, addTeam, updateTeam, deleteTeam, players, addPlayer, deletePlayer, districts } = useData();
  const { user } = useAuth();
  
  const [isAddTeamDialogOpen, setIsAddTeamDialogOpen] = useState(false);
  const [isAddPlayerDialogOpen, setIsAddPlayerDialogOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(initialSchoolId);
  
  const [teamFormData, setTeamFormData] = useState<{ schoolId: string; gender: Gender }>({
    schoolId: selectedSchoolId || '',
    gender: 'Boys'
  });
  
  const [playerFormData, setPlayerFormData] = useState<Omit<Player, 'id' | 'status' | 'seasonId'>>({
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
    if (initialSchoolId && schools.some(s => s.id === initialSchoolId)) {
      setSelectedSchoolId(initialSchoolId);
      setTeamFormData(prev => ({ ...prev, schoolId: initialSchoolId }));
    } else if (filteredSchools.length > 0 && !selectedSchoolId) {
      setSelectedSchoolId(filteredSchools[0].id);
      setTeamFormData(prev => ({ ...prev, schoolId: filteredSchools[0].id }));
    }
  }, [initialSchoolId, schools, filteredSchools, selectedSchoolId]);
  
  // Get teams for the selected school
  const schoolTeams = teams.filter(team => 
    team.schoolId === selectedSchoolId
  );
  
  // Get the selected school
  const selectedSchool = schools.find(s => s.id === selectedSchoolId);
  
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

  const handleSchoolChange = (schoolId: string) => {
    setSelectedSchoolId(schoolId);
    setSelectedTeamId(null);
    setTeamFormData(prev => ({ ...prev, schoolId }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-4">
        <SchoolSelector 
          schools={filteredSchools}
          districts={districts}
          selectedSchoolId={selectedSchoolId}
          onSchoolChange={handleSchoolChange}
        />
        
        {selectedSchool && (
          <div className="flex justify-between items-center mt-2 px-2">
            <div className="font-medium">Teams</div>
            
            {canEditTeam(selectedSchoolId as string) && (
              <Dialog open={isAddTeamDialogOpen} onOpenChange={setIsAddTeamDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Team
                  </Button>
                </DialogTrigger>
                <AddTeamDialog 
                  teamFormData={teamFormData}
                  setTeamFormData={setTeamFormData}
                  handleAddTeam={handleAddTeam}
                  schools={filteredSchools}
                  isCoach={user?.role === 'coach'}
                />
              </Dialog>
            )}
          </div>
        )}
        
        <TeamsList 
          teams={schoolTeams}
          players={players}
          selectedTeamId={selectedTeamId}
          selectedSchool={selectedSchool}
          isAddTeamDialogOpen={isAddTeamDialogOpen}
          setIsAddTeamDialogOpen={setIsAddTeamDialogOpen}
          canEditTeam={canEditTeam}
          handleDeleteTeam={handleDeleteTeam}
          onTeamSelect={setSelectedTeamId}
        />
      </div>
      
      <div className="lg:col-span-2">
        <TeamManager 
          selectedTeamId={selectedTeamId}
          canEditTeam={canEditTeam}
          isAddPlayerDialogOpen={isAddPlayerDialogOpen}
          setIsAddPlayerDialogOpen={setIsAddPlayerDialogOpen}
          playerFormData={playerFormData}
          setPlayerFormData={setPlayerFormData}
          handleAddPlayer={handleAddPlayer}
        />
      </div>
    </div>
  );
};

export default TeamsContainer;
