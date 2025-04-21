
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Plus, Info, School } from 'lucide-react';
import { useData } from '@/context/DataContext';

const Index = () => {
  const { schools, teams, matches } = useData();
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">APR Tennis Ranking Tool</h1>
        <p className="text-gray-500">
          A specialized tool for evaluating Oregon high school tennis teams using the APR ranking system.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">View Rankings</CardTitle>
            <CardDescription>Check current APR rankings by classification</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Rankings are calculated using the APR formula: WS10 × OSI
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => navigate('/rankings')}>
              <BarChart3 className="h-4 w-4 mr-2" />
              View APR Rankings
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Record Matches</CardTitle>
            <CardDescription>Enter match results for your team</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Submit match information including opponent, date, score, and flights won.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => navigate('/match-entry')}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Match
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">How It Works</CardTitle>
            <CardDescription>Understanding the APR Ranking System</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Learn how the Athletic Power Rating is calculated and used for rankings.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => window.open('/docs/apr_ranking_model.md')}>
              <Info className="h-4 w-4 mr-2" />
              About the Model
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Schools</dt>
                <dd className="text-2xl font-bold">{schools.length}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Teams</dt>
                <dd className="text-2xl font-bold">{teams.length}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Matches</dt>
                <dd className="text-2xl font-bold">{matches.length}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Complete</dt>
                <dd className="text-2xl font-bold">{matches.filter(m => m.isComplete).length}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">About This Tool</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              This specialized tool evaluates Oregon high school tennis teams using the Athletic Power Rating (APR) system. 
              The APR formula factors in flight-weighted scoring and opponent strength to provide a comprehensive ranking
              that better reflects team performance compared to traditional win-loss records.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              The system weights higher positions more heavily (1S and 1D are worth more than 3S and 2D), and
              factors in the strength of a team's opponents through the Opponent Strength Index (OSI).
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => navigate('/schools')}>
              <School className="h-4 w-4 mr-2" />
              Manage Schools
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Index;
