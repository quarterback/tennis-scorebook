
from dataclasses import dataclass, field
from enum import Enum
from typing import List, Dict, Optional, Tuple
import datetime

class Classification(Enum):
    """Oregon high school classifications"""
    SIX_A = "6A"
    FIVE_A = "5A"
    FOUR_A = "4A"
    THREE_A = "3A"
    TWO_A = "2A"
    ONE_A = "1A"

class FlightType(Enum):
    """Types of flights in a tennis match"""
    SINGLES = "singles"
    DOUBLES = "doubles"

class FlightPosition(Enum):
    """Position numbers for flights"""
    FIRST = 1
    SECOND = 2
    THIRD = 3
    FOURTH = 4

@dataclass
class Player:
    """Individual tennis player"""
    id: str
    name: str
    skill_rating: float  # 0.0-10.0 scale
    singles_preference: float = 0.5  # 0.0-1.0 (higher = prefers singles)
    year: str = "12"  # Grade: 9, 10, 11, 12
    
    def __post_init__(self):
        # Ensure skill rating is within bounds
        self.skill_rating = max(0.0, min(10.0, self.skill_rating))
        self.singles_preference = max(0.0, min(1.0, self.singles_preference))

@dataclass
class Team:
    """Tennis team representing a school"""
    id: str
    name: str
    school_name: str
    district: str
    classification: Classification
    strength_index: float = 1.0  # Team strength multiplier
    roster: List[Player] = field(default_factory=list)
    
    # Tracking seasonal performance
    matches_played: int = 0
    wins: int = 0
    losses: int = 0
    ties: int = 0
    
    # APR components
    weighted_score: float = 0.0
    opponent_strength_index: float = 1.0
    
    def win_percentage(self) -> float:
        """Calculate win percentage with ties as half-wins"""
        if self.matches_played == 0:
            return 0.0
        return (self.wins + (self.ties * 0.5)) / self.matches_played
    
    def record_str(self) -> str:
        """Return formatted W-L-T record"""
        return f"{self.wins}-{self.losses}-{self.ties}"
    
    def apr(self) -> float:
        """Calculate final APR score"""
        return self.weighted_score * self.opponent_strength_index

@dataclass
class Flight:
    """Individual flight within a match"""
    flight_type: FlightType
    position: FlightPosition
    home_players: List[str]  # Player IDs
    away_players: List[str]  # Player IDs
    home_score: List[int] = field(default_factory=list)  # Game scores by set
    away_score: List[int] = field(default_factory=list)  # Game scores by set
    winner: Optional[str] = None  # "home" or "away"
    
    def is_singles(self) -> bool:
        return self.flight_type == FlightType.SINGLES
    
    def score_str(self) -> str:
        """Return formatted score string"""
        result = []
        for h, a in zip(self.home_score, self.away_score):
            result.append(f"{h}-{a}")
        return ", ".join(result)
    
    def weight(self) -> float:
        """Return the APR weight for this flight"""
        if self.flight_type == FlightType.SINGLES:
            if self.position == FlightPosition.FIRST:
                return 1.00
            elif self.position == FlightPosition.SECOND:
                return 0.75
            elif self.position == FlightPosition.THIRD:
                return 0.65
        else:  # DOUBLES
            if self.position == FlightPosition.FIRST:
                return 1.00
            elif self.position == FlightPosition.SECOND:
                return 0.50
            elif self.position == FlightPosition.THIRD:
                return 0.25
        return 0.0  # Positions beyond 3rd don't count in APR

@dataclass
class Match:
    """Dual match between two teams"""
    id: str
    date: datetime.date
    home_team_id: str
    away_team_id: str
    flights: List[Flight] = field(default_factory=list)
    is_league_match: bool = True
    is_complete: bool = False
    
    # Derived properties
    home_wins: int = 0
    away_wins: int = 0
    
    def winner_id(self) -> Optional[str]:
        """Return the ID of the winning team, or None for a tie"""
        if not self.is_complete:
            return None
        if self.home_wins > self.away_wins:
            return self.home_team_id
        elif self.away_wins > self.home_wins:
            return self.away_team_id
        return None  # Tie
    
    def is_tie(self) -> bool:
        """Check if the match ended in a tie"""
        return self.is_complete and self.home_wins == self.away_wins
    
    def score_str(self) -> str:
        """Return the match score as a string"""
        return f"{self.home_wins}-{self.away_wins}"

@dataclass
class District:
    """League/district grouping of teams"""
    id: str
    name: str
    classification: Classification
    teams: List[str] = field(default_factory=list)  # Team IDs

@dataclass
class Season:
    """Full tennis season with all matches and teams"""
    teams: Dict[str, Team]  # Team ID -> Team
    districts: Dict[str, District]  # District ID -> District
    matches: List[Match]
    year: int
    
    def matches_for_team(self, team_id: str) -> List[Match]:
        """Get all matches for a specific team"""
        return [m for m in self.matches if 
                (m.home_team_id == team_id or m.away_team_id == team_id) and
                m.is_complete]
    
    def league_matches_for_team(self, team_id: str) -> List[Match]:
        """Get all league matches for a specific team"""
        return [m for m in self.matches_for_team(team_id) if m.is_league_match]
    
    def opponents_for_team(self, team_id: str) -> List[str]:
        """Get all opponent team IDs for a specific team"""
        opponents = []
        for match in self.matches_for_team(team_id):
            opp_id = match.away_team_id if match.home_team_id == team_id else match.home_team_id
            opponents.append(opp_id)
        return opponents
