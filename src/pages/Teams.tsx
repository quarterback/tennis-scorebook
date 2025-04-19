
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

const Teams = () => {
  const { teams } = useData();
  const [isLoading, setIsLoading] = useState(true);

  // Use effect to simulate loading and ensure teams are properly loaded
  useEffect(() => {
    console.log("Teams page loaded with", teams.length, "teams");
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [teams]);

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Teams Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Total Teams: {teams.length} | Manage school teams and rosters
          </p>
        </CardContent>
      </Card>
      
      <Separator className="my-6" />
      
      {/* Use the TeamsContainer component to manage teams */}
      <TeamsContainer filter={{}} />
    </div>
  );
};

export default Teams;
