
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { importSchoolsAndTeams } from '@/utils/schoolDataImport';
import { useToast } from '@/components/ui/use-toast';

export const SchoolImportButton = () => {
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  const handleImport = async () => {
    setIsImporting(true);
    try {
      await importSchoolsAndTeams();
      toast({
        title: 'Import Successful',
        description: 'Schools and teams have been imported to the database.',
        variant: 'default'
      });
    } catch (error) {
      toast({
        title: 'Import Failed',
        description: 'An error occurred while importing schools and teams.',
        variant: 'destructive'
      });
      console.error('Import error:', error);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Button 
      onClick={handleImport} 
      disabled={isImporting}
      variant="outline"
    >
      {isImporting ? 'Importing...' : 'Import Schools'}
    </Button>
  );
};
