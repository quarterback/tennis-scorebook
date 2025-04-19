
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface SchoolsHeaderProps {
  schoolCount: number;
  filteredCount: number;
  isAdmin: boolean;
  onAddClick: () => void;
}

const SchoolsHeader = ({ schoolCount, filteredCount, isAdmin, onAddClick }: SchoolsHeaderProps) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Schools</h1>
        
        {isAdmin && (
          <Button 
            className="bg-blue-500 hover:bg-blue-600"
            onClick={onAddClick}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add School
          </Button>
        )}
      </div>
      
      <div className="text-blue-700 mb-6">
        Total Schools: {schoolCount}
        {filteredCount !== schoolCount && (
          <span className="ml-4">Filtered: {filteredCount}</span>
        )}
      </div>
    </>
  );
};

export default SchoolsHeader;
