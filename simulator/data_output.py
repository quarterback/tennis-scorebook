
"""
Handles data output and visualization
"""
import csv
import os
import json
from typing import Dict, List, Tuple, Any, Optional
from datetime import datetime
from collections import defaultdict
import matplotlib.pyplot as plt
import numpy as np

from models import Team, Season, Match, Flight, Classification
from config import OUTPUT_DIR
from ranking_calculator import calculate_apr_rankings, get_classification_rankings, calculate_state_qualifiers

def ensure_output_dir():
    """Ensure output directory exists"""
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

def export_season_to_csv(season: Season, rankings: List[Tuple[Team, float]]) -> Dict[str, str]:
    """
    Export season data to CSV files
    
    Args:
        season: Completed season
        rankings: Overall rankings
        
    Returns:
        Dictionary of output file paths
    """
    ensure_output_dir()
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    output_files = {}
    
    # Export teams
    teams_file = os.path.join(OUTPUT_DIR, f"teams_{timestamp}.csv")
    with open(teams_file, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow([
            "Team ID", "Team Name", "School", "Classification", "District",
            "Matches Played", "Wins", "Losses", "Ties", "Win %",
            "Weighted Score", "OSI", "APR"
        ])
        
        for team_id, team in season.teams.items():
            if team.matches_played == 0:
                continue
                
            apr = team.weighted_score * team.opponent_strength_index
            win_pct = (team.wins + (team.ties * 0.5)) / team.matches_played if team.matches_played > 0 else 0
            
            writer.writerow([
                team.id,
                team.name,
                team.school_name,
                team.classification.value,
                team.district,
                team.matches_played,
                team.wins,
                team.losses,
                team.ties,
                f"{win_pct:.3f}",
                f"{team.weighted_score:.2f}",
                f"{team.opponent_strength_index:.3f}",
                f"{apr:.2f}"
            ])
    
    output_files["teams"] = teams_file
    
    # Export matches
    matches_file = os.path.join(OUTPUT_DIR, f"matches_{timestamp}.csv")
    with open(matches_file, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow([
            "Match ID", "Date", "Home Team", "Away Team", "Score",
            "League Match", "Winner", "Match Details"
        ])
        
        for match in season.matches:
            if not match.is_complete:
                continue
                
            home_team = season.teams[match.home_team_id].name
            away_team = season.teams[match.away_team_id].name
            
            winner = ""
            if match.home_wins > match.away_wins:
                winner = home_team
            elif match.away_wins > match.home_wins:
                winner = away_team
            else:
                winner = "Tie"
                
            writer.writerow([
                match.id,
                match.date,
                home_team,
                away_team,
                f"{match.home_wins}-{match.away_wins}",
                "Yes" if match.is_league_match else "No",
                winner,
                f"{len(match.flights)} flights"
            ])
    
    output_files["matches"] = matches_file
    
    # Export rankings
    rankings_file = os.path.join(OUTPUT_DIR, f"rankings_{timestamp}.csv")
    with open(rankings_file, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow([
            "Rank", "Team", "School", "Classification", "Record", 
            "WS10", "OSI", "APR"
        ])
        
        for i, (team, apr) in enumerate(rankings, 1):
            writer.writerow([
                i,
                team.name,
                team.school_name,
                team.classification.value,
                f"{team.wins}-{team.losses}-{team.ties}",
                f"{team.weighted_score:.2f}",
                f"{team.opponent_strength_index:.3f}",
                f"{apr:.2f}"
            ])
    
    output_files["rankings"] = rankings_file
    
    # Export state qualifiers
    qualifiers = calculate_state_qualifiers(season, rankings)
    qualifiers_file = os.path.join(OUTPUT_DIR, f"qualifiers_{timestamp}.csv")
    with open(qualifiers_file, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow([
            "Classification", "Seed", "Team", "Record", "APR", "Qualification"
        ])
        
        for classification, qual_list in qualifiers.items():
            class_name = classification.value if hasattr(classification, "value") else "4A/3A/2A/1A"
            
            for i, (team, apr, qual_type) in enumerate(qual_list, 1):
                writer.writerow([
                    class_name,
                    i,
                    team.name,
                    f"{team.wins}-{team.losses}-{team.ties}",
                    f"{apr:.2f}",
                    qual_type
                ])
    
    output_files["qualifiers"] = qualifiers_file
    
    return output_files

def print_league_standings(season: Season) -> None:
    """
    Print league standings organized by district
    
    Args:
        season: Completed season
    """
    print("\n===== LEAGUE STANDINGS =====")
    
    # Group teams by district
    for district_id, district in season.districts.items():
        print(f"\n{district.name} ({district.classification.value}):")
        print("-" * 50)
        
        # Get teams in this district and their league records
        district_teams = []
        for team_id in district.teams:
            team = season.teams[team_id]
            
            # Get league matches
            league_matches = [m for m in season.matches_for_team(team_id) 
                            if m.is_league_match]
            
            league_wins = sum(1 for m in league_matches 
                            if (m.home_team_id == team_id and m.home_wins > m.away_wins) or
                               (m.away_team_id == team_id and m.away_wins > m.home_wins))
                               
            league_losses = sum(1 for m in league_matches 
                              if (m.home_team_id == team_id and m.home_wins < m.away_wins) or
                                 (m.away_team_id == team_id and m.away_wins < m.home_wins))
                                 
            league_ties = sum(1 for m in league_matches 
                            if m.home_wins == m.away_wins)
            
            league_pct = 0.0
            if league_matches:
                league_pct = (league_wins + (league_ties * 0.5)) / len(league_matches)
            
            district_teams.append((
                team,
                league_wins,
                league_losses,
                league_ties,
                league_pct,
                team.weighted_score,
                team.opponent_strength_index
            ))
        
        # Sort by league winning percentage
        district_teams.sort(key=lambda x: x[4], reverse=True)
        
        # Print standings
        print(f"{'Team':<25} {'League':<10} {'Overall':<10} {'WS10':<6} {'OSI':<6} {'APR':<6}")
        for team, l_wins, l_losses, l_ties, l_pct, ws10, osi in district_teams:
            league_record = f"{l_wins}-{l_losses}-{l_ties}"
            overall_record = f"{team.wins}-{team.losses}-{team.ties}"
            apr = ws10 * osi
            
            print(f"{team.name:<25} {league_record:<10} {overall_record:<10} " +
                  f"{ws10:<6.2f} {osi:<6.2f} {apr:<6.2f}")

def print_apr_rankings(rankings: List[Tuple[Team, float]], top_n: int = 20) -> None:
    """
    Print overall APR rankings
    
    Args:
        rankings: List of (team, apr) tuples sorted by APR
        top_n: Number of teams to display
    """
    print(f"\n===== TOP {top_n} OVERALL APR RANKINGS =====")
    print(f"{'Rank':<5} {'Team':<25} {'Class':<5} {'Record':<10} {'WS10':<6} {'OSI':<6} {'APR':<6}")
    print("-" * 70)
    
    for i, (team, apr) in enumerate(rankings[:top_n], 1):
        record = f"{team.wins}-{team.losses}-{team.ties}"
        print(f"{i:<5} {team.name:<25} {team.classification.value:<5} {record:<10} " +
              f"{team.weighted_score:<6.2f} {team.opponent_strength_index:<6.2f} {apr:<6.2f}")

def print_classification_rankings(
    season: Season,
    rankings: List[Tuple[Team, float]],
    classification: Optional[Classification] = None,
    top_n: int = 10
) -> None:
    """
    Print APR rankings for a specific classification
    
    Args:
        season: Completed season
        rankings: Overall rankings
        classification: Classification to filter by (None for all)
        top_n: Number of teams to display
    """
    # Group by classification if None specified
    if classification is None:
        # Get unique classifications
        classifications = set(team.classification for team, _ in rankings)
        
        # Print rankings for each classification
        for cls in classifications:
            cls_rankings = [(team, apr) for team, apr in rankings if team.classification == cls]
            print_classification_rankings(season, cls_rankings, cls, top_n)
        return
    
    # Classification-specific rankings
    print(f"\n===== TOP {top_n} {classification.value} APR RANKINGS =====")
    print(f"{'Rank':<5} {'Team':<25} {'Record':<10} {'WS10':<6} {'OSI':<6} {'APR':<6}")
    print("-" * 70)
    
    for i, (team, apr) in enumerate(rankings[:top_n], 1):
        record = f"{team.wins}-{team.losses}-{team.ties}"
        print(f"{i:<5} {team.name:<25} {record:<10} " +
              f"{team.weighted_score:<6.2f} {team.opponent_strength_index:<6.2f} {apr:<6.2f}")

def print_state_qualifiers(
    season: Season,
    rankings: List[Tuple[Team, float]]
) -> None:
    """
    Print predicted state tournament qualifiers
    
    Args:
        season: Completed season
        rankings: Overall rankings
    """
    qualifiers = calculate_state_qualifiers(season, rankings)
    
    print("\n===== STATE TOURNAMENT QUALIFIERS =====")
    
    for classification, qual_list in qualifiers.items():
        class_name = classification.value if hasattr(classification, "value") else "4A/3A/2A/1A"
        print(f"\n{class_name} STATE QUALIFIERS:")
        print("-" * 70)
        print(f"{'Seed':<5} {'Team':<25} {'Record':<10} {'APR':<6} {'Qualification':<15}")
        
        for i, (team, apr, qual_type) in enumerate(qual_list, 1):
            record = f"{team.wins}-{team.losses}-{team.ties}"
            print(f"{i:<5} {team.name:<25} {record:<10} {apr:<6.2f} {qual_type:<15}")

def plot_apr_distribution(rankings: List[Tuple[Team, float]], output_file: Optional[str] = None) -> None:
    """
    Plot the distribution of APR scores
    
    Args:
        rankings: Overall rankings
        output_file: Optional file path to save the plot
    """
    ensure_output_dir()
    
    apr_values = [apr for _, apr in rankings]
    
    plt.figure(figsize=(10, 6))
    plt.hist(apr_values, bins=20, alpha=0.7, color='blue')
    plt.xlabel('APR Score')
    plt.ylabel('Number of Teams')
    plt.title('Distribution of APR Scores')
    plt.grid(True, alpha=0.3)
    
    if output_file:
        plt.savefig(output_file)
    else:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        plt.savefig(os.path.join(OUTPUT_DIR, f"apr_distribution_{timestamp}.png"))
    
    plt.close()

def plot_component_correlation(rankings: List[Tuple[Team, float]], output_file: Optional[str] = None) -> None:
    """
    Plot correlation between WS10 and OSI components
    
    Args:
        rankings: Overall rankings
        output_file: Optional file path to save the plot
    """
    ensure_output_dir()
    
    ws10_values = [team.weighted_score for team, _ in rankings]
    osi_values = [team.opponent_strength_index for team, _ in rankings]
    apr_values = [apr for _, apr in rankings]
    
    plt.figure(figsize=(10, 6))
    plt.scatter(ws10_values, osi_values, c=apr_values, cmap='viridis', alpha=0.7)
    plt.colorbar(label='APR Score')
    plt.xlabel('Weighted Score (WS10)')
    plt.ylabel('Opponent Strength Index (OSI)')
    plt.title('Correlation between WS10 and OSI')
    plt.grid(True, alpha=0.3)
    
    if output_file:
        plt.savefig(output_file)
    else:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        plt.savefig(os.path.join(OUTPUT_DIR, f"component_correlation_{timestamp}.png"))
    
    plt.close()

def generate_team_schedule_report(season: Season, team_id: str) -> None:
    """
    Generate a detailed schedule report for a specific team
    
    Args:
        season: Completed season
        team_id: ID of the team to report on
    """
    team = season.teams.get(team_id)
    if not team:
        print(f"Team ID {team_id} not found")
        return
    
    matches = season.matches_for_team(team_id)
    
    print(f"\n===== SCHEDULE REPORT: {team.name} ({team.classification.value}) =====")
    print(f"Record: {team.wins}-{team.losses}-{team.ties}")
    print(f"APR Components: WS10={team.weighted_score:.2f}, OSI={team.opponent_strength_index:.3f}")
    print(f"APR Score: {team.weighted_score * team.opponent_strength_index:.2f}")
    print("\nMATCH RESULTS:")
    print("-" * 70)
    
    for match in sorted(matches, key=lambda m: m.date):
        is_home = match.home_team_id == team_id
        opponent_id = match.away_team_id if is_home else match.home_team_id
        opponent = season.teams[opponent_id]
        
        # Determine result
        if is_home:
            team_score = match.home_wins
            opp_score = match.away_wins
            result = "W" if team_score > opp_score else "L" if team_score < opp_score else "T"
        else:
            team_score = match.away_wins
            opp_score = match.home_wins
            result = "W" if team_score > opp_score else "L" if team_score < opp_score else "T"
            
        match_type = "League" if match.is_league_match else "Non-League"
        
        print(f"{match.date}: {result} vs {opponent.name} {team_score}-{opp_score} ({match_type})")
        
        # Print flight details
        flight_results = []
        for flight in match.flights:
            flight_type = "S" if flight.flight_type.value == "singles" else "D"
            position = flight.position.value
            team_won = (is_home and flight.winner == "home") or (not is_home and flight.winner == "away")
            
            result_str = f"{flight_type}{position}: {'W' if team_won else 'L'}"
            
            # Add score details
            score_str = []
            for i in range(len(flight.home_score)):
                if is_home:
                    set_score = f"{flight.home_score[i]}-{flight.away_score[i]}"
                else:
                    set_score = f"{flight.away_score[i]}-{flight.home_score[i]}"
                score_str.append(set_score)
            
            result_str += f" ({', '.join(score_str)})"
            flight_results.append(result_str)
        
        print("  " + " | ".join(flight_results))
        print("-" * 70)
