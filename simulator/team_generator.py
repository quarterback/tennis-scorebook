
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

def generate_oregon_teams() -> dict:
    """Generate all Oregon high school tennis teams"""
    districts = [
        # 6A Districts
        {"id": "6a-1", "name": "Portland Interscholastic League", "classification": "6A"},
        {"id": "6a-2", "name": "Metro League", "classification": "6A"},
        {"id": "6a-3", "name": "Pacific Conference", "classification": "6A"},
        {"id": "6a-4", "name": "Mt. Hood Conference", "classification": "6A"},
        {"id": "6a-5", "name": "Three Rivers League", "classification": "6A"},
        {"id": "6a-6", "name": "Central Valley Conference", "classification": "6A"},
        {"id": "6a-7", "name": "Southwest Conference", "classification": "6A"},
        
        # 5A Districts
        {"id": "5a-1", "name": "Northwest Oregon Conference", "classification": "5A"},
        {"id": "5a-2", "name": "Midwestern League", "classification": "5A"},
        {"id": "5a-3", "name": "Mid-Willamette Conference", "classification": "5A"},
        {"id": "5a-4", "name": "Intermountain Conference", "classification": "5A"},
        
        # 4A/3A/2A/1A Special Districts
        {"id": "sd-1", "name": "Special District 1", "classification": "4A/3A/2A/1A"},
        {"id": "sd-2", "name": "Special District 2", "classification": "4A/3A/2A/1A"},
        {"id": "sd-3", "name": "Special District 3", "classification": "4A/3A/2A/1A"},
        {"id": "sd-4", "name": "Special District 4", "classification": "4A/3A/2A/1A"},
        {"id": "sd-5", "name": "Special District 5", "classification": "4A/3A/2A/1A"}
    ]
    
    schools = {
        # 6A-1 Portland Interscholastic League
        "6a-1": ["Benson", "Cleveland", "Franklin", "Grant", "Ida B. Wells", "Lincoln", 
                 "McDaniel", "Roosevelt"],
        
        # 6A-2 Metro League
        "6a-2": ["Aloha", "Beaverton", "Jesuit", "Mountainside", "Southridge", "Sunset", 
                 "Westview"],
        
        # 6A-3 Pacific Conference
        "6a-3": ["Century", "Forest Grove", "Glencoe", "Liberty", "McMinnville", "Newberg", 
                 "Sherwood"],
        
        # 6A-4 Mt. Hood Conference
        "6a-4": ["Barlow", "Central Catholic", "Clackamas", "David Douglas", "Gresham", 
                 "Nelson", "Reynolds", "Sandy"],
        
        # 6A-5 Three Rivers League
        "6a-5": ["Lake Oswego", "Lakeridge", "St. Mary's Academy", "Tigard", "Tualatin", 
                 "West Linn"],
        
        # 6A-6 Central Valley Conference
        "6a-6": ["McNary", "North Salem", "South Salem", "Sprague", "West Salem"],
        
        # 6A-7 Southwest Conference
        "6a-7": ["Grants Pass", "North Medford", "Roseburg", "Sheldon", "South Eugene", 
                 "South Medford", "Willamette"],
        
        # 5A-1 Northwest Oregon Conference
        "5a-1": ["Canby", "Centennial", "Hillsboro", "Hood River Valley", "La Salle Prep",
                 "Milwaukie / Milwaukie Acad. of the Arts", "Parkrose", "Putnam", "Wilsonville"],
        
        # 5A-2 Midwestern League
        "5a-2": ["Ashland", "Churchill", "North Eugene", "Springfield", "Thurston"],
        
        # 5A-3 Mid-Willamette Conference
        "5a-3": ["Central / Kings Valley Char.", "Corvallis", "Crescent Valley", "Dallas",
                 "Lebanon", "McKay", "Silverton", "South Albany", "West Albany", "Woodburn"],
        
        # 5A-4 Intermountain Conference
        "5a-4": ["Bend", "Caldera", "Mountain View", "Redmond", "Ridgeview", "Summit"],
        
        # SD-1 Special District 1
        "sd-1": ["Blanchet Catholic", "Catlin Gabel", "Oregon Episcopal", "Riverdale",
                 "Riverside, WLWV", "Scappoose", "St. Helens", "Tillamook", "Trinity Academy",
                 "Valley Catholic", "Westside Christian"],
        
        # SD-2 Special District 2
        "sd-2": ["Cascade", "Estacada", "Junction City", "Marist Catholic", "Molalla",
                 "North Marion", "Philomath", "Stayton"],
        
        # SD-3 Special District 3
        "sd-3": ["Cascade Christian", "Creswell", "Henley", "Hidden Valley", "Klamath Union",
                 "Marshfield", "Mazama", "North Bend", "North Valley", "Phoenix", "St. Mary's, Medford"],
        
        # SD-4 Special District 4
        "sd-4": ["Arlington", "Condon", "Crook County", "Ione / Heppner", "Irrigon", "Madras",
                 "Riverside", "Sherman", "Sisters", "Stanfield / Echo", "The Dalles", "Umatilla",
                 "Weston-McEwen / Griswold"],
        
        # SD-5 Special District 5
        "sd-5": ["Baker / Powder Valley", "Four Rivers", "La Grande", "McLoughlin", "Nyssa",
                 "Ontario", "Pendleton", "Vale"]
    }
    
    teams = []
    # Generate teams for each school (both Boys and Girls)
    for district_id, school_list in schools.items():
        district_info = next(d for d in districts if d["id"] == district_id)
        for school in school_list:
            for gender in ["Boys", "Girls"]:
                team_id = str(uuid.uuid4())
                team = {
                    "id": team_id,
                    "name": f"{school} {gender}",
                    "school_name": school,
                    "classification": district_info["classification"],
                    "district_id": district_id,
                    "strength_index": round(random.uniform(0.85, 1.25), 2)
                }
                teams.append(team)
    
    return {
        "districts": districts,
        "teams": teams
    }

def initialize_teams(teams_file: Optional[str] = None) -> Tuple[Dict[str, Team], Dict[str, District]]:
    """
    Initialize all teams with rosters and return as a dictionary keyed by ID
    """
    # Generate fresh Oregon teams data
    teams_data = generate_oregon_teams()
    
    # Save to file if provided
    if teams_file:
        with open(teams_file, 'w') as f:
            json.dump(teams_data, f, indent=2)
    
    teams_list, districts_list = load_teams_from_json(teams_file)
    
    # Generate rosters for all teams
    for team in teams_list:
        team.roster = generate_team_roster(team)
    
    # Convert to dictionaries for easy lookup
    teams_dict = {team.id: team for team in teams_list}
    districts_dict = {district.id: district for district in districts_list}
    
    return teams_dict, districts_dict

# ... keep existing code (generate_player, generate_team_roster, generate_teams functions)

if __name__ == "__main__":
    # Generate fresh teams data
    teams_file = os.path.join(DATA_DIR, "teams.json")
    teams_data = generate_oregon_teams()
    
    # Save to file
    with open(teams_file, 'w') as f:
        json.dump(teams_data, f, indent=2)
    
    print(f"Generated {len(teams_data['teams'])} teams in {len(teams_data['districts'])} districts")
    print(f"Data saved to {teams_file}")
