
export interface District {
  id: string;
  name: string;
  classification: Classification;
  // New fields for tournament scheduling
  tournamentDates?: {
    start: string;  // ISO date string
    end: string;    // ISO date string
  };
  tournamentLocation?: string;
  tournamentYear?: number;
}
