
"""
Utility functions for the simulator
"""
import os
import json
import random
import string
from typing import Dict, List, Tuple, Optional
import numpy as np
from datetime import datetime, timedelta

from config import DATA_DIR

def ensure_data_dir():
    """Ensure data directory exists"""
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)

def generate_random_id(length: int = 8) -> str:
    """Generate a random ID string"""
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=length))

def create_sample_teams_data(output_file: Optional[str] = None) -> str:
    """
    Create a sample teams.json file with Oregon high schools
    
    Args:
        output_file: Path to save the file (default: DATA_DIR/teams.json)
        
    Returns:
        Path to the created file
    """
    ensure_data_dir()
    
    if output_file is None:
        output_file = os.path.join(DATA_DIR, "teams.json")
    
    # Define some sample Oregon high school districts/leagues
    districts = [
        # 6A
        {"id": "metro", "name": "Metro League", "classification": "6A"},
        {"id": "trl", "name": "Three Rivers League", "classification": "6A"},
        {"id": "mthood", "name": "Mt. Hood Conference", "classification": "6A"},
        {"id": "pacific", "name": "Pacific Conference", "classification": "6A"},
        {"id": "PIL", "name": "Portland Interscholastic League", "classification": "6A"},
        {"id": "mvcnorth", "name": "Mountain Valley Conference North", "classification": "6A"},
        {"id": "swc", "name": "Southwest Conference", "classification": "6A"},
        
        # 5A
        {"id": "nwoc", "name": "Northwest Oregon Conference", "classification": "5A"},
        {"id": "midw", "name": "Midwestern League", "classification": "5A"},
        {"id": "mwc", "name": "Mid-Willamette Conference", "classification": "5A"},
        {"id": "imcnorth", "name": "Intermountain Conference North", "classification": "5A"},
        
        # 4A
        {"id": "cowapa", "name": "Cowapa League", "classification": "4A"},
        {"id": "tririver", "name": "Tri-Valley Conference", "classification": "4A"},
        {"id": "sky-em", "name": "Sky-Em League", "classification": "4A"},
        {"id": "imcsouth", "name": "Intermountain Conference South", "classification": "4A"},
        
        # 3A-1A
        {"id": "3a-val", "name": "3A Valley League", "classification": "3A"},
        {"id": "2a-mtn", "name": "2A Mountain League", "classification": "2A"},
        {"id": "1a-ind", "name": "1A Independent Schools", "classification": "1A"}
    ]
    
    # Sample schools for each district
    teams = []
    
    # Metro League (6A)
    metro_schools = [
        "Beaverton", "Jesuit", "Mountainside", "Southridge", 
        "Sunset", "Westview", "Aloha"
    ]
    for school in metro_schools:
        teams.append({
            "id": generate_random_id(),
            "name": f"{school} Girls",
            "school_name": school,
            "classification": "6A",
            "district_id": "metro",
            "strength_index": round(random.uniform(0.85, 1.25), 2)
        })
    
    # Three Rivers League (6A)
    trl_schools = [
        "Lake Oswego", "Lakeridge", "Oregon City", "Tigard",
        "Tualatin", "West Linn", "Canby"
    ]
    for school in trl_schools:
        teams.append({
            "id": generate_random_id(),
            "name": f"{school} Girls",
            "school_name": school,
            "classification": "6A",
            "district_id": "trl",
            "strength_index": round(random.uniform(0.85, 1.25), 2)
        })
    
    # Mt. Hood Conference (6A)
    mthood_schools = [
        "Barlow", "Central Catholic", "Clackamas", "David Douglas",
        "Gresham", "Reynolds", "Sandy"
    ]
    for school in mthood_schools:
        teams.append({
            "id": generate_random_id(),
            "name": f"{school} Girls",
            "school_name": school,
            "classification": "6A",
            "district_id": "mthood",
            "strength_index": round(random.uniform(0.85, 1.25), 2)
        })
    
    # Pacific Conference (6A)
    pacific_schools = [
        "Century", "Glencoe", "Liberty", "McMinnville",
        "Newberg", "Sherwood"
    ]
    for school in pacific_schools:
        teams.append({
            "id": generate_random_id(),
            "name": f"{school} Girls",
            "school_name": school,
            "classification": "6A",
            "district_id": "pacific",
            "strength_index": round(random.uniform(0.85, 1.25), 2)
        })
    
    # PIL (6A)
    pil_schools = [
        "Cleveland", "Franklin", "Grant", "Lincoln",
        "McDaniel", "Roosevelt", "Wells", "Jefferson"
    ]
    for school in pil_schools:
        teams.append({
            "id": generate_random_id(),
            "name": f"{school} Girls",
            "school_name": school,
            "classification": "6A",
            "district_id": "PIL",
            "strength_index": round(random.uniform(0.85, 1.25), 2)
        })
    
    # Mountain Valley North (6A)
    mvcnorth_schools = [
        "Bend", "Mountain View", "Summit", "Caldera"
    ]
    for school in mvcnorth_schools:
        teams.append({
            "id": generate_random_id(),
            "name": f"{school} Girls",
            "school_name": school,
            "classification": "6A",
            "district_id": "mvcnorth",
            "strength_index": round(random.uniform(0.85, 1.25), 2)
        })
    
    # Southwest Conference (6A)
    swc_schools = [
        "North Medford", "South Medford", "Grants Pass", "Sheldon",
        "South Eugene", "Roseburg"
    ]
    for school in swc_schools:
        teams.append({
            "id": generate_random_id(),
            "name": f"{school} Girls",
            "school_name": school,
            "classification": "6A",
            "district_id": "swc",
            "strength_index": round(random.uniform(0.85, 1.25), 2)
        })
    
    # Northwest Oregon Conference (5A)
    nwoc_schools = [
        "La Salle Prep", "Wilsonville", "Putnam", "Scappoose",
        "Hillsboro", "St. Helens", "Forest Grove", "Parkrose"
    ]
    for school in nwoc_schools:
        teams.append({
            "id": generate_random_id(),
            "name": f"{school} Girls",
            "school_name": school,
            "classification": "5A",
            "district_id": "nwoc",
            "strength_index": round(random.uniform(0.80, 1.20), 2)
        })
    
    # Midwestern League (5A)
    midw_schools = [
        "Churchill", "North Eugene", "Springfield", "Thurston",
        "Ashland", "Crater", "Eagle Point"
    ]
    for school in midw_schools:
        teams.append({
            "id": generate_random_id(),
            "name": f"{school} Girls",
            "school_name": school,
            "classification": "5A",
            "district_id": "midw",
            "strength_index": round(random.uniform(0.80, 1.20), 2)
        })
    
    # Mid-Willamette Conference (5A)
    mwc_schools = [
        "Corvallis", "Crescent Valley", "Dallas", "Lebanon",
        "Silverton", "South Albany", "West Albany", "McKay"
    ]
    for school in mwc_schools:
        teams.append({
            "id": generate_random_id(),
            "name": f"{school} Girls",
            "school_name": school,
            "classification": "5A",
            "district_id": "mwc",
            "strength_index": round(random.uniform(0.80, 1.20), 2)
        })
    
    # Add some 4A, 3A, 2A, 1A schools
    # Cowapa League (4A)
    cowapa_schools = [
        "Astoria", "Banks", "Seaside", "Tillamook", "Valley Catholic"
    ]
    for school in cowapa_schools:
        teams.append({
            "id": generate_random_id(),
            "name": f"{school} Girls",
            "school_name": school,
            "classification": "4A",
            "district_id": "cowapa",
            "strength_index": round(random.uniform(0.75, 1.15), 2)
        })
    
    # Selected teams from other classifications
    misc_teams = [
        {"school": "Cascade", "classification": "4A", "district_id": "tririver", "strength": 1.05},
        {"school": "North Marion", "classification": "4A", "district_id": "tririver", "strength": 0.95},
        {"school": "Marist Catholic", "classification": "4A", "district_id": "sky-em", "strength": 1.10},
        {"school": "Sisters", "classification": "4A", "district_id": "sky-em", "strength": 0.90},
        {"school": "Catlin Gabel", "classification": "3A", "district_id": "3a-val", "strength": 1.15},
        {"school": "Oregon Episcopal", "classification": "3A", "district_id": "3a-val", "strength": 1.20},
        {"school": "Blanchet Catholic", "classification": "3A", "district_id": "3a-val", "strength": 0.85},
        {"school": "Portland Christian", "classification": "2A", "district_id": "2a-mtn", "strength": 0.75},
        {"school": "Riverdale", "classification": "2A", "district_id": "2a-mtn", "strength": 0.80},
        {"school": "St. Mary's Academy", "classification": "6A", "district_id": "PIL", "strength": 1.30},
    ]
    
    for team in misc_teams:
        teams.append({
            "id": generate_random_id(),
            "name": f"{team['school']} Girls",
            "school_name": team['school'],
            "classification": team['classification'],
            "district_id": team['district_id'],
            "strength_index": team['strength']
        })
    
    # Save to file
    data = {
        "districts": districts,
        "teams": teams
    }
    
    with open(output_file, 'w') as f:
        json.dump(data, f, indent=2)
    
    return output_file

def date_range(start_date, end_date):
    """Generate a range of dates"""
    for n in range(int((end_date - start_date).days) + 1):
        yield start_date + timedelta(n)

def log_debug(message: str) -> None:
    """Log a debug message with timestamp"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[DEBUG {timestamp}] {message}")

def parse_date(date_string: str) -> datetime:
    """Parse a date string into a datetime object"""
    try:
        return datetime.strptime(date_string, "%Y-%m-%d")
    except ValueError:
        # Try alternative format
        try:
            return datetime.strptime(date_string, "%m/%d/%Y")
        except ValueError:
            raise ValueError(f"Could not parse date: {date_string}. Use YYYY-MM-DD format.")
