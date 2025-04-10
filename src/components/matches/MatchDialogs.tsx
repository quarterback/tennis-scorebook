
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import MatchForm from './MatchForm';
import { useMatches } from '@/context/MatchesContext';

const MatchDialogs = () => {
  const {
    isAddDialogOpen, setIsAddDialogOpen,
    isEditDialogOpen, setIsEditDialogOpen,
    matchFormData, setMatchFormData,
    handleAddMatchSubmit, handleEditMatchSubmit,
    resetMatchForm, schools, teams, filteredTeams,
    getTeamPlayersForSelect, handleFlightPlayerChange,
    handleSetScoreChange, handleTiebreakScoreChange,
    toggleTiebreak, addSet, removeSet, calculateTeamWinner,
    addNewFlight, toggleJvMatches, toggleApproval, isCoachOfTeam,
    toggleFlightRetired, toggleFlightDefaulted, updateTeamScores
  } = useMatches();

  return (
    <>
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Add New Match</DialogTitle>
            <DialogDescription>
              Enter the details for the new match.
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
            toggleApproval={toggleApproval}
            isCoachOfTeam={isCoachOfTeam}
            updateTeamScores={updateTeamScores}
            toggleFlightRetired={toggleFlightRetired}
            toggleFlightDefaulted={toggleFlightDefaulted}
            onSubmit={handleAddMatchSubmit}
            onCancel={() => {
              setIsAddDialogOpen(false);
              resetMatchForm();
            }}
            submitButtonText="Add Match"
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Edit Match</DialogTitle>
            <DialogDescription>
              Update the details for this match.
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
            toggleApproval={toggleApproval}
            isCoachOfTeam={isCoachOfTeam}
            updateTeamScores={updateTeamScores}
            toggleFlightRetired={toggleFlightRetired}
            toggleFlightDefaulted={toggleFlightDefaulted}
            onSubmit={handleEditMatchSubmit}
            onCancel={() => {
              setIsEditDialogOpen(false);
            }}
            submitButtonText="Update Match"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MatchDialogs;
