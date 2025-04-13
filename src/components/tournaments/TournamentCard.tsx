
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Users, Trophy, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Gender, Classification, TeamStanding } from '@/types';
import TournamentBracket from './TournamentBracket';

interface TournamentCardProps {
  type: 'Singles' | 'Doubles' | 'Team';
  gender: Gender;
  classification: Classification;
  districtName?: string;
  qualifiers?: TeamStanding[];
}

const TournamentCard: React.FC<TournamentCardProps> = ({
  type,
  gender,
  classification,
  districtName,
  qualifiers
}) => {
  const [expanded, setExpanded] = useState(false);
  
  const formatQualifiers = () => {
    if (!qualifiers) return [];
    
    return qualifiers.map((team, index) => ({
      seed: index + 1,
      name: team.teamName,
      school: team.schoolName
    }));
  };
  
  const getBadgeColor = () => {
    if (type === 'Singles') return 'bg-blue-100 text-blue-800';
    if (type === 'Doubles') return 'bg-green-100 text-green-800';
    return 'bg-amber-100 text-amber-800';
  };
  
  const getIcon = () => {
    if (type === 'Singles') return <User className="h-4 w-4 mr-1" />;
    if (type === 'Doubles') return <Users className="h-4 w-4 mr-1" />;
    return <Trophy className="h-4 w-4 mr-1" />;
  };
  
  const formatDistrictOrState = () => {
    if (districtName) return districtName;
    return "State";
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3 px-4 pt-4">
        <CardTitle className="text-md flex justify-between items-center">
          <div className="flex items-center">
            {getIcon()}
            {type} Tournament
          </div>
          <div
            className="cursor-pointer p-1 rounded-full hover:bg-gray-100"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className={cn("px-4 pb-4", {
        "hidden": !expanded
      })}>
        <div className="mb-3 flex items-center gap-2">
          <span className={cn("text-xs px-2 py-1 rounded-full", getBadgeColor())}>
            {formatDistrictOrState()}
          </span>
          <span className="text-xs text-gray-500">
            {gender} {classification}
          </span>
        </div>
        
        <TournamentBracket
          type={type}
          gender={gender}
          classification={classification}
          districtName={districtName}
          qualifiers={formatQualifiers()}
        />
      </CardContent>
    </Card>
  );
};

export default TournamentCard;
