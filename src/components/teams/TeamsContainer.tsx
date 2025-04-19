
import React, { useEffect } from 'react';
import SchoolSelector from './SchoolSelector';
import TeamsList from './TeamsList';
import TeamManager from './TeamManager';
import AddTeamDialog from './AddTeamDialog';
import { useData } from '@/context/DataContext';
import { Team } from '@/types';
import { useTeamManagement } from '@/hooks/useTeamManagement';
import { usePlayerManagement } from '@/hooks/usePlayerManagement';
import { useSchoolFiltering } from './SchoolFiltering';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TeamsContainerProps {
  filter: {
    classification?: string;
  };
}

const TeamsContainer = ({ filter }: TeamsContainerProps) => {
  const { schools, teams, districts } = useData();
  
  const {
    selectedTeamId,
    setSelectedTeamId,
    selectedSchoolId,
    setSelectedSchoolId,
    isAddTeamDialogOpen,
    setIsAddTeamDialogOpen,
    teamFormData,
    setTeamFormData,
    handleAddTeam,
    handleDeleteTeam,
    canEditTeam,
    handleSchoolChange
  } = useTeamManagement();

  const {
    isAddPlayerDialogOpen,
    setIsAddPlayerDialogOpen,
    playerFormData,
    setPlayerFormData,
    handleAddPlayer
  } = usePlayerManagement(selectedTeamId);

  const { classificationFilteredSchools } = useSchoolFiltering({ schools, filter });
  
  // Filter teams by selected school
  const schoolTeams = selectedSchoolId ? teams.filter(team => team.schoolId === selectedSchoolId) : [];
  
  const selectedSchool = schools.find(s => s.id === selectedSchoolId);

  useEffect(() => {
    if (classificationFilteredSchools.length > 0 && !selectedSchoolId) {
      handleSchoolChange(classificationFilteredSchools[0].id);
    }
  }, [classificationFilteredSchools, selectedSchoolId]);

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
                  isCoach={false}
                />
              </Dialog>
            )}
          </div>
        )}
        
        <TeamsList 
          teams={schoolTeams}
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
