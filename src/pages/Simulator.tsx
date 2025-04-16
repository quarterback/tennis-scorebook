
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket, Terminal, Code, ListOrdered, FileText, Trophy, Filter, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Gender, Classification } from '@/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

// Simulator components
import SimulationControls from '@/components/simulation/SimulationControls';
import PostSeasonSimulator from '@/components/tournaments/PostSeasonSimulator';

const SimulatorPage: React.FC = () => {
  const { toast } = useToast();
  const [simulationResults, setSimulationResults] = useState<{
    teams?: { id: string; name: string; classification: string; gender: string; record: string; apr: number }[];
    matches?: { 
      date: string; 
      homeTeam: string; 
      awayTeam: string; 
      score: string; 
      gender: string;
      classification?: string;
    }[];
    rankings?: { id: string; name: string; classification: string; gender: string; record: string; apr: number }[];
  }>({});
  
  // State for tournament simulation
  const [tournamentGender, setTournamentGender] = useState<Gender>('Boys');
  const [tournamentClassification, setTournamentClassification] = useState<Classification>('6A');
  
  // State for filtering results
  const [selectedClassification, setSelectedClassification] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const openDocumentation = () => {
    window.open('https://github.com/quarterback/tennis-scorebook/tree/main/simulator', '_blank');
  };
  
  const handleSimulationComplete = (results: any) => {
    // Add classification if not already in the results
    const enhancedResults = {
      ...results,
      matches: results.matches?.map((match: any) => {
        // Extract classification from team names if not provided
        const classification = match.classification || 
          (match.homeTeam.includes('6A') ? '6A' : 
           match.homeTeam.includes('5A') ? '5A' : 
           match.homeTeam.includes('4A') ? '4A/3A/2A/1A' : 
           match.homeTeam.includes('3A') ? '4A/3A/2A/1A' : '4A/3A/2A/1A');
        
        return {
          ...match,
          classification
        };
      })
    };
    
    setSimulationResults(enhancedResults);
    toast({
      title: "Simulation Complete",
      description: `Generated ${enhancedResults.teams?.length || 0} teams and ${enhancedResults.matches?.length || 0} matches.`,
    });
  };
  
  // Get unique classifications from rankings results
  const availableClassifications = simulationResults.rankings 
    ? ['all', ...new Set(simulationResults.rankings.map(team => team.classification))]
    : ['all'];
  
  // Get unique genders from rankings results
  const availableGenders = simulationResults.rankings
    ? ['all', ...new Set(simulationResults.rankings.map(team => team.gender))]
    : ['all'];
  
  // Filter rankings by selected classification and gender
  const filteredRankings = simulationResults.rankings
    ? simulationResults.rankings.filter(team => 
        (selectedClassification === 'all' || team.classification === selectedClassification) &&
        (selectedGender === 'all' || team.gender === selectedGender)
      )
    : [];
  
  // Filter matches by selected gender, classification, and search query
  const filteredMatches = simulationResults.matches
    ? simulationResults.matches.filter(match => 
        (selectedGender === 'all' || match.gender === selectedGender) &&
        (selectedClassification === 'all' || match.classification === selectedClassification) &&
        (searchQuery === '' || 
         match.homeTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
         match.awayTeam.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tennis Simulator</h1>
          <p className="text-muted-foreground">
            Generate realistic tennis seasons for APR ranking model testing
          </p>
        </div>
        <Button onClick={openDocumentation} variant="outline" className="gap-2">
          <Code className="h-4 w-4" />
          Documentation
        </Button>
      </div>
      
      <Tabs defaultValue="ui" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="ui">Web Interface</TabsTrigger>
          <TabsTrigger value="results" className="relative">
            Results
            {simulationResults.teams?.length ? (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            ) : null}
          </TabsTrigger>
          <TabsTrigger value="playoffs" className="flex items-center gap-1">
            <Trophy className="h-3 w-3" />
            Playoffs
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="ui" className="space-y-6">
          <SimulationControls onSimulationComplete={handleSimulationComplete} />
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-5 w-5 text-blue-500" />
                How the Simulator Works
              </CardTitle>
              <CardDescription>
                The tennis simulator generates realistic seasons with match results
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                This simulator creates full tennis seasons with realistic match results for Oregon high school
                teams. It models player skills, team strengths, and calculates the APR rankings based on the
                weighted scoring system.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded p-4">
                  <h3 className="font-semibold mb-2">Team Generation</h3>
                  <p className="text-sm text-muted-foreground">
                    Creates teams with skill-stratified rosters and realistic lineup creation
                  </p>
                </div>
                <div className="border rounded p-4">
                  <h3 className="font-semibold mb-2">Match Simulation</h3>
                  <p className="text-sm text-muted-foreground">
                    Simulates individual flights with realistic scoring and outcomes
                  </p>
                </div>
                <div className="border rounded p-4">
                  <h3 className="font-semibold mb-2">Rankings</h3>
                  <p className="text-sm text-muted-foreground">
                    Calculates rankings using the Adjusted Power Rating formula
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="results" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListOrdered className="h-5 w-5 text-blue-500" />
                APR Rankings
              </CardTitle>
              <CardDescription>
                Simulated power rankings with adjustments based on multiple factors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                  <div>
                    <Label htmlFor="classification-filter">Classification</Label>
                    <Select 
                      value={selectedClassification} 
                      onValueChange={setSelectedClassification}
                    >
                      <SelectTrigger id="classification-filter" className="w-[180px]">
                        <SelectValue placeholder="All Classifications" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableClassifications.map(c => (
                          <SelectItem key={c} value={c}>
                            {c === 'all' ? 'All Classifications' : c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="gender-filter">Gender</Label>
                    <Select 
                      value={selectedGender} 
                      onValueChange={setSelectedGender}
                    >
                      <SelectTrigger id="gender-filter" className="w-[180px]">
                        <SelectValue placeholder="All Genders" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableGenders.map(g => (
                          <SelectItem key={g} value={g}>
                            {g === 'all' ? 'All Genders' : g}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-gray-100 p-3 grid grid-cols-12 gap-2 text-sm font-medium">
                    <div className="col-span-1">Rank</div>
                    <div className="col-span-4">Team</div>
                    <div className="col-span-2">Classification</div>
                    <div className="col-span-2">Record</div>
                    <div className="col-span-3">APR</div>
                  </div>
                  
                  <ScrollArea className="h-[400px]">
                    {filteredRankings.length > 0 ? (
                      filteredRankings.map((team, idx) => (
                        <div 
                          key={team.id}
                          className="p-3 grid grid-cols-12 gap-2 text-sm border-b last:border-0 hover:bg-gray-50"
                        >
                          <div className="col-span-1 font-medium">{idx + 1}</div>
                          <div className="col-span-4">{team.name}</div>
                          <div className="col-span-2">{team.classification}</div>
                          <div className="col-span-2">{team.record}</div>
                          <div className="col-span-3">
                            <div className="flex items-center gap-2">
                              <div className="font-semibold">{team.apr.toFixed(1)}</div>
                              <div className="w-full max-w-24 bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className="bg-blue-600 h-2.5 rounded-full" 
                                  style={{ width: `${(team.apr / 100) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        No rankings generated yet. Run a simulation to see results.
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                Match Results
              </CardTitle>
              <CardDescription>
                All match results from the simulation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4 items-end">
                  <div className="grow">
                    <Label htmlFor="search-matches">Search Matches</Label>
                    <div className="flex items-center border rounded-md pl-3 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                      <Search className="h-4 w-4 text-gray-400" />
                      <Input 
                        id="search-matches"
                        placeholder="Search by team name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border-0 focus-visible:ring-0"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="classification-filter-matches">Classification</Label>
                    <Select 
                      value={selectedClassification} 
                      onValueChange={setSelectedClassification}
                    >
                      <SelectTrigger id="classification-filter-matches" className="w-[180px]">
                        <SelectValue placeholder="All Classifications" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableClassifications.map(c => (
                          <SelectItem key={c} value={c}>
                            {c === 'all' ? 'All Classifications' : c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="gender-filter-matches">Gender</Label>
                    <Select 
                      value={selectedGender} 
                      onValueChange={setSelectedGender}
                    >
                      <SelectTrigger id="gender-filter-matches" className="w-[180px]">
                        <SelectValue placeholder="All Genders" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableGenders.map(g => (
                          <SelectItem key={g} value={g}>
                            {g === 'all' ? 'All Genders' : g}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-gray-100 p-3 grid grid-cols-12 gap-2 text-sm font-medium">
                    <div className="col-span-2">Date</div>
                    <div className="col-span-4">Home Team</div>
                    <div className="col-span-4">Away Team</div>
                    <div className="col-span-2">Score</div>
                  </div>
                  
                  <ScrollArea className="h-[400px]">
                    {filteredMatches.length > 0 ? (
                      filteredMatches.map((match, idx) => (
                        <div 
                          key={idx}
                          className="p-3 grid grid-cols-12 gap-2 text-sm border-b last:border-0 hover:bg-gray-50"
                        >
                          <div className="col-span-2">{match.date}</div>
                          <div className="col-span-4">{match.homeTeam}</div>
                          <div className="col-span-4">{match.awayTeam}</div>
                          <div className="col-span-2 font-medium">{match.score}</div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        No matches generated yet. Run a simulation to see results.
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="playoffs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                State Tournament Simulator
              </CardTitle>
              <CardDescription>
                Simulate brackets based on qualification rules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label className="mb-2 block">Select Gender</Label>
                    <RadioGroup 
                      value={tournamentGender} 
                      onValueChange={(value) => setTournamentGender(value as Gender)}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Boys" id="boys" />
                        <Label htmlFor="boys">Boys</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Girls" id="girls" />
                        <Label htmlFor="girls">Girls</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div>
                    <Label className="mb-2 block">Select Classification</Label>
                    <Select 
                      value={tournamentClassification} 
                      onValueChange={(value) => setTournamentClassification(value as Classification)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6A">6A</SelectItem>
                        <SelectItem value="5A">5A</SelectItem>
                        <SelectItem value="4A/3A/2A/1A">4A/3A/2A/1A</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <PostSeasonSimulator 
                  gender={tournamentGender} 
                  classification={tournamentClassification} 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SimulatorPage;
