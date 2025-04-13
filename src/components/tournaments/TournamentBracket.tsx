
import React, { useState } from 'react';
import TournamentRound from './TournamentRound';
import TournamentBracketEditor from './TournamentBracketEditor';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { Gender, Classification } from '@/types';

interface TournamentBracketProps {
  type: 'Singles' | 'Doubles' | 'Team';
  gender: Gender;
  classification: Classification;
  districtName?: string;
  qualifiers?: Array<{
    seed: number;
    name: string;
    school: string;
  }>;
}

const TournamentBracket: React.FC<TournamentBracketProps> = ({ 
  type, 
  gender, 
  classification, 
  districtName,
  qualifiers
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const isDistrict = !!districtName;
  
  return (
    <div className="space-y-4 mt-4">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium text-gray-500">Tournament Bracket ({type})</h4>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs h-7"
          onClick={() => setIsEditing(!isEditing)}
        >
          <Edit className="h-3 w-3 mr-1" />
          {isEditing ? "View Bracket" : "Manage Bracket"}
        </Button>
      </div>
      
      {isEditing ? (
        <TournamentBracketEditor
          type={type}
          gender={gender}
          classification={classification}
          districtName={districtName}
          qualifiers={qualifiers}
        />
      ) : (
        <div className="flex items-center justify-center p-12 border rounded-lg bg-gray-50">
          <div className="text-center">
            <p className="text-gray-500 mb-2">
              {type} bracket needs to be manually configured
            </p>
            <Button 
              variant="default" 
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Configure Bracket
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TournamentBracket;
