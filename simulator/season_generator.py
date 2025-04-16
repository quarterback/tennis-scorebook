"""
Generates a full season schedule and simulates all matches
"""
import random
import uuid
from typing import Dict, List, Optional, Set, Tuple
from datetime import datetime, timedelta
import math

from models import Team, District, Match, Season
from match_simulator import MatchSimulator
from config import DEFAULT_SEASON_CONFIG, MIN_MATCHES_FOR_OSI

def generate_league_schedule(
    district: District,
    teams: Dict[str, Team],
    start_date: datetime,
    end_date: datetime,
    config: Dict = DEFAULT_SEASON_CONFIG
) -> List[Match]:
    """
    Generate a schedule of league matches for teams in a district
    
    Args:
        district: The district/league
        teams: Dictionary of all teams
        start_date: Season start date
        end_date: Season end date
        config: Season configuration parameters
    
    Returns:
        List of scheduled matches
    """
    district_teams = [teams[team_id] for team_id in district.teams]
    
    if len(district_teams) < config["min_teams_per_district"]:
        return []  # Skip districts with too few teams
    
    # Determine if we need double round robin based on district size
    double_round = len(district_teams) < config["double_round_robin_threshold"]
    
    # Calculate matches per team based on district size
    team_count = len(district_teams)
    round_count = 2 if double_round else 1
    
    # Calculate target league matches per team (80% of total matches)
    # Ensure we hit minimum match count by adjusting league matches accordingly
    league_match_target = max(
        math.floor(config["min_matches_per_team"] * config["league_match_percentage"]),
        min((team_count - 1) * round_count, math.floor(config["matches_per_team"] * config["league_match_percentage"]))
    )
    
    # Create list of teams and shuffle
    team_ids = district.teams.copy()
    random.shuffle(team_ids)
    
    # Generate round robin matches
    matches = []
    season_days = (end_date - start_date).days
    
    # Create round robin pairings
    for round_num in range(round_count):
        for i in range(len(team_ids)):
            for j in range(i + 1, len(team_ids)):
                home_id = team_ids[i]
                away_id = team_ids[j]
                
                # Swap home/away for second round
                if round_num == 1:
                    home_id, away_id = away_id, home_id
                
                # Random date within season
                match_date = start_date + timedelta(
                    days=random.randint(0, season_days)
                )
                
                match = Match(
                    id=str(uuid.uuid4()),
                    date=match_date.date(),
                    home_team_id=home_id,
                    away_team_id=away_id,
                    is_league_match=True
                )
                matches.append(match)
    
    # Sort by date
    matches.sort(key=lambda m: m.date)
    return matches

def generate_non_league_matches(
    teams: Dict[str, Team],
    districts: Dict[str, District],
    existing_matches: List[Match],
    start_date: datetime,
    end_date: datetime,
    config: Dict = DEFAULT_SEASON_CONFIG
) -> List[Match]:
    """
    Generate non-league matches to fill out schedules
    
    Args:
        teams: Dictionary of all teams
        districts: Dictionary of all districts
        existing_matches: Already scheduled matches
        start_date: Season start date
        end_date: Season end date
        config: Season configuration parameters
    
    Returns:
        List of additional non-league matches
    """
    new_matches = []
    season_days = (end_date - start_date).days
    
    # Count existing matches per team
    team_match_counts = {team_id: 0 for team_id in teams}
    for match in existing_matches:
        team_match_counts[match.home_team_id] += 1
        team_match_counts[match.away_team_id] += 1
    
    # Find teams needing more matches
    for team_id, match_count in team_match_counts.items():
        team = teams[team_id]
        
        # How many more matches does this team need to reach the minimum?
        matches_needed = max(0, config["min_matches_per_team"] - match_count)
        
        if matches_needed <= 0:
            continue
        
        # Find potential opponents (preferably in same classification)
        potential_opponents = []
        
        for other_id, other_count in team_match_counts.items():
            if other_id == team_id:
                continue
                
            # Skip if other team's schedule is full
            if other_count >= config["max_matches_per_team"]:
                continue
                
            other_team = teams[other_id]
            
            # Ensure teams are same gender
            if other_team.gender != team.gender:
                continue
                
            # Check if teams are already scheduled to play
            already_playing = sum(
                1 for m in existing_matches + new_matches
                if (m.home_team_id == team_id and m.away_team_id == other_id) or
                (m.home_team_id == other_id and m.away_team_id == team_id)
            )
            
            # Limit teams playing each other to twice per season
            if already_playing >= 2:
                continue
            
            # Calculate priority score (higher = better match)
            priority = 1.0
            
            # Prioritize teams in same classification
            if other_team.classification == team.classification:
                priority += 3.0
            
            # Prioritize teams that need more matches to reach minimum
            other_needed = max(0, config["min_matches_per_team"] - other_count)
            if other_needed > 0:
                priority += 2.0
            
            # Prioritize teams that won't exceed max match count
            if other_count + 1 <= config["max_matches_per_team"]:
                priority += 1.0
            
            potential_opponents.append((other_id, priority))
        
        # Sort by priority (highest first)
        potential_opponents.sort(key=lambda x: x[1], reverse=True)
        
        # Schedule matches
        for opponent_id, _ in potential_opponents[:matches_needed]:
            # Random date
            match_date = start_date + timedelta(
                days=random.randint(0, season_days)
            )
            
            # Random home/away
            if random.random() < 0.5:
                home_id, away_id = team_id, opponent_id
            else:
                home_id, away_id = opponent_id, team_id
            
            match = Match(
                id=str(uuid.uuid4()),
                date=match_date.date(),
                home_team_id=home_id,
                away_team_id=away_id,
                is_league_match=False
            )
            
            new_matches.append(match)
            
            # Update counts
            team_match_counts[home_id] += 1
            team_match_counts[away_id] += 1
            
            # Stop if we've reached the maximum match count
            if team_match_counts[team_id] >= config["max_matches_per_team"]:
                break
    
    # Sort by date
    new_matches.sort(key=lambda m: m.date)
    return new_matches

