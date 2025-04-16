import React, { useState, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { PlayerSkillTier } from '@/types';

interface SimulationControlsProps {
  onSimulationComplete: (results: any) => void;
}

const SimulationControls: React.FC<SimulationControlsProps> = ({ onSimulationComplete }) => {
  const {
    teams,
    players,
    addPlayer,
    addMatch,
    schools,
    districts,
    deleteAllMatches,
    deleteAllPlayers
  } = useData();
  
  const [startDate, setStartDate] = useState('2024-09-01');
  const [endDate, setEndDate] = useState('2025-05-31');
  const [doubleRoundRobin, setDoubleRoundRobin] = useState(true);
  const [generatingMatches, setGeneratingMatches] = useState(false);
  const [isGeneratingPlayers, setIsGeneratingPlayers] = useState(false);
  
  useEffect(() => {
    const today = new Date();
    const nextYear = today.getFullYear() + 1;
    
    setStartDate(`${today.getFullYear()}-09-01`);
    setEndDate(`${nextYear}-05-31`);
  }, []);
  
  const handleGenerateMatches = () => {
    setGeneratingMatches(true);
    
    // Clear existing matches first
    deleteAllMatches();
    
    // Import needed hook dynamically to avoid circular dependencies
    import('@/hooks/useMatchGeneration').then(({ useMatchGeneration }) => {
      const { generateMatchData } = useMatchGeneration();
      
      try {
        const matches = generateMatchData(
          teams,
          schools,
          districts,
          players,
          [], // Empty ladders array as it's not actually used in the simulation logic
          {
            startDate,
            endDate,
            doubleRoundRobin: doubleRoundRobin
          }
        );
        
        // Add all generated matches to the state
        matches.forEach(match => {
          addMatch(match);
        });
        
        console.log(`Generated ${matches.length} matches successfully`);
      } catch (error) {
        console.error('Error generating matches:', error);
      } finally {
        setGeneratingMatches(false);
      }
    });
  };
  
  const handleGeneratePlayers = () => {
    setIsGeneratingPlayers(true);
    
    // Clear existing players first
    deleteAllPlayers();
    
    const currentSeason = {
      id: crypto.randomUUID(),
      year: new Date().getFullYear(),
      name: `Fall ${new Date().getFullYear()}`,
      isCurrent: true
    };
    
    // Import needed hook dynamically
    import('@/hooks/usePlayerGeneration').then(({ usePlayerGeneration }) => {
      const { generatePlayerData } = usePlayerGeneration();
      
      try {
        const { players: generatedPlayers } = generatePlayerData(teams, schools, currentSeason.id);
        
        // Add all generated players to the state
        generatedPlayers.forEach(player => {
          addPlayer(player);
        });
        
        console.log(`Generated ${generatedPlayers.length} players successfully`);
      } catch (error) {
        console.error('Error generating players:', error);
      } finally {
        setIsGeneratingPlayers(false);
      }
    });
  };
  
  const handleAddPlayersToAllTeams = () => {
    const currentSeason = {
      id: crypto.randomUUID(),
      year: new Date().getFullYear(),
      name: `Fall ${new Date().getFullYear()}`,
      isCurrent: true
    };
    
    teams.forEach(team => {
      const teamPlayers = players.filter(p => p.teamId === team.id);
      const playersNeeded = 12 - teamPlayers.length;
      
      if (playersNeeded > 0) {
        for (let i = 0; i < playersNeeded; i++) {
          addPlayer({
            name: `${team.gender === 'Boys' ? 'Player' : 'Player'} ${Math.floor(Math.random() * 100)}`,
            grade: Math.floor(Math.random() * 4) + 9,
            teamId: team.id,
            seasons: [currentSeason.id],
            skillTier: 'developmental' as PlayerSkillTier,
            gender: team.gender // Add gender field to fix the TS error
          });
        }
      }
    });
  };

  return (
    <div className="simulation-controls">
      <h2>Simulation Controls</h2>
      
      <div className="date-range">
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
        </label>
        
        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
        </label>
      </div>
      
      <div className="round-robin-select">
        <label>
          Double Round Robin:
          <select 
            value={doubleRoundRobin ? "true" : "false"}
            onChange={e => setDoubleRoundRobin(e.target.value === "true")}
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </label>
      </div>
      
      <button onClick={handleGenerateMatches} disabled={generatingMatches}>
        {generatingMatches ? 'Generating Matches...' : 'Generate Matches'}
      </button>
      
      <button onClick={handleGeneratePlayers} disabled={isGeneratingPlayers}>
        {isGeneratingPlayers ? 'Generating Players...' : 'Generate Players'}
      </button>
      
      <button onClick={handleAddPlayersToAllTeams}>
        Add Players to All Teams
      </button>
    </div>
  );
};

export default SimulationControls;
