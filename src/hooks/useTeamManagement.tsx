
import { useState } from 'react';
import { Team, School, Gender, Player } from '@/types';
import { useData } from '@/context/DataContext';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';

export const useTeamManagement = () => {
  const { teams, addTeam, deleteTeam, currentSeason } = useData();
  const { user } = useAuth();
  const { toast } = useToast();

  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);
  const [isAddTeamDialogOpen, setIsAddTeamDialogOpen] = useState(false);
  const [teamFormData, setTeamFormData] = useState<{ schoolId: string; gender: Gender }>({
    schoolId: '',
    gender: 'Boys'
  });

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
    setSelectedSchoolId(schoolId);
    setSelectedTeamId(null);
    setTeamFormData(prev => ({ ...prev, schoolId }));
  };

  return {
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
  };
};
