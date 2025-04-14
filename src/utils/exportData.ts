
import { Player, Team, School, Match, District, Season } from '@/types';

type ExportableData = {
  schools?: School[];
  teams?: Team[];
  players?: Player[];
  matches?: Match[];
  districts?: District[];
  seasons?: Season[];
};

/**
 * Convert data to CSV format
 */
export const convertToCSV = (data: any[], headers: string[]): string => {
  // Create header row
  let csvContent = headers.join(',') + '\n';
  
  // Add data rows
  data.forEach(item => {
    const row = headers.map(header => {
      const value = item[header];
      // Handle nested objects and arrays
      if (value === null || value === undefined) {
        return '';
      } else if (typeof value === 'object') {
        return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
      } else {
        // Escape quotes and handle strings with commas
        return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
          ? `"${value.replace(/"/g, '""')}"` 
          : value;
      }
    });
    csvContent += row.join(',') + '\n';
  });
  
  return csvContent;
};

/**
 * Create a downloadable CSV file
 */
export const downloadCSV = (csvContent: string, filename: string): void => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export data to JSON format
 */
export const exportToJSON = (data: ExportableData, filename: string): void => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.json`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export schools data to CSV
 */
export const exportSchoolsToCSV = (schools: School[]): void => {
  const headers = ['id', 'name', 'classification', 'districtId'];
  const csvContent = convertToCSV(schools, headers);
  downloadCSV(csvContent, 'schools.csv');
};

/**
 * Export teams data to CSV
 */
export const exportTeamsToCSV = (teams: Team[]): void => {
  const headers = ['id', 'schoolId', 'gender'];
  const csvContent = convertToCSV(teams, headers);
  downloadCSV(csvContent, 'teams.csv');
};

/**
 * Export players data to CSV
 */
export const exportPlayersToCSV = (players: Player[]): void => {
  const headers = ['id', 'name', 'grade', 'teamId', 'seasonId', 'status'];
  const csvContent = convertToCSV(players, headers);
  downloadCSV(csvContent, 'players.csv');
};

/**
 * Export matches data to CSV
 */
export const exportMatchesToCSV = (matches: Match[]): void => {
  const headers = ['id', 'date', 'homeTeamId', 'awayTeamId', 'isLeagueMatch', 'isComplete', 'homeTeamScore', 'awayTeamScore'];
  const csvContent = convertToCSV(matches, headers);
  downloadCSV(csvContent, 'matches.csv');
};

/**
 * Export all data as JSON
 */
export const exportAllDataAsJSON = (data: ExportableData): void => {
  exportToJSON(data, 'tennis_data_export');
};

/**
 * Create a ZIP file with multiple CSV files
 * Note: This requires the use of a library like JSZip, which would need to be installed
 */
export const createDataExport = (data: ExportableData): void => {
  // For now, we'll just export as JSON until we add ZIP functionality
  exportAllDataAsJSON(data);
};
