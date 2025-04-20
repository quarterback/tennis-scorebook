
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { importSchoolsAndTeams } from '@/utils/schoolDataImport';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export const SchoolImportButton = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [importSummary, setImportSummary] = useState<{
    schoolsAdded: number;
    teamsAdded: number;
    existingSchools: number;
    logs: string[];
  } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleImport = async () => {
    setIsImporting(true);
    try {
      console.log('Starting school import process...');
      const summary = await importSchoolsAndTeams();
      console.log('Import finished with summary:', summary);
      setImportSummary(summary);
      setIsDialogOpen(true);
      
      toast({
        title: 'Import Successful',
        description: `Added ${summary.schoolsAdded} schools and ${summary.teamsAdded} teams.`,
        variant: 'default'
      });
      
      if (summary.schoolsAdded > 0 || summary.teamsAdded > 0) {
        console.log('Reloading page to show new schools...');
        setTimeout(() => {
          window.location.reload();
        }, 2000); // Give time for the toast to be visible
      }
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: 'Import Failed',
        description: 'An error occurred while importing schools and teams.',
        variant: 'destructive'
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <>
      <Button 
        onClick={handleImport} 
        disabled={isImporting}
        variant="outline"
        className="flex items-center gap-2"
      >
        {isImporting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Importing...
          </>
        ) : (
          'Import Schools'
        )}
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>School Import Results</DialogTitle>
            <DialogDescription>
              Summary of the school and team import process
            </DialogDescription>
          </DialogHeader>
          {importSummary && (
            <div className="space-y-4">
              <Alert variant={importSummary.schoolsAdded > 0 ? "default" : "destructive"}>
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Import Summary</AlertTitle>
                <AlertDescription>
                  <ul className="mt-2 space-y-1 list-disc pl-5">
                    <li>Added {importSummary.schoolsAdded} new schools</li>
                    <li>Added {importSummary.teamsAdded} team rosters</li>
                    <li>Skipped {importSummary.existingSchools} existing schools</li>
                  </ul>
                </AlertDescription>
              </Alert>

              {importSummary.logs.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Errors</AlertTitle>
                  <AlertDescription>
                    <div className="mt-2 max-h-40 overflow-y-auto">
                      <ul className="space-y-1 list-disc pl-5">
                        {importSummary.logs.map((log, index) => (
                          <li key={index}>{log}</li>
                        ))}
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
