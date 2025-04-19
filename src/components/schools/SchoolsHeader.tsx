
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, School } from 'lucide-react';

interface SchoolsHeaderProps {
  schoolCount: number;
  filteredCount: number;
  isAdmin: boolean;
  onAddClick: () => void;
}

const SchoolsHeader = ({ schoolCount, filteredCount, isAdmin, onAddClick }: SchoolsHeaderProps) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <School className="h-7 w-7 mr-3 text-blue-600" />
          <h1 className="text-3xl font-bold">Schools</h1>
        </div>
        
        {isAdmin && (
          <Button 
            className="bg-blue-600 hover:bg-blue-700 transition-colors"
            onClick={onAddClick}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add School
          </Button>
        )}
      </div>
      
      <div className="flex items-center space-x-4 text-sm text-gray-600">
        <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
          Total: {schoolCount}
        </div>
        
        {filteredCount !== schoolCount && (
          <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full font-medium">
            Filtered: {filteredCount}
          </div>
        )}
      </div>
    </div>
  );
};

export default SchoolsHeader;
