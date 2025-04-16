
"""
Configuration settings for the tennis simulation
"""

# APR Formula weights for different flight positions
APR_WEIGHTS = {
    "singles": {
        1: 1.00,  # 1st Singles
        2: 0.75,  # 2nd Singles
        3: 0.65,  # 3rd Singles
        4: 0.00,  # Not counted in APR
    },
    "doubles": {
        1: 1.00,  # 1st Doubles
        2: 0.50,  # 2nd Doubles
        3: 0.25,  # 3rd Doubles
        4: 0.00,  # Not counted in APR
    }
}

# Default OSI fallback when teams have played fewer than MIN_MATCHES
DEFAULT_OSI = 0.85

# Minimum matches required for a team's OSI to be included
MIN_MATCHES_FOR_OSI = 6

# Default match configuration
DEFAULT_MATCH_CONFIG = {
    "singles_positions": 4,
    "doubles_positions": 4,
    "sets_per_flight": 2,
    "third_set_tiebreak": True,
    "tiebreak_at": 6,
    "games_to_win_set": 6,
    "min_games_lead": 2,
    "tiebreak_format": "first_to_7",
}

# Season configuration
DEFAULT_SEASON_CONFIG = {
    "matches_per_team": 16,
    "max_matches_per_team": 20,
    "double_round_robin_threshold": 8,  # Teams per district for double round robin
    "league_match_ratio": 0.75,  # Percentage of matches that are league matches
    "min_teams_per_district": 3,  # Minimum teams required for a valid district
}

# Simulation parameters
SIM_PARAMS = {
    "skill_range": (2.0, 10.0),           # Range of base player skills
    "skill_distribution": "normal",       # Distribution type for player skills
    "skill_mean": 5.5,                    # Mean skill level
    "skill_stddev": 1.5,                  # Standard deviation of skill
    "team_strength_range": (0.7, 1.3),    # Range for team strength multipliers
    "home_advantage": 1.1,                # Multiplier for home team advantage
    "upset_factor": 0.15,                 # Randomness in match outcomes (higher = more upsets)
    "players_per_team": 16,               # Average number of players per team
    "roster_variance": 4,                 # Variance in roster size
    "seniors_ratio": 0.35,                # Percentage of seniors on team
    "juniors_ratio": 0.30,                # Percentage of juniors on team
    "sophomores_ratio": 0.25,             # Percentage of sophomores on team
    "freshmen_ratio": 0.10,               # Percentage of freshmen on team
}

# Oregon school classification population thresholds
CLASSIFICATION_THRESHOLDS = {
    "6A": 1130,   # 6A schools have ≥1130 students
    "5A": 700,    # 5A schools have 700-1129 students
    "4A": 350,    # 4A schools have 350-699 students
    "3A": 200,    # 3A schools have 200-349 students
    "2A": 100,    # 2A schools have 100-199 students
    "1A": 0,      # 1A schools have <100 students
}

# Path to data directory
DATA_DIR = "simulator/data"

# Output directory
OUTPUT_DIR = "simulator/output"
