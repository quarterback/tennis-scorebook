
#!/usr/bin/env python3
"""
Main entry point for the Oregon High School Tennis Simulator
"""
import argparse
import sys
from datetime import datetime
import os
import json
from typing import Dict, List, Optional

from team_generator import initialize_teams
from season_generator import generate_season, simulate_season
from ranking_calculator import calculate_apr_rankings, get_classification_rankings
from data_output import (
    print_league_standings, 
    print_apr_rankings, 
    print_classification_rankings,
    print_state_qualifiers,
    export_season_to_csv,
    plot_apr_distribution,
    plot_component_correlation,
    generate_team_schedule_report
)
from utils import create_sample_teams_data, parse_date
from models import Classification
from config import DEFAULT_SEASON_CONFIG

def parse_arguments():
    """Parse command line arguments"""
    parser = argparse.ArgumentParser(description="Oregon High School Tennis APR Simulator")
    
    # Input/output options
    parser.add_argument("--teams", type=str, help="Path to teams JSON file")
    parser.add_argument("--output", type=str, help="Output directory for results")
    parser.add_argument("--export", action="store_true", help="Export results to CSV files")
    
    # Season configuration
    parser.add_argument("--start-date", type=str, default="2023-03-01", 
                       help="Season start date (YYYY-MM-DD)")
    parser.add_argument("--end-date", type=str, default="2023-05-15", 
                       help="Season end date (YYYY-MM-DD)")
    parser.add_argument("--matches", type=int, 
                       help=f"Matches per team (default: {DEFAULT_SEASON_CONFIG['matches_per_team']})")
    parser.add_argument("--max-matches", type=int,
                       help=f"Maximum matches per team (default: {DEFAULT_SEASON_CONFIG['max_matches_per_team']})")
    
    # Simulation parameters
    parser.add_argument("--strength-variance", type=float, default=0.15,
                       help="Variance in team strength (0.0-1.0)")
    parser.add_argument("--upset-factor", type=float, default=0.15,
                       help="Randomness in match outcomes (0.0-1.0)")
    parser.add_argument("--seed", type=int, help="Random seed for reproducibility")
    
    # Display options
    parser.add_argument("--top", type=int, default=20,
                       help="Number of top teams to display in rankings")
    parser.add_argument("--team", type=str,
                       help="Show detailed report for specific team ID")
    parser.add_argument("--visualize", action="store_true",
                       help="Generate visualization charts")
    parser.add_argument("--create-sample", action="store_true",
                       help="Create a sample teams.json file and exit")
    
    args = parser.parse_args()
    return args

def main():
    """Run the simulation"""
    args = parse_arguments()
    
    # Create sample teams file if requested
    if args.create_sample:
        teams_file = create_sample_teams_data()
        print(f"Created sample teams file: {teams_file}")
        return 0
    
    # Set random seed if provided
    if args.seed is not None:
        import random
        import numpy as np
        random.seed(args.seed)
        np.random.seed(args.seed)
        print(f"Using random seed: {args.seed}")
    
    # Parse dates
    try:
        start_date = parse_date(args.start_date)
        end_date = parse_date(args.end_date)
        
        if end_date <= start_date:
            print("Error: End date must be after start date")
            return 1
    except ValueError as e:
        print(f"Error parsing dates: {e}")
        return 1
    
    # Load teams
    try:
        teams, districts = initialize_teams(args.teams)
        team_count = len(teams)
        district_count = len(districts)
        print(f"Loaded {team_count} teams in {district_count} districts")
    except Exception as e:
        print(f"Error loading teams: {e}")
        return 1
    
    # Configure season
    season_config = DEFAULT_SEASON_CONFIG.copy()
    if args.matches:
        season_config["matches_per_team"] = args.matches
    if args.max_matches:
        season_config["max_matches_per_team"] = args.max_matches
    
    print(f"\nSimulating season ({start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')})")
    print(f"Teams will play approximately {season_config['matches_per_team']} matches each")
    
    # Generate and simulate season
    try:
        season = generate_season(teams, districts, start_date, end_date, season_config)
        print(f"Generated {len(season.matches)} total matches")
        
        print("Simulating matches...")
        simulate_season(season)
        print("Simulation complete!")
        
        # Calculate rankings
        rankings = calculate_apr_rankings(season)
        
        # Display results
        print_league_standings(season)
        print_apr_rankings(rankings, args.top)
        
        # Print classification rankings
        print_classification_rankings(season, rankings)
        
        # Print state qualifiers
        print_state_qualifiers(season, rankings)
        
        # Generate team report if requested
        if args.team:
            generate_team_schedule_report(season, args.team)
        
        # Export data if requested
        if args.export:
            output_files = export_season_to_csv(season, rankings)
            print("\nExported data to:")
            for file_type, path in output_files.items():
                print(f"  {file_type}: {path}")
        
        # Generate visualizations if requested
        if args.visualize:
            plot_apr_distribution(rankings)
            plot_component_correlation(rankings)
            print("\nGenerated visualization charts in output directory")
        
        return 0
    except Exception as e:
        import traceback
        print(f"Error during simulation: {e}")
        traceback.print_exc()
        return 1

if __name__ == "__main__":
    sys.exit(main())
