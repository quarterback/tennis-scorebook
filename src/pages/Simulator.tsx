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
      conference?: string;
    }[];
    rankings?: { id: string; name: string; classification: string; gender: string; record: string; apr: number }[];
  }>({});
  
  // State for tournament simulation
  const [tournamentGender, setTournamentGender] = useState<Gender>('Boys');
  const [tournamentClassification, setTournamentClassification] = useState<Classification>('6A');
  
  // State for filtering results
  const [selectedClassification, setSelectedClassification] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedConference, setSelectedConference] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const openDocumentation = () => {
    window.open('https://github.com/quarterback/tennis-scorebook/tree/main/simulator', '_blank');
  };
  
  const handleRunCommand = (command: string) => {
    toast({
      title: "Command copied to clipboard",
      description: `Run this in your terminal: ${command}`,
    });
    navigator.clipboard.writeText(command);
  };
  
  const handleSimulationComplete = (results: any) => {
    // Add conference and classification if not already in the results
    const enhancedResults = {
      ...results,
      matches: results.matches?.map((match: any) => {
        // Extract classification from team names if not provided
        const classification = match.classification || 
          (match.homeTeam.includes('6A') ? '6A' : 
           match.homeTeam.includes('5A') ? '5A' : 
           match.homeTeam.includes('4A') ? '4A/3A/2A/1A' : 
           match.homeTeam.includes('3A') ? '4A/3A/2A/1A' : '4A/3A/2A/1A');
        
        // Extract or assign conference based on team names
        const conference = match.conference || 
          (match.homeTeam.includes('Metro') ? 'Metro' :
           match.homeTeam.includes('Three Rivers') ? 'Three Rivers' :
           match.homeTeam.includes('Mt. Hood') ? 'Mt. Hood' :
           match.homeTeam.includes('Pacific') ? 'Pacific' :
           match.homeTeam.includes('Southwest') ? 'Southwest' : 'Other');
        
        return {
          ...match,
          classification,
          conference
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
    
  // Get unique conferences from match results
  const availableConferences = simulationResults.matches
    ? ['all', ...new Set(simulationResults.matches.map(match => match.conference || 'Other'))]
    : ['all'];
  
  // Filter rankings by selected classification and gender
  const filteredRankings = simulationResults.rankings
    ? simulationResults.rankings.filter(team => 
        (selectedClassification === 'all' || team.classification === selectedClassification) &&
        (selectedGender === 'all' || team.gender === selectedGender)
      )
    : [];
  
  // Filter matches by selected gender, classification, conference, and search query
  const filteredMatches = simulationResults.matches
    ? simulationResults.matches.filter(match => 
        (selectedGender === 'all' || match.gender === selectedGender) &&
        (selectedClassification === 'all' || match.classification === selectedClassification) &&
        (selectedConference === 'all' || match.conference === selectedConference) &&
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
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="ui">Web Interface</TabsTrigger>
          <TabsTrigger value="cli">Command Line</TabsTrigger>
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
                    Simulates individual flights with realistic score outcomes based on player skills
                  </p>
                </div>
                <div className="border rounded p-4">
                  <h3 className="font-semibold mb-2">APR Calculation</h3>
                  <p className="text-sm text-muted-foreground">
                    Calculates team rankings using the Weighted Score and Opponent Strength Index
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cli" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="h-5 w-5 text-green-500" />
                Command Line Interface
              </CardTitle>
              <CardDescription>
                Run the simulator directly from your terminal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                The simulator can be run directly from the command line. Click a command to copy it to your clipboard.
              </p>
              
              <div className="space-y-3">
                <div className="bg-slate-50 p-3 rounded border">
                  <p className="text-sm font-medium mb-2">Basic simulation with default settings:</p>
                  <Button 
                    variant="secondary" 
                    className="font-mono text-xs w-full justify-start overflow-x-auto"
                    onClick={() => handleRunCommand("python simulator/main.py")}
                  >
                    python simulator/main.py
                  </Button>
                </div>
                
                <div className="bg-slate-50 p-3 rounded border">
                  <p className="text-sm font-medium mb-2">Run with custom parameters:</p>
                  <Button 
                    variant="secondary" 
                    className="font-mono text-xs w-full justify-start overflow-x-auto"
                    onClick={() => handleRunCommand("python simulator/main.py --matches 16 --strength-variance 0.15 --export")}
                  >
                    python simulator/main.py --matches 16 --strength-variance 0.15 --export
                  </Button>
                </div>
                
                <div className="bg-slate-50 p-3 rounded border">
                  <p className="text-sm font-medium mb-2">Create sample teams file:</p>
                  <Button 
                    variant="secondary" 
                    className="font-mono text-xs w-full justify-start overflow-x-auto"
                    onClick={() => handleRunCommand("python simulator/main.py --create-sample")}
                  >
                    python simulator/main.py --create-sample
                  </Button>
                </div>
              </div>
              
              <div className="mt-4 bg-yellow-50 p-4 rounded border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> You need to run these commands from the project root directory.
                  Make sure you have Python installed and all required dependencies.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="results" className="space-y-6">
          {simulationResults.teams?.length ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ListOrdered className="h-5 w-5 text-blue-500" />
                      APR Rankings
                    </div>
                    
                    {/* Filters Section */}
                    <div className="flex items-center space-x-4">
                      {/* Gender Filter */}
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <Select 
                          value={selectedGender} 
                          onValueChange={setSelectedGender}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Gender" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableGenders.map(gender => (
                              <SelectItem key={gender} value={gender}>
                                {gender === 'all' ? 'All Genders' : gender}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Classification Filter */}
                      <div className="flex items-center space-x-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <Select 
                          value={selectedClassification} 
                          onValueChange={setSelectedClassification}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Classification" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableClassifications.map(classification => (
                              <SelectItem key={classification} value={classification}>
                                {classification === 'all' ? 'All Classifications' : classification}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    Teams ranked by their APR (Adjusted Playoff Ranking) scores
                    {selectedClassification !== 'all' && ` - ${selectedClassification} Classification`}
                    {selectedGender !== 'all' && ` - ${selectedGender}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <table className="w-full">
                      <thead className="bg-muted sticky top-0">
                        <tr>
                          <th className="text-left p-2">Rank</th>
                          <th className="text-left p-2">Team</th>
                          <th className="text-left p-2">Classification</th>
                          <th className="text-left p-2">Gender</th>
                          <th className="text-left p-2">Record</th>
                          <th className="text-right p-2">APR</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRankings.map((team, index) => (
                          <tr key={team.id} className={index % 2 === 0 ? 'bg-white' : 'bg-muted/30'}>
                            <td className="p-2">{index + 1}</td>
                            <td className="p-2 font-medium">{team.name}</td>
                            <td className="p-2">{team.classification}</td>
                            <td className="p-2">{team.gender}</td>
                            <td className="p-2">{team.record}</td>
                            <td className="p-2 text-right font-mono">{team.apr.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </ScrollArea>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-green-500" />
                      Match Results
                    </div>
                    
                    {/* Enhanced Filters for Matches */}
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon" className="mr-2">
                        <Filter className="h-4 w-4" />
                      </Button>
                      <Select 
                        value={selectedGender} 
                        onValueChange={setSelectedGender}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableGenders.map(gender => (
                            <SelectItem key={gender} value={gender}>
                              {gender === 'all' ? 'All Genders' : gender}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Select 
                        value={selectedClassification} 
                        onValueChange={setSelectedClassification}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Classification" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableClassifications.map(classification => (
                            <SelectItem key={classification} value={classification}>
                              {classification === 'all' ? 'All Classifications' : classification}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Select 
                        value={selectedConference} 
                        onValueChange={setSelectedConference}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Conference" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableConferences.map(conference => (
                            <SelectItem key={conference} value={conference}>
                              {conference === 'all' ? 'All Conferences' : conference}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    Results from all simulated matches
                    {selectedGender !== 'all' && ` - ${selectedGender}`}
                    {selectedClassification !== 'all' && ` - ${selectedClassification}`}
                    {selectedConference !== 'all' && ` - ${selectedConference} Conference`}
                  </CardDescription>
                  
                  {/* Search input */}
                  <div className="relative mt-2 flex w-full max-w-sm items-center">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search teams..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <table className="w-full">
                      <thead className="bg-muted sticky top-0">
                        <tr>
                          <th className="text-left p-2">Date</th>
                          <th className="text-left p-2">Home Team</th>
                          <th className="text-left p-2">Away Team</th>
                          <th className="text-left p-2">Score</th>
                          <th className="text-left p-2">Gender</th>
                          <th className="text-left p-2">Class</th>
                          <th className="text-left p-2">Conference</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMatches.map((match, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-muted/30'}>
                            <td className="p-2">{match.date}</td>
                            <td className="p-2 font-medium">{match.homeTeam}</td>
                            <td className="p-2">{match.awayTeam}</td>
                            <td className="p-2 font-mono">{match.score}</td>
                            <td className="p-2">{match.gender}</td>
                            <td className="p-2">{match.classification}</td>
                            <td className="p-2">{match.conference}</td>
                          </tr>
                        ))}
                        {filteredMatches.length === 0 && (
                          <tr>
                            <td colSpan={7} className="text-center py-4 text-muted-foreground">
                              No matches found with the current filters
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </ScrollArea>
                </CardContent>
              </Card>
              
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => {
                    // Export results as JSON
                    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(simulationResults));
                    const downloadAnchorNode = document.createElement('a');
                    downloadAnchorNode.setAttribute("href", dataStr);
                    downloadAnchorNode.setAttribute("download", "simulation_results.json");
                    document.body.appendChild(downloadAnchorNode);
                    downloadAnchorNode.click();
                    downloadAnchorNode.remove();
                  }}
                >
                  <FileText className="h-4 w-4" />
                  Export Results
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Rocket className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-900">No simulation results yet</h3>
              <p className="text-gray-500 mt-2 max-w-md mx-auto">
                Run a simulation using the Web Interface or Command Line tab to see results here.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="playoffs" className="space-y-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Post-Season Tournament Simulator
              </CardTitle>
              <CardDescription>
                Simulate state tournament brackets and playoff matches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="gender-select">Gender</Label>
                  <Select 
                    value={tournamentGender}
                    onValueChange={(value: Gender) => setTournamentGender(value)}
                  >
                    <SelectTrigger id="gender-select">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Boys">Boys</SelectItem>
                      <SelectItem value="Girls">Girls</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="classification-select">Classification</Label>
                  <Select 
                    value={tournamentClassification}
                    onValueChange={(value: Classification) => setTournamentClassification(value)}
                  >
                    <SelectTrigger id="classification-select">
                      <SelectValue placeholder="Select classification" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6A">6A</SelectItem>
                      <SelectItem value="5A">5A</SelectItem>
                      <SelectItem value="4A/3A/2A/1A">4A/3A/2A/1A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <PostSeasonSimulator 
            gender={tournamentGender} 
            classification={tournamentClassification} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SimulatorPage;
