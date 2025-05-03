
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useMatches } from '@/context/MatchesContext';
import { useData } from '@/context/DataContext';
import { importSampleMatches } from '@/utils/importSampleData';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function ImportSampleDataButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { matches, setMatches } = useMatches();
  const { teams, schools } = useData();

  const handleImport = () => {
    setLoading(true);
    try {
      importSampleMatches(teams, schools, setMatches, matches);
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Import Sample Data
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Sample Data</DialogTitle>
            <DialogDescription>
              This will add randomly generated match data to help you test the ranking system.
            </DialogDescription>
          </DialogHeader>

          <Alert>
            <AlertDescription>
              This will add approximately 100 sample matches with random results between existing teams.
              Use this feature to quickly populate your database for testing.
            </AlertDescription>
          </Alert>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleImport} disabled={loading}>
              {loading ? "Importing..." : "Import Sample Data"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
