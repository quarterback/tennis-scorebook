
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { School, Plus } from 'lucide-react';

interface SchoolsHeaderProps {
  schoolCount: number;
  filteredCount: number;
  isAdmin: boolean;
  onAddClick: () => void;
}

const SchoolsHeader = ({ schoolCount, filteredCount, isAdmin, onAddClick }: SchoolsHeaderProps) => {
  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <School className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Schools</h1>
        </div>
        
        {isAdmin && (
          <Button onClick={onAddClick} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add School
          </Button>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="text-sm">
          Total: {schoolCount}
        </Badge>
        
        {filteredCount !== schoolCount && (
          <Badge variant="outline" className="text-sm">
            Filtered: {filteredCount}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default SchoolsHeader;
