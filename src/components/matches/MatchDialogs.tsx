
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import MatchForm from './MatchForm';
import { useMatches } from '@/context/MatchesContext';

const MatchDialogs: React.FC = () => {
  const { 
    isAddDialogOpen, 
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    setSelectedMatch,
    matchFormData,
    setMatchFormData,
    filteredTeams,
    schools,
    teams,
    getTeamPlayersForSelect,
    handleFlightPlayerChange,
    handleSetScoreChange,
    handleTiebreakScoreChange,
    toggleTiebreak,
    addSet,
    removeSet,
    calculateTeamWinner,
    addNewFlight,
    toggleJvMatches,
    handleAddMatchSubmit,
    handleEditMatchSubmit
  } = useMatches();

  return (
    <>
      {/* Add Match Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="w-full max-w-5xl">
          <DialogHeader>
            <DialogTitle>Add New Match</DialogTitle>
            <DialogDescription>
              Configure match details and add player lineups
            </DialogDescription>
          </DialogHeader>
          
          <MatchForm
            matchFormData={matchFormData}
            setMatchFormData={setMatchFormData}
            schools={schools}
            teams={teams}
            filteredTeams={filteredTeams}
            getTeamPlayersForSelect={getTeamPlayersForSelect}
            handleFlightPlayerChange={handleFlightPlayerChange}
            handleSetScoreChange={handleSetScoreChange}
            handleTiebreakScoreChange={handleTiebreakScoreChange}
            toggleTiebreak={toggleTiebreak}
            addSet={addSet}
            removeSet={removeSet}
            calculateTeamWinner={calculateTeamWinner}
            addNewFlight={addNewFlight}
            toggleJvMatches={toggleJvMatches}
            onSubmit={handleAddMatchSubmit}
            onCancel={() => setIsAddDialogOpen(false)}
            submitButtonText="Save Match"
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Match Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-full max-w-5xl">
          <DialogHeader>
            <DialogTitle>Edit Match</DialogTitle>
            <DialogDescription>
              Modify match details and player lineups
            </DialogDescription>
          </DialogHeader>
          
          <MatchForm
            matchFormData={matchFormData}
            setMatchFormData={setMatchFormData}
            schools={schools}
            teams={teams}
            filteredTeams={filteredTeams}
            getTeamPlayersForSelect={getTeamPlayersForSelect}
            handleFlightPlayerChange={handleFlightPlayerChange}
            handleSetScoreChange={handleSetScoreChange}
            handleTiebreakScoreChange={handleTiebreakScoreChange}
            toggleTiebreak={toggleTiebreak}
            addSet={addSet}
            removeSet={removeSet}
            calculateTeamWinner={calculateTeamWinner}
            addNewFlight={addNewFlight}
            toggleJvMatches={toggleJvMatches}
            onSubmit={handleEditMatchSubmit}
            onCancel={() => {
              setIsEditDialogOpen(false);
              setSelectedMatch(null);
            }}
            submitButtonText="Update Match"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MatchDialogs;
