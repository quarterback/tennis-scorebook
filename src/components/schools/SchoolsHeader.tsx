
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface SchoolsHeaderProps {
  schoolCount: number;
  isAdmin: boolean;
  onAddClick: () => void;
}

const SchoolsHeader = ({ schoolCount, isAdmin, onAddClick }: SchoolsHeaderProps) => {
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
        <p className="text-sm text-blue-700">Total Schools: {schoolCount}</p>
      </div>
    </>
  );
};

export default SchoolsHeader;
