import React, { useState, useEffect } from 'react';
import {
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box
} from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { useData } from '@/context/DataContext';
import { Team, Player, School } from '@/types';
import { useTeams } from '@/context/TeamsContext';
import { useSeasons } from '@/context/SeasonsContext';

const Teams = () => {
  const { teams, players, schools, addPlayer, deleteTeam, deletePlayer } = useData();
  const { selectedTeamId, setSelectedTeamId } = useTeams();
  const { currentSeason } = useSeasons();
  const [selectedSchool, setSelectedSchool] = useState<string>('');
  const [isAddPlayerDialogOpen, setIsAddPlayerDialogOpen] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerGrade, setNewPlayerGrade] = useState('9');
  const [isDeleteTeamDialogOpen, setIsDeleteTeamDialogOpen] = useState(false);
  const [isDeletePlayerDialogOpen, setIsDeletePlayerDialogOpen] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [newPlayerData, setNewPlayerData] = useState<Player | null>(null);

  useEffect(() => {
    if (teams.length > 0) {
      setSelectedTeamId(teams[0].id);
    }
  }, [teams, setSelectedTeamId]);

  const filteredTeams = selectedSchool
    ? teams.filter(team => {
      const school = schools.find(school => school.id === team.schoolId);
      return school?.id === selectedSchool;
    })
    : teams;

  const handleSchoolChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSchool(event.target.value);
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

  const handleNewPlayerNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewPlayerName(event.target.value);
  };

  const handleNewPlayerGradeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setNewPlayerGrade(event.target.value);
  };

  const handleAddPlayer = () => {
    // Add gender field to the player creation
    const selectedTeam = teams.find(t => t.id === selectedTeamId);
    if (!selectedTeam) return;
    
    addPlayer({
      name: newPlayerName,
      grade: Number(newPlayerGrade),
      teamId: selectedTeamId,
      seasons: [currentSeason?.id || ''],
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

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'grade', headerName: 'Grade', width: 100 },
    {
      field: 'teamName',
      headerName: 'Team',
      width: 200,
      valueGetter: (params: GridValueGetterParams) => {
        const team = teams.find(team => team.id === params.row.teamId);
        if (!team) return 'Unknown Team';
        const school = schools.find(school => school.id === team.schoolId);
        return `${school?.name || 'Unknown'} ${team.gender}`;
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => handleDeletePlayerDialogOpen(params.row.id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  const schoolOptions = [...new Set(schools.map(school => school.name))];

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Teams
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Select a School:
              </Typography>
              <FormControl fullWidth>
                <InputLabel id="school-select-label">School</InputLabel>
                <Select
                  labelId="school-select-label"
                  id="school-select"
                  value={selectedSchool}
                  label="School"
                  onChange={handleSchoolChange}
                >
                  <MenuItem value="">All Schools</MenuItem>
                  {schools.map((school) => (
                    <MenuItem key={school.id} value={school.id}>{school.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
                Teams:
              </Typography>
              {filteredTeams.map(team => (
                <Button
                  key={team.id}
                  variant={team.id === selectedTeamId ? 'contained' : 'outlined'}
                  color="primary"
                  fullWidth
                  style={{ marginBottom: '10px' }}
                  onClick={() => handleTeamSelect(team.id)}
                >
                  {schools.find(school => school.id === team.schoolId)?.name} - {team.gender}
                </Button>
              ))}
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={handleDeleteTeamDialogOpen}
              >
                Delete Team
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Players on Selected Team:
              </Typography>
              <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                  rows={selectedTeamPlayers}
                  columns={columns}
                  getRowId={(row) => row.id}
                  disableSelectionOnClick
                />
              </div>
              <Button
                variant="contained"
                color="primary"
                style={{ marginTop: '20px' }}
                onClick={handleAddPlayerDialogOpen}
              >
                Add New Player
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Player Dialog */}
      <Dialog open={isAddPlayerDialogOpen} onClose={handleAddPlayerDialogClose}>
        <DialogTitle>Add New Player</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Player Name"
            type="text"
            fullWidth
            value={newPlayerName}
            onChange={handleNewPlayerNameChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="grade-select-label">Grade</InputLabel>
            <Select
              labelId="grade-select-label"
              id="grade-select"
              value={newPlayerGrade}
              label="Grade"
              onChange={handleNewPlayerGradeChange}
            >
              <MenuItem value="9">9</MenuItem>
              <MenuItem value="10">10</MenuItem>
              <MenuItem value="11">11</MenuItem>
              <MenuItem value="12">12</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddPlayerDialogClose}>Cancel</Button>
          <Button onClick={handleAddPlayer}>Add Player</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Team Dialog */}
      <Dialog
        open={isDeleteTeamDialogOpen}
        onClose={handleDeleteTeamDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Team?"}</DialogTitle>
        <DialogContent>
          <Typography id="alert-dialog-description">
            Are you sure you want to delete this team? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteTeamDialogClose}>Cancel</Button>
          <Button onClick={handleDeleteTeam} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Player Dialog */}
      <Dialog
        open={isDeletePlayerDialogOpen}
        onClose={handleDeletePlayerDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Player?"}</DialogTitle>
        <DialogContent>
          <Typography id="alert-dialog-description">
            Are you sure you want to delete this player? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeletePlayerDialogClose}>Cancel</Button>
          <Button onClick={handleDeletePlayer} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Teams;
