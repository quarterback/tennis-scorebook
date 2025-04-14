
import React, { useState, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { useSimulatedData } from '@/hooks/useSimulatedData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { FlaskConical, Settings2 } from 'lucide-react';
import { format } from 'date-fns';
import { MatchGenerationConfig } from '@/types/ranking';
import { Season } from '@/types';

// Import components
import SeasonSelector from './components/SeasonSelector';
import DateRangePicker from './components/DateRangePicker';
import MatchCountInputs from './components/MatchCountInputs';
import RoundRobinToggle from './components/RoundRobinToggle';
import SeasonInfoAlert from './components/SeasonInfoAlert';
import SimulationWarning from './components/SimulationWarning';
import ProgressIndicator from './components/ProgressIndicator';
import SimulationError from './components/SimulationError';

// Import constants and hooks
import { extendedSeasonsList } from './constants/seasons';
import { useSeasonCalculations } from './hooks/useSeasonCalculations';

const SimulationControls: React.FC = () => {
  const { 
    schools, teams, districts, currentSeason, seasons,
    addPlayer, addMatch, getArchivedSeasons
  } = useData();
  
  const { generateAllData, generatingData, progress, verifyTeamsForSimulation } = useSimulatedData();
  
  const [isOpen, setIsOpen] = useState(false);
  
  // Season selection - use the extended list instead of just what's in the database
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>('spring-2025');
  
  // Date states - default to Oregon's typical spring tennis season: early March to mid-May
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date(new Date().getFullYear(), 2, 1) // March 1st of current year
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    new Date(new Date().getFullYear(), 4, 15) // May 15th of current year
  );
  
  // Update date defaults when selected season changes
  useEffect(() => {
    const selectedSeason = extendedSeasonsList.find(s => s.id === selectedSeasonId);
    if (selectedSeason) {
      const year = selectedSeason.year;
      setStartDate(new Date(year, 2, 1)); // March 1st of selected year
      setEndDate(new Date(year, 4, 15));  // May 15th of selected year
    }
  }, [selectedSeasonId]);
  
  // Configuration states
  const [maxRegularMatches, setMaxRegularMatches] = useState(16);
  const [maxTotalMatches, setMaxTotalMatches] = useState(20);
  const [doubleRoundRobin, setDoubleRoundRobin] = useState(true);
  
  // Error states
  const [simulationError, setSimulationError] = useState<string | null>(null);
  
  // Get season calculations
  const { seasonWeeks, theoreticalMaxMatches } = useSeasonCalculations(startDate, endDate);
  
  // Get the selected season for date validation
  const selectedSeason = extendedSeasonsList.find(s => s.id === selectedSeasonId);
  const selectedYear = selectedSeason?.year || new Date().getFullYear();
  
  // Check if we have enough teams for simulation
  const checkTeamsForSimulation = () => {
    // Group teams by district to check if any districts have enough teams
    const districtTeams: Record<string, any[]> = {};
    
    teams.forEach(team => {
      const school = schools.find(s => s.id === team.schoolId);
      if (!school) return;
      
      if (!districtTeams[school.districtId]) {
        districtTeams[school.districtId] = [];
      }
      
      districtTeams[school.districtId].push(team);
    });
    
    // Check if any district has at least 2 teams
    const hasDistrictWithEnoughTeams = Object.entries(districtTeams).some(([districtId, teamsInDistrict]) => {
      if (teamsInDistrict.length >= 2) {
        // Get district name for better error message
        const district = districts.find(d => d.id === districtId);
        return true;
      }
      return false;
    });
    
    if (!hasDistrictWithEnoughTeams) {
      return "You need at least 2 teams in the same district/league to generate matches. Please add more teams to the same district.";
    }
    
    return null;
  };
  
  // Update error message when teams or schools change
  useEffect(() => {
    setSimulationError(checkTeamsForSimulation());
  }, [teams, schools]);
  
  const handleGenerateData = async () => {
    if (!startDate || !endDate) {
      return;
    }
    
    // Check if we have enough teams
    const error = checkTeamsForSimulation();
    if (error) {
      setSimulationError(error);
      return;
    }
    
    setSimulationError(null);
    
    const config: MatchGenerationConfig = {
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      maxRegularSeasonMatches: maxRegularMatches,
      maxTotalMatches: maxTotalMatches,
      doubleRoundRobin
    };
    
    // Find the selected season from our extended list
    const selectedSeason = extendedSeasonsList.find(season => season.id === selectedSeasonId);
    
    if (!selectedSeason) {
      setSimulationError("Invalid season selected");
      return;
    }
    
    try {
      await generateAllData(
        teams,
        schools,
        districts,
        selectedSeason,
        config,
        {
          onPlayersGenerated: (players) => {
            // Add players one by one
            players.forEach(player => {
              addPlayer({
                name: player.name,
                grade: player.grade,
                teamId: player.teamId
              });
            });
          },
          onMatchesGenerated: (matches) => {
            // Add matches one by one
            matches.forEach(match => {
              addMatch({
                date: match.date,
                homeTeamId: match.homeTeamId,
                awayTeamId: match.awayTeamId,
                isLeagueMatch: match.isLeagueMatch,
                isComplete: match.isComplete,
                hasJvMatches: match.hasJvMatches,
                homeTeamWon: match.homeTeamWon,
                homeCoachApproved: match.homeCoachApproved,
                awayCoachApproved: match.awayCoachApproved,
                homeTeamScore: match.homeTeamScore,
                awayTeamScore: match.awayTeamScore,
                flights: match.flights
              });
            });
          }
        }
      );
    } catch (error) {
      if (error instanceof Error) {
        setSimulationError(error.message);
      } else {
        setSimulationError("An unknown error occurred");
      }
    }
  };
  
  return (
    <div className="mb-6">
      <Card className="bg-white shadow-sm border-slate-200">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl flex items-center">
                <FlaskConical className="h-5 w-5 mr-2 text-purple-500" />
                Data Simulation
              </CardTitle>
              <CardDescription>
                Generate realistic tennis match data for testing
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="gap-1.5"
            >
              <Settings2 className="h-4 w-4" />
              {isOpen ? 'Hide Controls' : 'Show Controls'}
            </Button>
          </div>
        </CardHeader>

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleContent>
            <CardContent className="pb-3 space-y-4">
              <SimulationError error={simulationError} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SeasonSelector 
                  seasons={extendedSeasonsList}
                  selectedSeasonId={selectedSeasonId}
                  setSelectedSeasonId={setSelectedSeasonId}
                  disabled={generatingData}
                />
                
                <DateRangePicker
                  startDate={startDate}
                  endDate={endDate}
                  selectedYear={selectedYear}
                  onStartDateChange={setStartDate}
                  onEndDateChange={setEndDate}
                  disabled={generatingData}
                />

                <MatchCountInputs
                  maxRegularMatches={maxRegularMatches}
                  maxTotalMatches={maxTotalMatches}
                  onMaxRegularMatchesChange={setMaxRegularMatches}
                  onMaxTotalMatchesChange={setMaxTotalMatches}
                  disabled={generatingData}
                />
                
                <RoundRobinToggle
                  doubleRoundRobin={doubleRoundRobin}
                  onDoubleRoundRobinChange={setDoubleRoundRobin}
                  disabled={generatingData}
                />
              </div>
              
              <SeasonInfoAlert
                startDate={startDate}
                endDate={endDate}
                seasonWeeks={seasonWeeks}
                theoreticalMaxMatches={theoreticalMaxMatches}
              />
              
              <SimulationWarning selectedSeason={selectedSeason} />
              
              <ProgressIndicator progress={progress} isVisible={generatingData} />
            </CardContent>
          
            <CardFooter className="flex justify-end py-3">
              <Button
                onClick={handleGenerateData}
                disabled={generatingData || !startDate || !endDate || !!simulationError}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <FlaskConical className="h-4 w-4 mr-2" />
                {generatingData ? 'Generating...' : 'Generate Tennis Data'}
              </Button>
            </CardFooter>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
};

export default SimulationControls;
