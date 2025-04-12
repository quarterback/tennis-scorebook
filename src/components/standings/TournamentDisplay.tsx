
import React from 'react';
import TournamentSection from '@/components/tournaments/TournamentSection';
import { Gender, Classification } from '@/types';

interface TournamentDisplayProps {
  gender: Gender;
  classification: Classification;
  selectedDistrictId?: string;
  availableDistricts: Array<{ id: string; name: string }>;
}

const TournamentDisplay: React.FC<TournamentDisplayProps> = ({
  gender,
  classification,
  selectedDistrictId,
  availableDistricts
}) => {
  // Find the selected district name
  const selectedDistrictName = selectedDistrictId 
    ? availableDistricts.find(d => d.id === selectedDistrictId)?.name
    : undefined;
    
  return (
    <>
      {/* State Tournament Section */}
      <TournamentSection 
        gender={gender}
        classification={classification}
      />
      
      {/* Display District Tournaments */}
      {selectedDistrictId ? (
        <TournamentSection 
          gender={gender}
          classification={classification}
          districtId={selectedDistrictId}
          districtName={selectedDistrictName}
        />
      ) : (
        availableDistricts.map(district => (
          <TournamentSection 
            key={district.id}
            gender={gender}
            classification={classification}
            districtId={district.id}
            districtName={district.name}
          />
        ))
      )}
    </>
  );
};

export default TournamentDisplay;
