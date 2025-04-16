# 🟢 Tennis Scorebook
# Oregon High School Tennis Scorebook

This is a modern alternative to TennisReporting built for Oregon high school tennis. It supports dual match recording, player rosters, lineup generation, and team-level ranking based on a custom model optimized for the OSAA's competitive structure.

## 🚧 Features (WIP)

- Full dual match entry system
- Team + player roster management
- League + classification organization
- Automatically calculated **APR Ranking** using the new OSAA Team Tennis Ranking Model
- Handles ties, forfeits, and tournaments
- Integration-ready with a simulation system for model testing (coming soon)

## 📊 Ranking Model Overview

The system uses a custom APR (Adjusted Playoff Ranking) formula:

Where:

- `WS10` = **Weighted Scoring across 5 key flights**
  - 1st Singles Win = 1.00 pts
  - 1st Doubles Win = 1.00 pts
  - 2nd Singles Win = 0.75 pts
  - 2nd Doubles Win = 0.50 pts
  - 3rd Singles Win = 0.40 pts
- `OSI` = **Opponent Strength Index**, based on the average WS10 of opponents played
- Ties count as **half-wins**
- League strength is no longer baked into the formula (removal of LSC for neutrality)

More on the model here: [docs/apr_ranking_model.md](docs/apr_ranking_model.md)

---

## 🛠️ Tech Stack

- Python (ranking engine + simulation)
- GitHub-hosted static site for display (WIP)
- Designed to integrate with future data entry UI or spreadsheet uploads

---

## 📍 Status

Currently in testing. Simulated data is being used to validate the formula and outputs across classifications and leagues.  
Next up:
- Standings UI
- Editable match viewer
- CSV import/export for coaches & media

---

## 📬 Contribute / Watch

This is a personal tool developed to fix a niche-but-infuriating problem. If you're interested in helping, do let me know..but it's mostly a silly thing I'm playing around with. 


---
