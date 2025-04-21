
import React, { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useMatches } from "@/context/MatchesContext";
import { useData } from "@/context/DataContext";
import Papa from "papaparse";
import { toast } from "@/hooks/use-toast";
import { Match, Flight } from "@/types";
import { findTeamIdByName, standardizePosition } from "./utils/matchImportUtils";
import MatchFileInput from "./MatchFileInput";

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
  flights: ImportFlight[];
};

export const MatchImportDialog: React.FC<MatchImportDialogProps> = ({ open, setOpen }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const { matches, setMatches } = useMatches();
  const { teams, schools } = useData();

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
            flights
          };
        });
      } else {
        toast({ title: "Invalid file type", description: "Please upload a .csv or .json file" });
        setLoading(false);
        return;
      }
    } catch (err) {
      toast({ title: "Error parsing file", description: String(err) });
      setLoading(false);
      return;
    }

    let imported = 0;
    let skipped = 0;
    const newMatches: Match[] = [];

    importedMatches.forEach(importEntry => {
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

        const newMatch: Match = {
          id: crypto.randomUUID(),
          date: importEntry.date,
          homeTeamId: homeTeamId,
          awayTeamId: awayTeamId,
          isLeagueMatch: true,
          isComplete: true,
          hasJvMatches: false,
          homeTeamWon: undefined,
          homeCoachApproved: false,
          awayCoachApproved: false,
          homeTeamScore: undefined,
          awayTeamScore: undefined,
          flights
        };

        newMatches.push(newMatch);
        imported += 1;
      } catch (err) {
        skipped++;
        toast({ title: "Match import failed", description: String(err) });
      }
    });

    setMatches(prevMatches => [...prevMatches, ...newMatches]);

    toast({
      title: "Import Complete",
      description: `Imported ${imported} matches${skipped > 0 ? `, skipped ${skipped} invalid entries` : ''}.`
    });
    setLoading(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Import Matches</DialogTitle>
          <DialogDescription>
            Upload match data as a structured JSON or CSV file.<br />
            Each match must include: date, home_team, away_team, and flights (with outcomes for 1S, 2S, 3S, 1D, 2D, 3D).
          </DialogDescription>
        </DialogHeader>
        <MatchFileInput
          fileInputRef={fileInputRef}
          loading={loading}
          onFileChange={handleFileChange}
        />
      </DialogContent>
    </Dialog>
  );
};

export default MatchImportDialog;
