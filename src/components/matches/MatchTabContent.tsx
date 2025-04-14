
import React, { useState, useEffect } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Match, Team, School, Player } from '@/types';
import MatchCard from './MatchCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Search, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MatchTabContentProps {
  tabValue: 'upcoming' | 'completed' | 'all';
  matches: Match[];
  expandedMatchId: string | null;
  setExpandedMatchId: (id: string | null) => void;
  getTeamName: (teamId: string) => string;
  canEditMatch: (match: Match) => boolean;
  openEditDialog: (match: Match) => void;
  players: Player[];
}

const MatchTabContent: React.FC<MatchTabContentProps> = ({
  tabValue,
  matches,
  expandedMatchId,
  setExpandedMatchId,
  getTeamName,
  canEditMatch,
  openEditDialog,
  players
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [genderFilter, setGenderFilter] = useState<'all' | 'boys' | 'girls'>('all');
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  
  // Process matches: filter, sort, and apply tabValue (upcoming/completed/all)
  useEffect(() => {
    let processed = matches.filter(match => {
      // Filter by tab value
      if (tabValue === 'upcoming') return !match.isComplete;
      if (tabValue === 'completed') return match.isComplete;
      return true; // 'all' tab
    });
    
    // Apply search term (match team names)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      processed = processed.filter(match => {
        const homeTeamName = getTeamName(match.homeTeamId).toLowerCase();
        const awayTeamName = getTeamName(match.awayTeamId).toLowerCase();
        return homeTeamName.includes(term) || awayTeamName.includes(term);
      });
    }
    
    // Apply gender filter
    if (genderFilter !== 'all') {
      processed = processed.filter(match => {
        // Extract gender information from team name (assumes team names include "Boys" or "Girls")
        const homeTeamName = getTeamName(match.homeTeamId).toLowerCase();
        return genderFilter === 'boys' ? homeTeamName.includes('boys') : homeTeamName.includes('girls');
      });
    }
    
    // Sort by date
    processed = processed.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    
    setFilteredMatches(processed);
  }, [matches, tabValue, searchTerm, sortOrder, genderFilter, getTeamName]);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <TabsContent value={tabValue} className="space-y-4">
      <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search teams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Select
            value={genderFilter}
            onValueChange={(value) => setGenderFilter(value as 'all' | 'boys' | 'girls')}
          >
            <SelectTrigger className="w-[130px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Teams</SelectItem>
              <SelectItem value="boys">Boys Teams</SelectItem>
              <SelectItem value="girls">Girls Teams</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSortOrder}
            className="whitespace-nowrap"
          >
            <ArrowUpDown className="h-4 w-4 mr-1" />
            {sortOrder === 'asc' ? 'Oldest First' : 'Newest First'}
          </Button>
        </div>
      </div>

      {filteredMatches.length > 0 ? (
        <div className="space-y-4 mt-4">
          {filteredMatches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              expandedMatchId={expandedMatchId}
              setExpandedMatchId={setExpandedMatchId}
              getTeamName={getTeamName}
              canEditMatch={canEditMatch}
              openEditDialog={openEditDialog}
              players={players}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-10">
          No {tabValue === 'upcoming' ? 'upcoming' : tabValue === 'completed' ? 'completed' : ''} matches found
          {searchTerm && ' matching your search criteria'}
          {genderFilter !== 'all' && ` for ${genderFilter} teams`}
        </div>
      )}
    </TabsContent>
  );
};

export default MatchTabContent;
