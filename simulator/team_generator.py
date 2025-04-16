
"""
Generates teams and players for the simulation
"""
import json
import random
import uuid
from typing import List, Dict, Optional, Tuple
import os
import numpy as np

from models import Team, Player, Classification, District
from config import SIM_PARAMS, DATA_DIR

def load_teams_from_json(file_path: Optional[str] = None) -> Tuple[List[Team], List[District]]:
    """
    Load teams data from a JSON file or use default if not provided
    
    Returns:
        Tuple of (teams, districts)
    """
    if file_path is None:
        file_path = os.path.join(DATA_DIR, "teams.json")
    
    # Check if file exists
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Teams file not found: {file_path}")
    
    with open(file_path, 'r') as f:
        data = json.load(f)
    
    districts_data = data.get("districts", [])
    teams_data = data.get("teams", [])
    
    # Create district objects
    districts = []
    for district_data in districts_data:
        district = District(
            id=district_data.get("id", str(uuid.uuid4())),
            name=district_data.get("name", "Unknown District"),
            classification=Classification(district_data.get("classification", "6A")),
            teams=[]
        )
        districts.append(district)
    
    # Create team objects
    teams = []
    for team_data in teams_data:
        district_id = team_data.get("district_id")
        classification_str = team_data.get("classification", "6A")
        
        # Find matching district
        district = next((d for d in districts if d.id == district_id), None)
        
        # Create team
        team_id = team_data.get("id", str(uuid.uuid4()))
        team = Team(
            id=team_id,
            name=team_data.get("name", "Unknown Team"),
            school_name=team_data.get("school_name", "Unknown School"),
            district=district_id,
            classification=Classification(classification_str),
            strength_index=team_data.get("strength_index", random.uniform(
                SIM_PARAMS["team_strength_range"][0], 
                SIM_PARAMS["team_strength_range"][1]
            ))
        )
        
        # Add to teams list
        teams.append(team)
        
        # Add team ID to district's teams list if district exists
        if district:
            district.teams.append(team_id)
    
    return teams, districts

def generate_player(team_id: str) -> Player:
    """
    Generate a random player with realistic attributes
    """
    # Determine player's grade/year
    year_choices = ["9", "10", "11", "12"]
    year_weights = [
        SIM_PARAMS["freshmen_ratio"],
        SIM_PARAMS["sophomores_ratio"],
        SIM_PARAMS["juniors_ratio"],
        SIM_PARAMS["seniors_ratio"]
    ]
    year = random.choices(year_choices, weights=year_weights, k=1)[0]
    
    # Higher years tend to have higher skill ratings
    year_bonus = (int(year) - 9) * 0.5  # 0 for freshmen, 1.5 for seniors
    
    # Generate base skill using normal distribution
    if SIM_PARAMS["skill_distribution"] == "normal":
        base_skill = np.random.normal(
            SIM_PARAMS["skill_mean"] + year_bonus,
            SIM_PARAMS["skill_stddev"]
        )
    else:
        # Fallback to uniform distribution
        base_skill = random.uniform(
            SIM_PARAMS["skill_range"][0] + year_bonus,
            SIM_PARAMS["skill_range"][1]
        )
    
    # Clamp skill to valid range
    skill_rating = max(SIM_PARAMS["skill_range"][0], 
                       min(SIM_PARAMS["skill_range"][1], base_skill))
    
    # Singles preference (random but slightly biased by skill - better players
    # slightly more likely to prefer singles)
    singles_pref_base = random.uniform(0.2, 0.8)
    skill_influence = (skill_rating - SIM_PARAMS["skill_mean"]) / 10
    singles_preference = max(0.0, min(1.0, singles_pref_base + skill_influence))
    
    return Player(
        id=str(uuid.uuid4()),
        name=f"Player-{random.randint(1000, 9999)}",  # Placeholder
        skill_rating=skill_rating,
        singles_preference=singles_preference,
        year=year
    )

def generate_team_roster(team: Team) -> List[Player]:
    """
    Generate a full roster of players for a team
    """
    # Determine roster size with some variance
    roster_size = max(8, round(
        SIM_PARAMS["players_per_team"] + 
        random.uniform(-SIM_PARAMS["roster_variance"], SIM_PARAMS["roster_variance"])
    ))
    
    # Generate players
    roster = []
    for _ in range(roster_size):
        player = generate_player(team.id)
        roster.append(player)
    
    # Sort roster by skill (highest to lowest)
    roster.sort(key=lambda p: p.skill_rating, reverse=True)
    
    return roster

def generate_teams(count: int, districts: List[Dict]) -> List[Team]:
    """
    Generate a specified number of teams and assign to districts
    """
    teams = []
    for i in range(count):
        # Randomly select a district
        district = random.choice(districts)
        
        team = Team(
            id=str(uuid.uuid4()),
            name=f"Team {i+1}",
            school_name=f"School {i+1}",
            district=district["id"],
            classification=Classification(district["classification"]),
            strength_index=random.uniform(
                SIM_PARAMS["team_strength_range"][0], 
                SIM_PARAMS["team_strength_range"][1]
            )
        )
        teams.append(team)
    
    return teams

def initialize_teams(teams_file: Optional[str] = None) -> Tuple[Dict[str, Team], Dict[str, District]]:
    """
    Initialize all teams with rosters and return as a dictionary keyed by ID
    """
    teams_list, districts_list = load_teams_from_json(teams_file)
    
    # Generate rosters for all teams
    for team in teams_list:
        team.roster = generate_team_roster(team)
    
    # Convert to dictionaries for easy lookup
    teams_dict = {team.id: team for team in teams_list}
    districts_dict = {district.id: district for district in districts_list}
    
    return teams_dict, districts_dict

if __name__ == "__main__":
    # Test functionality
    teams, districts = initialize_teams()
    print(f"Generated {len(teams)} teams in {len(districts)} districts")
    
    # Print a sample team
    sample_team = list(teams.values())[0]
    print(f"\nSample Team: {sample_team.name} ({sample_team.classification.value})")
    print(f"Roster size: {len(sample_team.roster)}")
    
    # Print top 3 players
    print("\nTop 3 players:")
    for i, player in enumerate(sorted(sample_team.roster, key=lambda p: p.skill_rating, reverse=True)[:3]):
        print(f"{i+1}. {player.name} (Grade {player.year}): Skill={player.skill_rating:.2f}, Singles Pref={player.singles_preference:.2f}")
