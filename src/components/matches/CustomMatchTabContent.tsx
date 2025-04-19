
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useMatches } from '@/context/MatchesContext';
import EnhancedMatchCard from './EnhancedMatchCard';
import { Search, Filter, PlusCircle } from 'lucide-react';

interface CustomMatchTabContentProps {
  status: 'upcoming' | 'completed' | 'all';
  gender?: 'Boys' | 'Girls' | 'All';
}

const CustomMatchTabContent: React.FC<CustomMatchTabContentProps> = ({
  status,
  gender = 'All'
}) => {
  const [search, setSearch] = useState("");
  const { filteredMatches, setIsAddDialogOpen, expandedMatchId } = useMatches();
  
  // Filter matches based on status
  const filteredByStatus = filteredMatches.filter(match => {
    if (status === 'all') return true;
    if (status === 'upcoming') return !match.isComplete;
    return match.isComplete;
  });
  
  // Filter by gender if specified
  const filteredByGender = gender === 'All' 
    ? filteredByStatus 
    : filteredByStatus.filter(match => {
        const homeTeam = match.homeTeamName?.includes(gender) || false;
        const awayTeam = match.awayTeamName?.includes(gender) || false;
        return homeTeam || awayTeam;
      });
  
  // Filter by search term
  const matchesWithSearchTerm = search.trim() === ""
    ? filteredByGender
    : filteredByGender.filter(match => {
        const searchTermLower = search.toLowerCase();
        return (
          (match.homeTeamName?.toLowerCase().includes(searchTermLower) || false) || 
          (match.awayTeamName?.toLowerCase().includes(searchTermLower) || false)
        );
      });
  
  // Sort matches by date
  const sortedMatches = [...matchesWithSearchTerm].sort((a, b) => {
    // For upcoming matches, show soonest first
    if (status === 'upcoming') {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    // For completed matches, show most recent first
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search teams..."
            className="pl-9 h-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="px-3 gap-1.5"
        >
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">Filter</span>
        </Button>
        
        <Button 
          size="sm" 
          className="px-3 gap-1.5"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <PlusCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Add</span>
        </Button>
      </div>
      
      {sortedMatches.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p>No matches found. {status === 'upcoming' ? 'Schedule some matches!' : 'Complete some matches!'}</p>
        </div>
      ) : (
        <div>
          {sortedMatches.map((match) => (
            <EnhancedMatchCard
              key={match.id}
              matchId={match.id}
              isExpanded={expandedMatchId === match.id}
              onToggleExpand={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomMatchTabContent;
