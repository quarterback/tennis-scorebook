
"""
Calculates APR rankings based on season results
"""
from typing import Dict, List, Tuple, Optional
from collections import defaultdict

from models import Team, Season, Classification

def calculate_apr_rankings(season: Season) -> List[Tuple[Team, float]]:
    """
    Calculate APR rankings for all teams in the season
    
    Args:
        season: Completed season with match results
        
    Returns:
        List of (team, apr_score) tuples sorted by APR (highest first)
    """
    # First, ensure OSI values are calculated
    from season_generator import calculate_opponent_strength_indices
    calculate_opponent_strength_indices(season)
    
    # Calculate APR for each team
    rankings = []
    for team_id, team in season.teams.items():
        if team.matches_played == 0:
            continue
            
        apr_score = team.weighted_score * team.opponent_strength_index
        rankings.append((team, apr_score))
    
    # Sort by APR (highest first)
    rankings.sort(key=lambda x: x[1], reverse=True)
    return rankings

def get_classification_rankings(
    rankings: List[Tuple[Team, float]],
    classification: Optional[Classification] = None
) -> List[Tuple[Team, float]]:
    """
    Filter rankings by classification
    
    Args:
        rankings: Full rankings list
        classification: Optional classification to filter by
        
    Returns:
        Filtered rankings list
    """
    if classification is None:
        return rankings
        
    return [(team, apr) for team, apr in rankings 
            if team.classification == classification]

def get_district_rankings(
    rankings: List[Tuple[Team, float]],
    district_id: Optional[str] = None
) -> List[Tuple[Team, float]]:
    """
    Filter rankings by district
    
    Args:
        rankings: Full rankings list
        district_id: District ID to filter by
        
    Returns:
        Filtered rankings list
    """
    if district_id is None:
        return rankings
        
    return [(team, apr) for team, apr in rankings 
            if team.district == district_id]

def calculate_state_qualifiers(
    season: Season,
    rankings: List[Tuple[Team, float]]
) -> Dict[Classification, List[Tuple[Team, float, str]]]:
    """
    Determine state tournament qualifiers
    
    Args:
        season: Completed season
        rankings: Overall rankings
        
    Returns:
        Dictionary mapping classifications to qualifiers with qualification method
    """
    qualifiers = defaultdict(list)
    
    # Define qualification spots per classification
    qualification_rules = {
        Classification.SIX_A: {"total": 16, "auto": 7},
        Classification.FIVE_A: {"total": 12, "auto": 4},
        Classification.FOUR_A: {"total": 8, "auto": 5},
        Classification.THREE_A: {"total": 8, "auto": 5},
        Classification.TWO_A: {"total": 8, "auto": 5},
        Classification.ONE_A: {"total": 8, "auto": 5}
    }
    
    # Combine smaller classifications
    # 4A/3A/2A/1A often compete together in Oregon
    combined_classes = [
        Classification.FOUR_A, 
        Classification.THREE_A, 
        Classification.TWO_A, 
        Classification.ONE_A
    ]
    
    # Group teams by classification
    teams_by_class = defaultdict(list)
    for team, apr in rankings:
        if team.classification in combined_classes:
            # Use combined class for smaller schools
            teams_by_class["combined"].append((team, apr))
        else:
            teams_by_class[team.classification].append((team, apr))
    
    # Process each classification
    processed_classes = set()
    
    # Handle automatic qualifiers (district champions)
    district_champions = {}
    
    # Find district champions
    for district_id, district in season.districts.items():
        # Get teams in this district
        district_teams = [team_id for team_id in district.teams]
        if not district_teams:
            continue
            
        # Get league/district rankings
        district_rankings = []
        for team_id in district_teams:
            team = season.teams[team_id]
            if team.matches_played > 0:
                # First rank by league win percentage
                league_matches = [m for m in season.matches_for_team(team_id) 
                                 if m.is_league_match]
                league_wins = sum(1 for m in league_matches 
                                 if (m.home_team_id == team_id and m.home_wins > m.away_wins) or
                                    (m.away_team_id == team_id and m.away_wins > m.home_wins))
                league_ties = sum(1 for m in league_matches 
                                 if m.home_wins == m.away_wins)
                league_matches_played = len(league_matches)
                
                if league_matches_played > 0:
                    league_win_pct = (league_wins + (league_ties * 0.5)) / league_matches_played
                else:
                    league_win_pct = 0.0
                
                # Find APR for tiebreakers
                team_apr = next((apr for t, apr in rankings if t.id == team_id), 0.0)
                
                district_rankings.append((team, league_win_pct, team_apr))
        
        # Sort by league win percentage, then APR for ties
        district_rankings.sort(key=lambda x: (x[1], x[2]), reverse=True)
        
        if district_rankings:
            # Champion is first in rankings
            champion = district_rankings[0][0]
            district_champions[district_id] = champion
    
    # Now assign qualifiers for each classification
    for classification, rule in qualification_rules.items():
        # Skip combined classes (handle separately)
        if classification in combined_classes:
            continue
            
        # Get teams for this classification
        class_teams = teams_by_class.get(classification, [])
        
        # Track teams already qualified
        qualified_teams = set()
        
        # First: automatic qualifiers (district champions)
        auto_bids = []
        for district_id, champion in district_champions.items():
            district = season.districts[district_id]
            if district.classification == classification and champion.classification == classification:
                auto_bids.append((champion, next((apr for t, apr in rankings if t.id == champion.id), 0.0)))
                qualified_teams.add(champion.id)
        
        # Add automatic qualifiers
        for team, apr in auto_bids:
            qualifiers[classification].append((team, apr, "automatic"))
        
        # Fill remaining spots with at-large bids
        at_large_spots = rule["total"] - len(auto_bids)
        
        # Get top ranked teams that haven't qualified yet
        at_large_candidates = [(team, apr) for team, apr in class_teams 
                              if team.id not in qualified_teams]
        
        # Add at-large qualifiers
        for team, apr in at_large_candidates[:at_large_spots]:
            qualifiers[classification].append((team, apr, "at-large"))
    
    # Handle combined classification (4A/3A/2A/1A)
    if "combined" in teams_by_class:
        combined_rule = qualification_rules[Classification.FOUR_A]  # Use 4A rules
        combined_teams = teams_by_class["combined"]
        
        # Track teams already qualified
        qualified_teams = set()
        
        # First: automatic qualifiers (district champions)
        auto_bids = []
        for district_id, champion in district_champions.items():
            district = season.districts[district_id]
            if district.classification in combined_classes:
                auto_bids.append((champion, next((apr for t, apr in rankings if t.id == champion.id), 0.0)))
                qualified_teams.add(champion.id)
        
        # Limit auto bids to the specified number
        auto_bids = auto_bids[:combined_rule["auto"]]
        
        # Add automatic qualifiers
        for team, apr in auto_bids:
            qualifiers["combined"].append((team, apr, "automatic"))
        
        # Fill remaining spots with at-large bids
        at_large_spots = combined_rule["total"] - len(auto_bids)
        
        # Get top ranked teams that haven't qualified yet
        at_large_candidates = [(team, apr) for team, apr in combined_teams 
                              if team.id not in qualified_teams]
        
        # Add at-large qualifiers
        for team, apr in at_large_candidates[:at_large_spots]:
            qualifiers["combined"].append((team, apr, "at-large"))
    
    return qualifiers
