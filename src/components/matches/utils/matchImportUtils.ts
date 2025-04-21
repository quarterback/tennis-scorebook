
import { Team, School } from "@/types";
import { toast as toastFunction } from "@/hooks/use-toast";

// Helper function to find team ID from name, given teams and schools data
export function findTeamIdByName(
  teamName: string, 
  teams: Team[], 
  schools: School[], 
  toast: typeof toastFunction
): string {
  // Construct: `${school.name} ${team.gender}` for display
  const foundTeam = teams.find(t => {
    const school = schools.find(s => s.id === t.schoolId);
    if (!school) return false;
    const fullTeamName = `${school.name} ${t.gender}`;
    return fullTeamName === teamName;
  });

  if (foundTeam) return foundTeam.id;

  // Try fuzzy/partial match
  const fuzzyMatch = teams.find(t => {
    const school = schools.find(s => s.id === t.schoolId);
    if (!school) return false;
    const fullTeamName = `${school.name} ${t.gender}`;
    return fullTeamName.toLowerCase().includes(teamName.toLowerCase()) ||
           teamName.toLowerCase().includes(fullTeamName.toLowerCase()) ||
           teamName.toLowerCase().includes(school.name.toLowerCase());
  });

  if (fuzzyMatch) return fuzzyMatch.id;

  toast({
    title: "Team not found",
    description: `Could not find team: "${teamName}". Please check team name.`,
    variant: "destructive"
  });

  return teams.length > 0 ? teams[0].id : "unknown";
}

// Helper to standardize flight positions in import
export function standardizePosition(pos: string): { type: "singles" | "doubles"; position: number } {
  if (!pos || pos.length < 2) return { type: "singles", position: 1 };
  const [num, t] = [pos[0], pos[1]?.toUpperCase()];
  return {
    type: t === "S" ? "singles" : "doubles",
    position: Number(num)
  };
}
