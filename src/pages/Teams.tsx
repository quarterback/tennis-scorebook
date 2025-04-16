
import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useData } from '@/context/DataContext';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import TeamsContainer from '@/components/teams/TeamsContainer';

const Teams = () => {
  const { teams, players, schools, addPlayer, deleteTeam, deletePlayer } = useData();
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [selectedSchool, setSelectedSchool] = useState<string>('');
  const [isAddPlayerDialogOpen, setIsAddPlayerDialogOpen] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerGrade, setNewPlayerGrade] = useState('9');
  const [isDeleteTeamDialogOpen, setIsDeleteTeamDialogOpen] = useState(false);
  const [isDeletePlayerDialogOpen, setIsDeletePlayerDialogOpen] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  useEffect(() => {
    if (teams.length > 0) {
      setSelectedTeamId(teams[0].id);
    }
  }, [teams]);

  const filteredTeams = selectedSchool
    ? teams.filter(team => {
      const school = schools.find(school => school.id === team.schoolId);
      return school?.id === selectedSchool;
    })
    : teams;

  const handleSchoolChange = (value: string) => {
    setSelectedSchool(value);
  };

  const handleTeamSelect = (teamId: string) => {
    setSelectedTeamId(teamId);
  };

  const handleAddPlayerDialogOpen = () => {
    setIsAddPlayerDialogOpen(true);
  };

  const handleAddPlayerDialogClose = () => {
    setIsAddPlayerDialogOpen(false);
  };

  const handleAddPlayer = () => {
    const selectedTeam = teams.find(t => t.id === selectedTeamId);
    if (!selectedTeam) return;
    
    addPlayer({
      name: newPlayerName,
      grade: Number(newPlayerGrade),
      teamId: selectedTeamId,
      seasons: [],
      gender: selectedTeam.gender // Add gender field to fix the TS error
    });
    
    setNewPlayerName('');
    setNewPlayerGrade('9');
    setIsAddPlayerDialogOpen(false);
  };

  const handleDeleteTeamDialogOpen = () => {
    setIsDeleteTeamDialogOpen(true);
  };

  const handleDeleteTeamDialogClose = () => {
    setIsDeleteTeamDialogOpen(false);
  };

  const handleDeleteTeam = () => {
    if (selectedTeamId) {
      deleteTeam(selectedTeamId);
      setSelectedTeamId('');
      setIsDeleteTeamDialogOpen(false);
    }
  };

  const handleDeletePlayerDialogOpen = (playerId: string) => {
    setSelectedPlayerId(playerId);
    setIsDeletePlayerDialogOpen(true);
  };

  const handleDeletePlayerDialogClose = () => {
    setIsDeletePlayerDialogOpen(false);
    setSelectedPlayerId(null);
  };

  const handleDeletePlayer = () => {
    if (selectedPlayerId) {
      deletePlayer(selectedPlayerId);
      setIsDeletePlayerDialogOpen(false);
      setSelectedPlayerId(null);
    }
  };

  const selectedTeamPlayers = players.filter(player => player.teamId === selectedTeamId);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Teams</h1>
      
      {/* Use the TeamsContainer component to manage teams */}
      <TeamsContainer filter={{}} />
    </div>
  );
};

export default Teams;
