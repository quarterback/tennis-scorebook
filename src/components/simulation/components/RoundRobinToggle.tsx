
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface RoundRobinToggleProps {
  doubleRoundRobin: boolean;
  onDoubleRoundRobinChange: (value: boolean) => void;
  disabled?: boolean;
}

const RoundRobinToggle: React.FC<RoundRobinToggleProps> = ({
  doubleRoundRobin,
  onDoubleRoundRobinChange,
  disabled = false
}) => {
  return (
    <div className="flex items-center gap-2">
      <Switch
        id="double-round"
        checked={doubleRoundRobin}
        onCheckedChange={onDoubleRoundRobinChange}
        disabled={disabled}
      />
      <Label htmlFor="double-round" className="cursor-pointer">
        Double Round-Robin for Small Districts
      </Label>
    </div>
  );
};

export default RoundRobinToggle;
