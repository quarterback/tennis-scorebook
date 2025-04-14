
import React, { useState } from 'react';
import TeamManager from '@/components/teams/TeamManager';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trophy, Clipboard } from 'lucide-react';
import TeamsContainer from '@/components/teams/TeamsContainer';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import SimulationControls from '@/components/simulation/SimulationControls';
import ExportDataDialog from '@/components/data/ExportDataDialog';

export default function Teams() {
  const { user } = useAuth();
  const { schools, teams, players, currentSeason } = useData();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  const handleRosterReportClick = () => {
    // Generate and download roster report as CSV
    const rosterData = players.map(player => {
      const team = teams.find(t => t.id === player.teamId);
      const school = team ? schools.find(s => s.id === team.schoolId) : null;
      
      return {
        playerName: player.name,
        grade: player.grade,
        teamType: team?.gender || 'Unknown',
        schoolName: school?.name || 'Unknown',
        status: player.status
      };
    });
    
    // Create CSV content
    const headers = ['playerName', 'grade', 'teamType', 'schoolName', 'status'];
    const csvRows = [
      headers.join(','),
      ...rosterData.map(row => 
        headers.map(header => {
          const value = row[header as keyof typeof row];
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value;
        }).join(',')
      )
    ];
    
    const csvContent = csvRows.join('\n');
    
    // Download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'tennis_roster_report.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Roster Report Downloaded",
      description: `CSV file with ${rosterData.length} players created successfully.`
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Teams</h1>

        <div className="flex gap-2">
          {user?.role === 'admin' && (
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Team
            </Button>
          )}
          <Button variant="outline" onClick={handleRosterReportClick}>
            <Trophy className="h-4 w-4 mr-2" />
            Roster Report
          </Button>
          <ExportDataDialog />
        </div>
      </div>

      {user?.role === 'admin' && <SimulationControls />}

      <Tabs defaultValue="allTeams">
        <TabsList className="mb-6">
          <TabsTrigger value="allTeams">All Teams</TabsTrigger>
          <TabsTrigger value="4A">4A/3A/2A/1A</TabsTrigger>
          <TabsTrigger value="5A">5A</TabsTrigger>
          <TabsTrigger value="6A">6A</TabsTrigger>
        </TabsList>

        <TabsContent value="allTeams">
          <TeamsContainer filter={{}} />
        </TabsContent>
        <TabsContent value="4A">
          <TeamsContainer filter={{ classification: '4A/3A/2A/1A' }} />
        </TabsContent>
        <TabsContent value="5A">
          <TeamsContainer filter={{ classification: '5A' }} />
        </TabsContent>
        <TabsContent value="6A">
          <TeamsContainer filter={{ classification: '6A' }} />
        </TabsContent>
      </Tabs>

      {isAddDialogOpen && (
        <TeamManager 
          selectedTeamId={null}
          canEditTeam={() => true}
          isAddPlayerDialogOpen={false}
          setIsAddPlayerDialogOpen={() => {}}
          playerFormData={{
            name: '',
            grade: 9,
            teamId: '',
            seasons: [currentSeason.id] // Add the current season ID
          }}
          setPlayerFormData={() => {}}
          handleAddPlayer={() => {}}
        />
      )}
    </div>
  );
}
