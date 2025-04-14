
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BracketSizeSelectorProps {
  bracketSize: number;
  onBracketSizeChange: (size: string) => void;
}

const BracketSizeSelector: React.FC<BracketSizeSelectorProps> = ({
  bracketSize,
  onBracketSizeChange
}) => {
  return (
    <div className="w-full md:w-auto">
      <label className="block text-sm font-medium mb-1">Bracket Size</label>
      <Select 
        value={bracketSize.toString()} 
        onValueChange={onBracketSizeChange}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Select size" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="2">2</SelectItem>
          <SelectItem value="4">4</SelectItem>
          <SelectItem value="8">8</SelectItem>
          <SelectItem value="16">16</SelectItem>
          <SelectItem value="32">32</SelectItem>
          <SelectItem value="48">48</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default BracketSizeSelector;
