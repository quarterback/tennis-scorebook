
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket, Terminal, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

// Simulator components
import SimulationControls from '@/components/simulation/SimulationControls';

const SimulatorPage: React.FC = () => {
  const { toast } = useToast();
  
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
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="ui">Web Interface</TabsTrigger>
          <TabsTrigger value="cli">Command Line</TabsTrigger>
        </TabsList>
        
        <TabsContent value="ui" className="space-y-6">
          <SimulationControls />
          
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
      </Tabs>
    </div>
  );
};

export default SimulatorPage;
