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
import { useToast } from '@/components/ui/use-toast';

interface TeamsContainerProps {
  filter: {
    classification?: string;
  };
}

const TeamsContainer = ({ filter }: TeamsContainerProps) => {
  const { schools, teams, addTeam, updateTeam, deleteTeam, players, addPlayer, deletePlayer, districts, currentSeason } = useData();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isAddTeamDialogOpen, setIsAddTeamDialogOpen] = useState(false);
  const [isAddPlayerDialogOpen, setIsAddPlayerDialogOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);
  
  const [teamFormData, setTeamFormData] = useState<{ schoolId: string; gender: Gender }>({
    schoolId: selectedSchoolId || '',
    gender: 'Boys'
  });
  
  const [playerFormData, setPlayerFormData] = useState<Omit<Player, 'id' | 'status' | 'seasonId'>>({
    name: '',
    grade: 9,
    teamId: '',
    seasons: [],
    gender: 'Boys'
  });
  
  // Filter schools based on user role and selected classification
  const filteredSchools = user?.role === 'coach' && user.schoolId
    ? schools.filter(school => school.id === user.schoolId)
    : schools;
  
  const classificationFilteredSchools = filter.classification 
    ? filteredSchools.filter(school => school.classification === filter.classification)
    : filteredSchools;
  
  useEffect(() => {
    // Debug logs
    console.log("TeamsContainer mounted");
    console.log("Total teams in system:", teams.length);
    console.log("Total schools:", schools.length);
    console.log("Filtered schools:", classificationFilteredSchools.length);
    
    if (classificationFilteredSchools.length > 0 && !selectedSchoolId) {
      setSelectedSchoolId(classificationFilteredSchools[0].id);
      setTeamFormData(prev => ({ ...prev, schoolId: classificationFilteredSchools[0].id }));
    }
  }, [classificationFilteredSchools, selectedSchoolId, teams, schools]);
  
  // Filter teams by selected school - ensure this filter works properly
  const schoolTeams = selectedSchoolId ? teams.filter(team => team.schoolId === selectedSchoolId) : [];
  
  // Debug logging for team filtering
  useEffect(() => {
    if (selectedSchoolId) {
      console.log(`Teams for school ${selectedSchoolId}:`, schoolTeams.length);
      console.log("School teams:", schoolTeams);
    }
  }, [selectedSchoolId, schoolTeams]);
  
  const selectedSchool = schools.find(s => s.id === selectedSchoolId);
  
  const handleAddTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamFormData.schoolId) {
      toast({
        title: "Error",
        description: "Please select a school",
        variant: "destructive"
      });
      return;
    }
    
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
    
    if (!selectedTeamId) {
      toast({
        title: "Error",
        description: "No team selected",
        variant: "destructive"
      });
      return;
    }
    
    const selectedTeam = teams.find(t => t.id === selectedTeamId);
    if (!selectedTeam) {
      toast({
        title: "Error",
        description: "Selected team not found",
        variant: "destructive"
      });
      return;
    }
    
    addPlayer({
      name: playerFormData.name,
      grade: playerFormData.grade,
      teamId: selectedTeamId,
      seasons: [currentSeason?.id || ''],
      gender: selectedTeam.gender
    });
    
    setPlayerFormData(prev => ({
      ...prev,
      name: '',
      grade: 9
    }));
    
    setIsAddPlayerDialogOpen(false);
    
    toast({
      title: "Player Added",
      description: `${playerFormData.name} has been added to the team roster`,
    });
  };
  
  const handleDeleteTeam = (teamId: string) => {
    if (window.confirm('Are you sure you want to delete this team? All players will be removed.')) {
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
    console.log("School changed to:", schoolId);
    setSelectedSchoolId(schoolId);
    setSelectedTeamId(null);
    setTeamFormData(prev => ({ ...prev, schoolId }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-4">
        <SchoolSelector 
          schools={classificationFilteredSchools}
          districts={districts}
          selectedSchoolId={selectedSchoolId}
          onSchoolChange={handleSchoolChange}
        />
        
        {selectedSchool && (
          <div className="flex justify-between items-center mt-2 px-2">
            <div className="font-medium">Teams</div>
            
            {selectedSchoolId && canEditTeam(selectedSchoolId) && (
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
                  schools={classificationFilteredSchools}
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