def generate_season(
    teams: Dict[str, Team],
    districts: Dict[str, District],
    start_date: datetime = datetime(2023, 3, 1),
    end_date: datetime = datetime(2023, 5, 15),
    config: Dict = DEFAULT_SEASON_CONFIG
) -> Season:
    """
    Generate a full season schedule
    
    Args:
        teams: Dictionary of all teams
        districts: Dictionary of all districts
        start_date: Season start date
        end_date: Season end date
        config: Season configuration parameters
    
    Returns:
        Season object with all scheduled matches
    """
    all_matches = []
    
    # Generate league schedules for each district
    for district in districts.values():
        league_matches = generate_league_schedule(
            district, teams, start_date, end_date, config
        )
        all_matches.extend(league_matches)
    
    # Fill out with non-league matches
    non_league_matches = generate_non_league_matches(
        teams, districts, all_matches, start_date, end_date, config
    )
    all_matches.extend(non_league_matches)
    
    # Sort all matches by date
    all_matches.sort(key=lambda m: m.date)
    
    # Create season object
    season = Season(
        teams=teams,
        districts=districts,
        matches=all_matches,
        year=start_date.year
    )
    
    return season

def simulate_season(season: Season) -> Season:
    """
    Simulate all matches in a season
    
    Args:
        season: Season object with scheduled matches
    
    Returns:
        Updated season with simulated match results
    """
    # Simulate each match chronologically
    for match in sorted(season.matches, key=lambda m: m.date):
        MatchSimulator.simulate_match(match, season.teams)
    
    # Calculate final OSI values
    calculate_opponent_strength_indices(season)
    
    return season

def calculate_opponent_strength_indices(season: Season) -> None:
    """
    Calculate Opponent Strength Index (OSI) for all teams
    
    Args:
        season: Season with completed matches
        
    Note:
        This updates the OSI values in the team objects directly
    """
    # First ensure all teams have WS10 values
    for team in season.teams.values():
        if team.matches_played == 0:
            team.weighted_score = 0.0
    
    # Calculate raw OSI values
    for team_id, team in season.teams.items():
        if team.matches_played == 0:
            continue
            
        # Get all opponents
        opponents = []
        for match in season.matches_for_team(team_id):
            opp_id = match.home_team_id if match.away_team_id == team_id else match.away_team_id
            opponents.append(opp_id)
        
        # Calculate average opponent WS10 (only for opponents with enough matches)
        valid_scores = []
        for opp_id in opponents:
            opponent = season.teams[opp_id]
            if opponent.matches_played >= MIN_MATCHES_FOR_OSI:
                valid_scores.append(opponent.weighted_score)
        
        # Calculate OSI
        if valid_scores:
            avg_opponent_score = sum(valid_scores) / len(valid_scores)
            team.opponent_strength_index = avg_opponent_score
        else:
            # Default if no valid opponents
            team.opponent_strength_index = 1.0
    
    # Scale OSI values around a target median
    target_median = 0.90
    
    # Get all non-zero OSI values
    all_osi = [team.opponent_strength_index for team in season.teams.values() 
              if team.matches_played > 0]
    
    if all_osi:
        # Calculate current median
        all_osi.sort()
        if len(all_osi) % 2 == 0:
            current_median = (all_osi[len(all_osi)//2] + all_osi[len(all_osi)//2-1]) / 2
        else:
            current_median = all_osi[len(all_osi)//2]
        
        # Scale factor
        if current_median > 0:
            scale_factor = target_median / current_median
            
            # Apply scaling
            for team in season.teams.values():
                if team.matches_played > 0:
                    team.opponent_strength_index *= scale_factor
