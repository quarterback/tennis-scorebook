
# Tennis APR Ranking Simulator

This simulator creates realistic Oregon high school tennis seasons to test the Adjusted Playoff Ranking (APR) system.

## Purpose

- Generate full tennis dual match seasons with realistic results
- Calculate and test the APR ranking system across different scenarios
- Evaluate flight-level outcomes and team performance metrics
- Compare ranking outcomes with expected results

## Usage

```bash
# Run a basic simulation with default settings
python simulator/main.py

# Run with custom team input file
python simulator/main.py --teams teams_custom.json

# Export results to CSV
python simulator/main.py --export

# Run with specific season parameters
python simulator/main.py --matches 16 --strength-variance 0.15
```

## Files

- `main.py` - Main entry point for running simulations
- `team_generator.py` - Creates team objects with roster/lineup generation
- `match_simulator.py` - Simulates individual matches between teams
- `season_generator.py` - Creates full season schedules and runs match simulations
- `ranking_calculator.py` - Implements the APR ranking formula
- `data_output.py` - Handles data export and visualization
- `models.py` - Data classes/models for simulation entities
- `config.py` - Configuration settings
- `utils.py` - Utility functions
