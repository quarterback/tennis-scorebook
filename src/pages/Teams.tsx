
import React, { useState, useEffect } from 'react';
import TeamsContainer from '@/components/teams/TeamsContainer';
import { useData } from '@/context/DataContext';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Users } from 'lucide-react';  // Changed from Team to Users
import { useToast } from '@/components/ui/use-toast';

const Teams = () => {
  const { teams, schools, createTeamsForAllSchools } = useData();
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingTeams, setIsCreatingTeams] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    console.log("Teams page loaded with", teams.length, "teams");
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [teams]);

  const handleCreateMissingTeams = async () => {
    setIsCreatingTeams(true);
    try {
      const createdCount = await createTeamsForAllSchools();
      console.log("Created teams count:", createdCount);
      toast({
        title: 'Teams Created',
        description: `Created ${createdCount} new teams for schools missing them.`,
        variant: createdCount && createdCount > 0 ? 'default' : 'destructive',
      });
    } catch (error) {
      console.error("Error creating teams:", error);
      toast({
        title: 'Error',
        description: 'Failed to create teams. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCreatingTeams(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Teams Management</span>
            <Button 
              variant="outline" 
              onClick={handleCreateMissingTeams}
              disabled={isCreatingTeams}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              {isCreatingTeams ? 'Creating...' : 'Create Missing Teams'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Total Teams: {teams.length} | Schools: {schools.length} | Manage school teams and rosters
          </p>
        </CardContent>
      </Card>
      
      <Separator className="my-6" />
      
      <TeamsContainer filter={{}} />
    </div>
  );
};

export default Teams;
