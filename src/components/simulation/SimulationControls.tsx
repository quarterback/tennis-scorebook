import React, { useState, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { PlayerSkillTier } from '@/types';

const SimulationControls = () => {
  const {
    teams,
    players,
    addPlayer,
    generateMatches,
    generatingMatches,
    schools,
    districts,
    ladders,
    generatePlayers,
    isGeneratingPlayers
  } = useData();
  
  const [startDate, setStartDate] = useState('2024-09-01');
  const [endDate, setEndDate] = useState('2025-05-31');
  const [doubleRoundRobin, setDoubleRoundRobin] = useState(true);
  
  useEffect(() => {
    const today = new Date();
    const nextYear = today.getFullYear() + 1;
    
    setStartDate(`${today.getFullYear()}-09-01`);
    setEndDate(`${nextYear}-05-31`);
  }, []);
  
  const handleGenerateMatches = () => {
    generateMatches({
      startDate: startDate,
      endDate: endDate,
      doubleRoundRobin: doubleRoundRobin
    });
  };
  
  const handleGeneratePlayers = () => {
    const currentSeason = {
      id: crypto.randomUUID(),
      year: new Date().getFullYear(),
      name: `Fall ${new Date().getFullYear()}`,
      isCurrent: true
    };
    
    generatePlayers(teams, schools, currentSeason.id);
  };
  
  const addMissingPlayers = (teamId: string, playersNeeded: number, seasonId: string) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return;
    
    for (let i = 0; i < playersNeeded; i++) {
      addPlayer({
        name: `${team.gender === 'Boys' ? 'Player' : 'Player'} ${Math.floor(Math.random() * 100)}`,
        grade: Math.floor(Math.random() * 4) + 9,
        teamId: teamId,
        seasons: [seasonId],
        skillTier: 'developmental' as PlayerSkillTier,
        gender: team.gender // Add gender field to fix the TS error
      });
    }
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
        addMissingPlayers(team.id, playersNeeded, currentSeason.id);
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
            value={doubleRoundRobin}
            onChange={e => setDoubleRoundRobin(e.target.value === 'true')}
          >
            <option value={true}>Yes</option>
            <option value={false}>No</option>
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
