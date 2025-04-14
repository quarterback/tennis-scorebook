
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { History } from 'lucide-react';
import { Season } from '@/types';

interface SeasonSelectorProps {
  seasons: Season[];
  selectedSeasonId: string;
  setSelectedSeasonId: (id: string) => void;
  disabled?: boolean;
}

const SeasonSelector: React.FC<SeasonSelectorProps> = ({
  seasons,
  selectedSeasonId,
  setSelectedSeasonId,
  disabled = false
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="season-select">Select Season</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <History className="h-4 w-4 text-slate-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">Generate data for past, current, or future seasons</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Select 
        value={selectedSeasonId} 
        onValueChange={setSelectedSeasonId}
        disabled={disabled}
      >
        <SelectTrigger id="season-select" className="w-full">
          <SelectValue placeholder="Select a season" />
        </SelectTrigger>
        <SelectContent>
          {seasons.map(season => (
            <SelectItem key={season.id} value={season.id}>
              {season.name} {season.isCurrent ? "(Current)" : ""}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SeasonSelector;
