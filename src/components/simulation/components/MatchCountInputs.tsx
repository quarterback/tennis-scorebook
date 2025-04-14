
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface MatchCountInputsProps {
  maxRegularMatches: number;
  maxTotalMatches: number;
  onMaxRegularMatchesChange: (value: number) => void;
  onMaxTotalMatchesChange: (value: number) => void;
  disabled?: boolean;
}

const MatchCountInputs: React.FC<MatchCountInputsProps> = ({
  maxRegularMatches,
  maxTotalMatches,
  onMaxRegularMatchesChange,
  onMaxTotalMatchesChange,
  disabled = false
}) => {
  return (
    <div className="space-y-2 grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="max-regular">Max Regular Matches</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">The maximum number of regular season dual matches each team will play.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          id="max-regular"
          type="number"
          min={8}
          max={20}
          value={maxRegularMatches}
          onChange={(e) => onMaxRegularMatchesChange(parseInt(e.target.value) || 0)}
          disabled={disabled}
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="max-total">Max Total Matches</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">The maximum total matches including tournaments.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          id="max-total"
          type="number"
          min={10}
          max={30}
          value={maxTotalMatches}
          onChange={(e) => onMaxTotalMatchesChange(parseInt(e.target.value) || 0)}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default MatchCountInputs;
