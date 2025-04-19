
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useMatches } from '@/context/MatchesContext';
import { MoreHorizontal, Pencil, Trash } from 'lucide-react';

interface MatchActionsProps {
  matchId: string;
  isComplete: boolean;
}

const MatchActions: React.FC<MatchActionsProps> = ({ matchId, isComplete }) => {
  const { openEditDialog, deleteMatch, filteredMatches, canEditMatch } = useMatches();
  
  const match = filteredMatches.find(m => m.id === matchId);
  if (!match) return null;
  
  const canEdit = canEditMatch(match);
  
  const handleEdit = () => {
    openEditDialog(match);
  };
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this match? This action cannot be undone.')) {
      deleteMatch(matchId);
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {canEdit && (
          <DropdownMenuItem onClick={handleEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
        )}
        {canEdit && (
          <DropdownMenuItem onClick={handleDelete} className="text-red-600">
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MatchActions;
