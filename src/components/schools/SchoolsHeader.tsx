
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
            className="bg-tennis-blue hover:bg-tennis-darkBlue"
            onClick={onAddClick}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add School
          </Button>
        )}
      </div>
      
      <div className="p-2 bg-blue-50 rounded-md mb-4">
        <div className="flex flex-col md:flex-row md:justify-between">
          <p className="text-sm text-blue-700">Total Schools: {schoolCount}</p>
          {filteredCount !== schoolCount && (
            <p className="text-sm text-blue-700">Filtered: {filteredCount}</p>
          )}
        </div>
      </div>
    </>
  );
};

export default SchoolsHeader;
