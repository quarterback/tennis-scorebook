
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Clipboard, Download, FileJson, FileSpreadsheet } from 'lucide-react';
import { exportSchoolsToCSV, exportTeamsToCSV, exportPlayersToCSV, exportMatchesToCSV, exportAllDataAsJSON } from '@/utils/exportData';
import { useData } from '@/context/DataContext';

export interface ExportDataDialogProps {
  trigger?: React.ReactNode;
}

const ExportDataDialog: React.FC<ExportDataDialogProps> = ({ 
  trigger = (
    <Button variant="outline">
      <Clipboard className="h-4 w-4 mr-2" />
      Export Data
    </Button>
  ) 
}) => {
  const { schools, teams, players, matches, districts, currentSeason } = useData();
  const [open, setOpen] = useState(false);
  const [exportOptions, setExportOptions] = useState({
    schools: true,
    teams: true,
    players: true,
    matches: true
  });
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');

  const handleExport = () => {
    if (exportFormat === 'csv') {
      // Export individual CSV files
      if (exportOptions.schools) exportSchoolsToCSV(schools);
      if (exportOptions.teams) exportTeamsToCSV(teams);
      if (exportOptions.players) exportPlayersToCSV(players);
      if (exportOptions.matches) exportMatchesToCSV(matches);
    } else {
      // Export all as single JSON file
      const exportData = {
        ...(exportOptions.schools ? { schools } : {}),
        ...(exportOptions.teams ? { teams } : {}),
        ...(exportOptions.players ? { players } : {}),
        ...(exportOptions.matches ? { matches } : {}),
        districts,
        seasons: [currentSeason]
      };
      exportAllDataAsJSON(exportData);
    }
    
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Data</DialogTitle>
          <DialogDescription>
            Select the data you want to export and the preferred format.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Data to Export</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="schools" 
                  checked={exportOptions.schools}
                  onCheckedChange={(checked) => 
                    setExportOptions(prev => ({ ...prev, schools: checked === true }))
                  }
                />
                <Label htmlFor="schools">Schools ({schools.length})</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="teams" 
                  checked={exportOptions.teams}
                  onCheckedChange={(checked) => 
                    setExportOptions(prev => ({ ...prev, teams: checked === true }))
                  }
                />
                <Label htmlFor="teams">Teams ({teams.length})</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="players" 
                  checked={exportOptions.players}
                  onCheckedChange={(checked) => 
                    setExportOptions(prev => ({ ...prev, players: checked === true }))
                  }
                />
                <Label htmlFor="players">Players ({players.length})</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="matches" 
                  checked={exportOptions.matches}
                  onCheckedChange={(checked) => 
                    setExportOptions(prev => ({ ...prev, matches: checked === true }))
                  }
                />
                <Label htmlFor="matches">Matches ({matches.length})</Label>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Export Format</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant={exportFormat === 'csv' ? 'default' : 'outline'} 
                className="justify-start"
                onClick={() => setExportFormat('csv')}
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                CSV Files
              </Button>
              
              <Button 
                variant={exportFormat === 'json' ? 'default' : 'outline'} 
                className="justify-start"
                onClick={() => setExportFormat('json')}
              >
                <FileJson className="h-4 w-4 mr-2" />
                JSON File
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {exportFormat === 'csv' 
                ? 'Exports each data type as a separate CSV file.' 
                : 'Exports all selected data as a single JSON file.'}
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={!Object.values(exportOptions).some(Boolean)}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDataDialog;
