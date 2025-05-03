
import React, { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useMatches } from "@/context/MatchesContext";
import { useData } from "@/context/DataContext";
import Papa from "papaparse";
import { toast } from "@/hooks/use-toast";
import { Match, Flight } from "@/types";
import { findTeamIdByName, standardizePosition } from "./utils/matchImportUtils";
import MatchFileInput from "./MatchFileInput";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useItaRankingCalculator } from "@/hooks/rankings/useItaRankingCalculator";

interface MatchImportDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

type ImportFlight = {
  position: string; // "1S", "2S", ...
  outcome: "home" | "away" | "tie";
  score?: string;
};

type ImportMatch = {
  date: string;
  home_team: string;
  away_team: string;
  isLeagueMatch?: boolean;
  flights: ImportFlight[];
};

export const MatchImportDialog: React.FC<MatchImportDialogProps> = ({ open, setOpen }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [importedData, setImportedData] = useState<ImportMatch[]>([]);
  const [isReviewStep, setIsReviewStep] = useState(false);
  const { matches, setMatches } = useMatches();
  const { teams, schools } = useData();
  const { calculateRankings } = useItaRankingCalculator();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const ext = file.name.split(".").pop()?.toLowerCase();
    let importedMatches: ImportMatch[] = [];

    try {
      if (ext === "json") {
        const text = await file.text();
        importedMatches = JSON.parse(text);
      } else if (ext === "csv") {
        const text = await file.text();
        const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
        importedMatches = parsed.data.map((row: any) => {
          const flights: ImportFlight[] = [];
          ["1S","2S","3S","1D","2D","3D"].forEach((label) => {
            if (row[label]) {
              flights.push({
                position: label,
                outcome: row[label].toLowerCase() as "home" | "away" | "tie",
                score: row[label+"_score"] || undefined
              });
            }
          });
          return {
            date: row.date,
            home_team: row.home_team,
            away_team: row.away_team,
            isLeagueMatch: row.is_league_match === "true" || row.is_league_match === "1" || row.is_league_match === true,
            flights
          };
        });
      } else {
        toast({ 
          title: "Invalid file type", 
          description: "Please upload a .csv or .json file",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      setImportedData(importedMatches);
      setIsReviewStep(true);
      setLoading(false);
    } catch (err) {
      toast({ 
        title: "Error parsing file", 
        description: String(err),
        variant: "destructive" 
      });
      setLoading(false);
    }
  };

  const processImport = () => {
    let imported = 0;
    let skipped = 0;
    const newMatches: Match[] = [];

    importedData.forEach(importEntry => {
      try {
        // Find team IDs using the utility (does toast if not found)
        const homeTeamId = findTeamIdByName(importEntry.home_team, teams, schools, toast);
        const awayTeamId = findTeamIdByName(importEntry.away_team, teams, schools, toast);

        if (homeTeamId === "unknown" || awayTeamId === "unknown") {
          skipped++;
          return;
        }

        const flights: Flight[] = importEntry.flights.map(f => {
          const { type, position } = standardizePosition(f.position);
          let winner: boolean|undefined;
          if (f.outcome === "home") winner = true;
          else if (f.outcome === "away") winner = false;
          else winner = undefined;

          const flightType: "singles" | "doubles" = type;
          return {
            id: crypto.randomUUID(),
            type: flightType,
            position,
            level: "varsity",
            homePlayers: [],
            awayPlayers: [],
            homePlayerWon: winner,
            sets: [],
            scoreDisplay: f.score
          };
        });

        // Count wins for each team
        const homeWins = flights.filter(f => f.homePlayerWon === true).length;
        const awayWins = flights.filter(f => f.homePlayerWon === false).length;

        const newMatch: Match = {
          id: crypto.randomUUID(),
          date: importEntry.date,
          homeTeamId: homeTeamId,
          awayTeamId: awayTeamId,
          isLeagueMatch: importEntry.isLeagueMatch ?? true,
          isComplete: true,
          hasJvMatches: false,
          homeTeamWon: homeWins > awayWins,
          homeCoachApproved: false,
          awayCoachApproved: false,
          homeTeamScore: homeWins,
          awayTeamScore: awayWins,
          flights
        };

        newMatches.push(newMatch);
        imported += 1;
      } catch (err) {
        skipped++;
        toast({ 
          title: "Match import failed", 
          description: String(err),
          variant: "destructive"  
        });
      }
    });

    setMatches(prevMatches => [...prevMatches, ...newMatches]);

    toast({
      title: "Import Complete",
      description: `Imported ${imported} matches${skipped > 0 ? `, skipped ${skipped} invalid entries` : ''}.`
    });
    
    // Recalculate rankings after import
    calculateRankings({
      gender: 'Boys',
      classification: '6A',
      includeNonLeagueMatches: true
    });
    
    calculateRankings({
      gender: 'Girls',
      classification: '6A',
      includeNonLeagueMatches: true
    });
    
    setImportedData([]);
    setIsReviewStep(false);
    setOpen(false);
  };

  const resetImport = () => {
    setImportedData([]);
    setIsReviewStep(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Import Matches</DialogTitle>
          <DialogDescription>
            {!isReviewStep ? (
              <>
                Upload match data as a structured JSON or CSV file.<br />
                Each match must include: date, home_team, away_team, and flights (with outcomes for 1S, 2S, 3S, 1D, 2D, 3D).
              </>
            ) : (
              <>
                Review your match data before completing the import.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        
        {!isReviewStep ? (
          <MatchFileInput
            fileInputRef={fileInputRef}
            loading={loading}
            onFileChange={handleFileChange}
          />
        ) : (
          <div className="space-y-4">
            <Alert>
              <AlertTitle>Ready to import {importedData.length} matches</AlertTitle>
              <AlertDescription>
                This will update your rankings automatically. Please review the details to ensure accuracy.
              </AlertDescription>
            </Alert>
            
            <div className="max-h-60 overflow-y-auto border rounded-md p-2">
              {importedData.map((match, i) => (
                <div key={i} className="border-b last:border-0 py-2">
                  <div className="font-medium">{match.date}</div>
                  <div className="text-sm">{match.home_team} vs {match.away_team}</div>
                  <div className="text-xs text-gray-500">
                    {match.isLeagueMatch ? "League match" : "Non-league match"} · 
                    {match.flights.length} flights
                  </div>
                </div>
              ))}
            </div>
            
            <DialogFooter className="flex flex-row gap-2 sm:justify-between">
              <Button variant="outline" onClick={resetImport}>
                Back
              </Button>
              <Button onClick={processImport}>
                Complete Import
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MatchImportDialog;
