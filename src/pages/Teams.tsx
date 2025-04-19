
import React, { useState, useEffect } from 'react';
import TeamsContainer from '@/components/teams/TeamsContainer';
import { useData } from '@/context/DataContext';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Users } from 'lucide-react';

const Teams = () => {
  const { teams, schools } = useData();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("Teams page loaded with", teams.length, "teams");
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [teams]);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card className="border-tennis-blue/20">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Users className="h-6 w-6 text-tennis-blue" />
            <div>
              <CardTitle>Teams Management</CardTitle>
              <CardDescription>
                Manage school teams and rosters
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <span className="font-medium">Total Teams:</span>
              <span className="text-tennis-blue">{teams.length}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">Total Schools:</span>
              <span className="text-tennis-green">{schools.length}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Separator className="my-6" />
      
      <TeamsContainer filter={{}} />
    </div>
  );
};

export default Teams;
