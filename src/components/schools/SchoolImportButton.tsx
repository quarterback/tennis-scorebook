
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { importSchoolsAndTeams } from '@/utils/schoolDataImport';
import { useData } from '@/context/DataContext';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, AlertCircle, CheckCircle2, ChevronDown } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export const SchoolImportButton = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [importSummary, setImportSummary] = useState<{
    schoolsAdded: number;
    teamsAdded: number;
    existingSchools: number;
    logs: string[];
  } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    details?: string;
  } | null>(null);
  const { toast } = useToast();
  const { addSchool, setSchools, schools, districts } = useData();

  const testConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      console.log('Testing Supabase connection and permissions...');
      
      // Test 1: Fetch one district to verify read access
      const { data: district, error: readError } = await supabase
        .from('districts')
        .select('*')
        .limit(1)
        .single();
      
      if (readError) {
        console.error('Read test failed:', readError);
        setTestResult({
          success: false,
          message: 'Failed to read from database',
          details: readError.message
        });
        setIsTesting(false);
        return;
      }
      
      console.log('Read test successful:', district);
      
      // Test 2: Try to insert a test record
      const testSchoolName = `Test School ${Date.now()}`;
      const { data: insertData, error: insertError } = await supabase
        .from('schools')
        .insert({
          name: testSchoolName,
          classification: '6A',
          district_id: district.id,
          city: 'Test City',
          state: 'OR'
        })
        .select();
      
      if (insertError) {
        console.error('Insert test failed:', insertError);
        setTestResult({
          success: false,
          message: 'Failed to write to database',
          details: insertError.message
        });
        setIsTesting(false);
        return;
      }
      
      console.log('Insert test successful:', insertData);
      
      // Test 3: Clean up by deleting the test record
      if (insertData && insertData.length > 0) {
        const { error: deleteError } = await supabase
          .from('schools')
          .delete()
          .eq('id', insertData[0].id);
        
        if (deleteError) {
          console.warn('Delete test record warning:', deleteError);
        }
      }
      
      setTestResult({
        success: true,
        message: 'Database connection and permissions verified',
        details: 'Successfully read from and wrote to the database. Your import should work now.'
      });
      
      toast({
        title: 'Connection Test Successful',
        description: 'Database permissions are working correctly.',
        variant: 'default'
      });
    } catch (error) {
      console.error('Test error:', error);
      setTestResult({
        success: false,
        message: 'Test failed with an unexpected error',
        details: error instanceof Error ? error.message : String(error)
      });
      
      toast({
        title: 'Test Failed',
        description: 'An error occurred during the connection test.',
        variant: 'destructive'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleImport = async () => {
    setIsImporting(true);
    try {
      console.log('Starting school import process...');
      const summary = await importSchoolsAndTeams();
      console.log('Import finished with summary:', summary);
      setImportSummary(summary);
      setIsDialogOpen(true);
      
      toast({
        title: 'Import Completed',
        description: `Attempted to add ${summary.logs.length} schools with ${summary.schoolsAdded} successful.`,
        variant: summary.schoolsAdded > 0 ? 'default' : 'destructive'
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

  // New function to directly import schools using context
  const handleDirectImport = async () => {
    setIsImporting(true);
    try {
      console.log('Starting direct school import process...');
      
      // Import the school data
      const { leagueSchools } = await import('@/utils/schoolDataImport');
      
      const schoolsAdded = [];
      const teamsAdded = [];
      const existingSchools = [];
      const logs = [];
      
      // First, get the districts from context to map district codes to IDs
      const districtMapping: Record<string, string> = {};
      districts.forEach(district => {
        districtMapping[district.code] = district.id;
      });
      
      // Count total schools to import
      let totalSchools = 0;
      Object.values(leagueSchools).forEach(districtSchools => {
        totalSchools += districtSchools.length;
      });
      
      console.log(`Starting import of ${totalSchools} schools using context API...`);
      
      // Process each district and its schools
      for (const [districtCode, districtSchools] of Object.entries(leagueSchools)) {
        console.log(`Processing district ${districtCode} with ${districtSchools.length} schools`);
        
        const districtId = districtMapping[districtCode];
        if (!districtId) {
          console.error(`District code ${districtCode} not found in database`);
          logs.push(`District code ${districtCode} not found in database`);
          continue;
        }
        
        for (const school of districtSchools) {
          try {
            // Check if school already exists
            const existingSchool = schools.find(s => 
              s.name.toLowerCase() === school.name.toLowerCase()
            );
            
            if (existingSchool) {
              console.log(`School ${school.name} already exists, skipping`);
              existingSchools.push(school.name);
              continue;
            }
            
            // Create new school using context
            const newSchool = {
              name: school.name,
              classification: school.classification,
              districtId: districtId,
              city: school.city || 'Portland',
              state: 'OR'
            };
            
            // Add school using context API
            addSchool(newSchool);
            
            console.log(`Added school: ${school.name}`);
            schoolsAdded.push(school.name);
            
            // Teams are automatically created by the addSchool function in DataContext
            teamsAdded.push(`Boys team for ${school.name}`);
            teamsAdded.push(`Girls team for ${school.name}`);
            
          } catch (error) {
            console.error(`Error processing school ${school.name}:`, error);
            logs.push(`Failed to add ${school.name}: ${error instanceof Error ? error.message : String(error)}`);
          }
        }
      }
      
      const summary = {
        schoolsAdded: schoolsAdded.length,
        teamsAdded: teamsAdded.length,
        existingSchools: existingSchools.length,
        logs: logs
      };
      
      console.log('Direct import completed with summary:', summary);
      setImportSummary(summary);
      setIsDialogOpen(true);
      
      toast({
        title: 'Direct Import Completed',
        description: `Added ${schoolsAdded.length} schools and ${teamsAdded.length} teams.`,
        variant: schoolsAdded.length > 0 ? 'default' : 'destructive'
      });
      
    } catch (error) {
      console.error('Direct import error:', error);
      toast({
        title: 'Import Failed',
        description: 'An error occurred during direct import.',
        variant: 'destructive'
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            disabled={isImporting || isTesting}
          >
            {isImporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : isTesting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                Import Schools
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleDirectImport}>
            Direct Import (No Database)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleImport}>
            Database Import (Supabase)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={testConnection}>
            Test Database Permissions
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
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
                {importSummary.schoolsAdded > 0 ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
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

          {testResult && (
            <Alert variant={testResult.success ? "default" : "destructive"}>
              {testResult.success ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertTitle>{testResult.success ? "Test Passed" : "Test Failed"}</AlertTitle>
              <AlertDescription>
                <p className="mt-2">{testResult.message}</p>
                {testResult.details && (
                  <div className="mt-2 p-2 bg-slate-100 dark:bg-slate-800 rounded text-sm font-mono overflow-x-auto">
                    {testResult.details}
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
