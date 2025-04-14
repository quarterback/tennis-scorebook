
import React, { useState, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { useSimulatedData } from '@/hooks/useSimulatedData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { MatchGenerationConfig } from '@/types/ranking';
import { Progress } from '@/components/ui/progress';
import { Calendar, Settings2, FlaskConical, AlertCircle, Info, Calendar as CalendarIcon, History } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarUI } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Team, Season } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SimulationControls: React.FC = () => {
  const { 
    schools, teams, districts, currentSeason, seasons,
    addPlayer, addMatch, getArchivedSeasons
  } = useData();
  
  const { generateAllData, generatingData, progress, verifyTeamsForSimulation } = useSimulatedData();
  
  const [isOpen, setIsOpen] = useState(false);
  
  // Season selection
  const allSeasons = [currentSeason, ...getArchivedSeasons()];
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>(currentSeason.id);
  
  // Date states - default to Oregon's typical spring tennis season: early March to mid-May
  const defaultStartDate = new Date(new Date().getFullYear(), 2, 1); // March 1st of current year
  const defaultEndDate = new Date(new Date().getFullYear(), 4, 15); // May 15th of current year
  
  const [startDate, setStartDate] = useState<Date | undefined>(defaultStartDate);
  const [endDate, setEndDate] = useState<Date | undefined>(defaultEndDate);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  
  // Configuration states
  const [maxRegularMatches, setMaxRegularMatches] = useState(16);
  const [maxTotalMatches, setMaxTotalMatches] = useState(20);
  const [doubleRoundRobin, setDoubleRoundRobin] = useState(true);
  
  // Error states
  const [simulationError, setSimulationError] = useState<string | null>(null);
  
  // Calculate season duration in weeks to show info to the user
  const calculateWeeks = () => {
    if (!startDate || !endDate) return 0;
    const days = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return Math.ceil(days / 7);
  };
  
  const seasonWeeks = calculateWeeks();
  
  // Calculate theoretical max matches based on season length
  const calculateMaxMatches = () => {
    if (!startDate || !endDate) return 0;
    const days = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const weeks = Math.ceil(days / 7);
    // 3 regular matches per week, plus some weekend tournaments
    return (weeks * 3) - 1; // Subtract 1 week for spring break
  };
  
  const theoreticalMaxMatches = calculateMaxMatches();
  
  // Check if we have enough teams for simulation
  const checkTeamsForSimulation = () => {
    // Group teams by district to check if any districts have enough teams
    const districtTeams: Record<string, Team[]> = {};
    
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
    
    // Find the selected season
    const selectedSeason = allSeasons.find(season => season.id === selectedSeasonId) || currentSeason;
    
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
              {simulationError && (
                <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <AlertDescription>{simulationError}</AlertDescription>
                </Alert>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Season selector */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="season-select">Select Season</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <History className="h-4 w-4 text-slate-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Generate data for past or current seasons</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Select 
                    value={selectedSeasonId} 
                    onValueChange={setSelectedSeasonId}
                    disabled={generatingData}
                  >
                    <SelectTrigger id="season-select" className="w-full">
                      <SelectValue placeholder="Select a season" />
                    </SelectTrigger>
                    <SelectContent>
                      {allSeasons.map(season => (
                        <SelectItem key={season.id} value={season.id}>
                          {season.name} {season.isCurrent ? "(Current)" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="start-date">Season Start Date</Label>
                  <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                        disabled={generatingData}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, 'MMM d, yyyy') : 'Select date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarUI
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => {
                          setStartDate(date);
                          setStartDateOpen(false);
                        }}
                        defaultMonth={new Date(new Date().getFullYear(), 2, 1)} // Default to March
                        disabled={(date) => 
                          date > (endDate || new Date('2026-12-31')) || 
                          date < new Date('2024-01-01')
                        }
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="end-date">Season End Date</Label>
                  <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                        disabled={generatingData}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, 'MMM d, yyyy') : 'Select date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarUI
                        mode="single"
                        selected={endDate}
                        onSelect={(date) => {
                          setEndDate(date);
                          setEndDateOpen(false);
                        }}
                        defaultMonth={new Date(new Date().getFullYear(), 4, 1)} // Default to May
                        disabled={(date) => 
                          date < (startDate || new Date('2024-01-01')) || 
                          date > new Date('2026-12-31')
                        }
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2 grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="max-regular">Max Regular Matches</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-slate-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">The maximum number of regular season dual matches each team will play.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      id="max-regular"
                      type="number"
                      min={8}
                      max={20}
                      value={maxRegularMatches}
                      onChange={(e) => setMaxRegularMatches(parseInt(e.target.value) || 0)}
                      disabled={generatingData}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="max-total">Max Total Matches</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-slate-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">The maximum total matches including tournaments.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      id="max-total"
                      type="number"
                      min={10}
                      max={30}
                      value={maxTotalMatches}
                      onChange={(e) => setMaxTotalMatches(parseInt(e.target.value) || 0)}
                      disabled={generatingData}
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch
                    id="double-round"
                    checked={doubleRoundRobin}
                    onCheckedChange={setDoubleRoundRobin}
                    disabled={generatingData}
                  />
                  <Label htmlFor="double-round" className="cursor-pointer">
                    Double Round-Robin for Small Districts
                  </Label>
                </div>
              </div>
              
              <Alert className="bg-blue-50 border-blue-200">
                <Info className="h-5 w-5 text-blue-500" />
                <AlertDescription className="text-blue-800 text-sm">
                  Season length: <span className="font-medium">{seasonWeeks} weeks</span> ({startDate && endDate ? `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d')}` : 'Not set'})
                  <br />
                  <span>This season can theoretically support up to ~{theoreticalMaxMatches} matches per team</span>
                </AlertDescription>
              </Alert>
              
              <div className="bg-amber-50 border border-amber-200 rounded p-3 text-amber-800 text-sm flex items-start space-x-2.5">
                <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Warning: Simulation will generate historical data</p>
                  <p className="mt-1">This will create players and matches for the selected season.</p>
                </div>
              </div>
              
              {generatingData && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Generating data...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}
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
