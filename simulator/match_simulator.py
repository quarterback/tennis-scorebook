
"""
Simulates individual tennis matches between two teams
"""
import random
import uuid
from typing import List, Dict, Tuple, Optional
from datetime import datetime, timedelta
import numpy as np

from models import Team, Player, Match, Flight, FlightType, FlightPosition
from config import DEFAULT_MATCH_CONFIG, SIM_PARAMS

class LineupGenerator:
    """Handles generating realistic lineups for matches"""
    
    @staticmethod
    def generate_lineup(
        team: Team, 
        config: Dict = DEFAULT_MATCH_CONFIG
    ) -> Tuple[List[Player], List[List[Player]]]:
        """
        Generate a realistic lineup for a team
        
        Returns:
            Tuple of (singles_players, doubles_teams)
        """
        available_players = team.roster.copy()
        
        # Sort players by skill and singles preference
        available_players.sort(
            key=lambda p: (p.skill_rating * (0.7 + 0.3 * p.singles_preference)), 
            reverse=True
        )
        
        # Select singles players (typically strongest players who prefer singles)
        singles_count = config.get("singles_positions", 4)
        singles_players = []
        
        # Pick singles players with some randomness
        for i in range(min(singles_count, len(available_players))):
            # Top 25% of remaining players are candidates for each singles spot
            candidate_count = max(1, int(len(available_players) * 0.25))
            candidates = available_players[:candidate_count]
            
            # Weight selection by skill and singles preference
            weights = [
                p.skill_rating * (0.5 + 0.5 * p.singles_preference) 
                for p in candidates
            ]
            
            if not candidates:
                break
                
            # Select a player from candidates
            selected = random.choices(candidates, weights=weights, k=1)[0]
            singles_players.append(selected)
            available_players.remove(selected)
        
        # Select doubles teams
        doubles_count = config.get("doubles_positions", 4)
        doubles_teams = []
        
        # For doubles, we want complementary players
        for i in range(doubles_count):
            if len(available_players) < 2:
                break
                
            # For first doubles, pick stronger remaining players
            if i == 0 and len(available_players) >= 2:
                # Pick from top half of remaining players
                strong_candidates = available_players[:max(2, len(available_players) // 2)]
                
                # First player - stronger player
                weights = [p.skill_rating for p in strong_candidates]
                player1 = random.choices(strong_candidates, weights=weights, k=1)[0]
                available_players.remove(player1)
                
                # Second player - complementary player with good doubles chemistry
                strong_candidates = available_players[:max(2, len(available_players) // 2)]
                weights = [p.skill_rating * (1.0 - abs(p.singles_preference - player1.singles_preference)) 
                          for p in strong_candidates]
                player2 = random.choices(strong_candidates, weights=weights, k=1)[0]
                available_players.remove(player2)
                
                doubles_teams.append([player1, player2])
            else:
                # For other doubles positions, more randomness
                # First player
                player1_idx = min(len(available_players) - 1, random.randint(0, len(available_players) // 2))
                player1 = available_players.pop(player1_idx)
                
                # Find a complementary partner
                if available_players:
                    # Prefer players with complementary skills
                    weights = [
                        (1.0 - abs(p.singles_preference - player1.singles_preference)) * p.skill_rating
                        for p in available_players
                    ]
                    player2 = random.choices(available_players, weights=weights, k=1)[0]
                    available_players.remove(player2)
                    
                    doubles_teams.append([player1, player2])
        
        return singles_players, doubles_teams
    
    @staticmethod
    def create_match_flights(
        home_team: Team,
        away_team: Team,
        config: Dict = DEFAULT_MATCH_CONFIG
    ) -> List[Flight]:
        """Create all flights for a match between two teams"""
        # Generate lineups
        home_singles, home_doubles = LineupGenerator.generate_lineup(home_team, config)
        away_singles, away_doubles = LineupGenerator.generate_lineup(away_team, config)
        
        flights = []
        
        # Create singles flights
        for pos in range(1, config.get("singles_positions", 4) + 1):
            if pos <= len(home_singles) and pos <= len(away_singles):
                flight = Flight(
                    flight_type=FlightType.SINGLES,
                    position=FlightPosition(pos),
                    home_players=[home_singles[pos-1].id],
                    away_players=[away_singles[pos-1].id]
                )
                flights.append(flight)
        
        # Create doubles flights
        for pos in range(1, config.get("doubles_positions", 4) + 1):
            if pos <= len(home_doubles) and pos <= len(away_doubles):
                flight = Flight(
                    flight_type=FlightType.DOUBLES,
                    position=FlightPosition(pos),
                    home_players=[p.id for p in home_doubles[pos-1]],
                    away_players=[p.id for p in away_doubles[pos-1]]
                )
                flights.append(flight)
        
        return flights


class MatchSimulator:
    """Simulates tennis matches with realistic scoring"""
    
    @staticmethod
    def simulate_set(
        home_skill: float,
        away_skill: float,
        games_to_win: int = 6,
        min_lead: int = 2,
        tiebreak_at: int = 6,
        upset_factor: float = SIM_PARAMS["upset_factor"]
    ) -> Tuple[int, int]:
        """
        Simulate a single set between two players/teams
        
        Returns:
            Tuple of (home_games, away_games)
        """
        home_games = 0
        away_games = 0
        
        # Simulate until someone wins the set
        while True:
            # Calculate win probability for this game
            skill_diff = home_skill - away_skill
            home_win_prob = 0.5 + (skill_diff * 0.1)  # Convert skill diff to probability
            
            # Add randomness (upset factor)
            home_win_prob += random.uniform(-upset_factor, upset_factor)
            home_win_prob = max(0.05, min(0.95, home_win_prob))  # Clamp between 5-95%
            
            # Simulate the game
            if random.random() < home_win_prob:
                home_games += 1
            else:
                away_games += 1
            
            # Check for standard set win
            if (home_games >= games_to_win and home_games - away_games >= min_lead):
                return home_games, away_games
            if (away_games >= games_to_win and away_games - home_games >= min_lead):
                return home_games, away_games
            
            # Check for tiebreak
            if home_games == tiebreak_at and away_games == tiebreak_at:
                # Simulate tiebreak (slightly higher skill influence)
                tiebreak_win_prob = 0.5 + (skill_diff * 0.15)
                tiebreak_win_prob = max(0.1, min(0.9, tiebreak_win_prob))
                
                if random.random() < tiebreak_win_prob:
                    home_games += 1
                else:
                    away_games += 1
                return home_games, away_games

    @staticmethod
    def calculate_flight_skill(
        team: Team, 
        player_ids: List[str], 
        is_home: bool,
        flight_type: FlightType
    ) -> float:
        """Calculate effective skill rating for a flight"""
        players = [p for p in team.roster if p.id in player_ids]
        
        if not players:
            return 5.0  # Default if player not found
        
        # Base skill is average of players
        base_skill = sum(p.skill_rating for p in players) / len(players)
        
        # Apply team strength multiplier
        skill = base_skill * team.strength_index
        
        # Apply home court advantage
        if is_home:
            skill *= SIM_PARAMS["home_advantage"]
        
        # Adjust for singles/doubles preference
        if flight_type == FlightType.SINGLES and len(players) == 1:
            # Bonus for singles preference
            skill *= (0.9 + (0.2 * players[0].singles_preference))
        elif flight_type == FlightType.DOUBLES and len(players) == 2:
            # Bonus for doubles preference (1 - singles_preference)
            doubles_preference = sum(1.0 - p.singles_preference for p in players) / len(players)
            skill *= (0.9 + (0.2 * doubles_preference))
            
            # Chemistry bonus for similar skill levels
            if len(players) == 2:
                skill_diff = abs(players[0].skill_rating - players[1].skill_rating)
                chemistry = 1.0 - (skill_diff / 10.0) * 0.2  # Max 20% penalty for mismatched skills
                skill *= chemistry
        
        return skill

    @staticmethod
    def simulate_flight(
        flight: Flight,
        home_team: Team,
        away_team: Team,
        config: Dict = DEFAULT_MATCH_CONFIG
    ) -> Flight:
        """
        Simulate a single flight (singles or doubles match)
        
        Returns:
            Updated Flight object with scores and winner
        """
        # Calculate effective skills
        home_skill = MatchSimulator.calculate_flight_skill(
            home_team, flight.home_players, True, flight.flight_type
        )
        away_skill = MatchSimulator.calculate_flight_skill(
            away_team, flight.away_players, False, flight.flight_type
        )
        
        # Match configuration
        sets_to_play = config.get("sets_per_flight", 2)
        third_set_tiebreak = config.get("third_set_tiebreak", True)
        games_to_win = config.get("games_to_win_set", 6)
        min_lead = config.get("min_games_lead", 2)
        tiebreak_at = config.get("tiebreak_at", 6)
        
        # Simulate sets
        home_sets = 0
        away_sets = 0
        
        for set_num in range(sets_to_play):
            # Simulate the set
            home_games, away_games = MatchSimulator.simulate_set(
                home_skill, away_skill, games_to_win, min_lead, tiebreak_at
            )
            
            # Record scores
            flight.home_score.append(home_games)
            flight.away_score.append(away_games)
            
            # Track set winner
            if home_games > away_games:
                home_sets += 1
            else:
                away_sets += 1
        
        # Check if third set needed (tiebreaker)
        if home_sets == away_sets:
            if third_set_tiebreak:
                # Simulate super tiebreak (first to 10, win by 2)
                tiebreak_win_prob = 0.5 + ((home_skill - away_skill) * 0.15)
                tiebreak_win_prob = max(0.1, min(0.9, tiebreak_win_prob))
                
                if random.random() < tiebreak_win_prob:
                    home_sets += 1
                    flight.home_score.append(10)
                    flight.away_score.append(random.randint(0, 8))
                else:
                    away_sets += 1
                    flight.home_score.append(random.randint(0, 8))
                    flight.away_score.append(10)
            else:
                # Full third set
                home_games, away_games = MatchSimulator.simulate_set(
                    home_skill, away_skill, games_to_win, min_lead, tiebreak_at
                )
                
                flight.home_score.append(home_games)
                flight.away_score.append(away_games)
                
                if home_games > away_games:
                    home_sets += 1
                else:
                    away_sets += 1
        
        # Determine winner
        if home_sets > away_sets:
            flight.winner = "home"
        else:
            flight.winner = "away"
            
        return flight

    @staticmethod
    def simulate_match(
        match: Match,
        teams: Dict[str, Team],
        config: Dict = DEFAULT_MATCH_CONFIG
    ) -> Match:
        """
        Simulate a full dual match between two teams
        
        Returns:
            Updated Match object with flights and results
        """
        home_team = teams[match.home_team_id]
        away_team = teams[match.away_team_id]
        
        # Create flights (lineup)
        if not match.flights:
            match.flights = LineupGenerator.create_match_flights(home_team, away_team, config)
        
        # Simulate each flight
        for flight in match.flights:
            if not flight.winner:  # Don't re-simulate completed flights
                MatchSimulator.simulate_flight(flight, home_team, away_team, config)
                
                # Update match score
                if flight.winner == "home":
                    match.home_wins += 1
                else:
                    match.away_wins += 1
        
        # Mark match as complete
        match.is_complete = True
        
        # Update team records
        if match.home_wins > match.away_wins:
            home_team.wins += 1
            away_team.losses += 1
        elif match.away_wins > match.home_wins:
            away_team.wins += 1
            home_team.losses += 1
        else:
            # It's a tie
            home_team.ties += 1
            away_team.ties += 1
        
        home_team.matches_played += 1
        away_team.matches_played += 1
        
        # Calculate APR points gained
        MatchSimulator.update_apr_components(match, teams)
        
        return match
    
    @staticmethod
    def update_apr_components(match: Match, teams: Dict[str, Team]) -> None:
        """Update APR components (WS10) for both teams based on match results"""
        home_team = teams[match.home_team_id]
        away_team = teams[match.away_team_id]
        
        for flight in match.flights:
            # Only count flights that contribute to APR (position 1-3)
            if flight.position.value <= 3:
                # Get weight for this flight
                weight = flight.weight()
                
                # Award points to winning team
                if flight.winner == "home":
                    home_team.weighted_score += weight
                else:
                    away_team.weighted_score += weight
