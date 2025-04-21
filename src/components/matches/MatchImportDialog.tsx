
import React, { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMatches } from "@/context/MatchesContext";
import Papa from "papaparse";
import { toast } from "@/hooks/use-toast";
import { Match, Flight } from "@/types";

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

function standardizePosition(pos: string): { type: "singles" | "doubles"; position: number } {
  // Convert "1S" -> { type: "singles", position: 1 }, etc
  if (!pos || pos.length < 2) return { type: "singles", position: 1 };
  const [num, t] = [pos[0], pos[1]?.toUpperCase()];
  return {
    type: t === "S" ? "singles" : "doubles",
    position: Number(num)
  };
}

export const MatchImportDialog: React.FC<MatchImportDialogProps> = ({ open, setOpen }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const { matches, setMatches } = useMatches();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const ext = file.name.split(".").pop()?.toLowerCase();
    let matches: ImportMatch[] = [];

    try {
      if (ext === "json") {
        const text = await file.text();
        matches = JSON.parse(text);
      } else if (ext === "csv") {
        const text = await file.text();
        const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
        // Transform each row into an ImportMatch shape
        matches = parsed.data.map((row: any) => {
          // Assume columns: date, home_team, away_team, 1S, 2S, 3S, 1D, 2D, 3D, 1S_score, etc.
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
    // Map ImportMatch -> Match, then add to system
    const newMatches: Match[] = [];
    
    matches.forEach(importEntry => {
      try {
        const flights: Flight[] = importEntry.flights.map(f => {
          const { type, position } = standardizePosition(f.position);
          let winner: boolean|undefined;
          if (f.outcome === "home") winner = true;
          else if (f.outcome === "away") winner = false;
          else winner = undefined;

          // Optionally parse score here if you want to show it in system
          return {
            id: crypto.randomUUID(),
            type,
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
          homeTeamId: importEntry.home_team,
          awayTeamId: importEntry.away_team,
          isLeagueMatch: true,
          isComplete: true,
          hasJvMatches: false,
          homeTeamWon: undefined, // Will be recalculated elsewhere
          homeCoachApproved: false,
          awayCoachApproved: false,
          homeTeamScore: undefined,
          awayTeamScore: undefined,
          flights
        };
        
        newMatches.push(newMatch);
        imported += 1;
      } catch (err) {
        // Skip and show error
        toast({ title: "Match import failed", description: String(err) });
      }
    });
    
    // Add all new matches to the existing matches
    setMatches(prevMatches => [...prevMatches, ...newMatches]);

    toast({
      title: "Import Complete",
      description: `Imported ${imported} matches.`
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

        <div className="my-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.csv"
            className="mb-2"
            disabled={loading}
            onChange={handleFileChange}
          />
        </div>
        <Button onClick={() => fileInputRef.current?.click()} disabled={loading}>
          Choose File
        </Button>
        <div className="text-xs mt-2 text-gray-500">
          After importing, records and APR will be updated automatically.
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MatchImportDialog;
