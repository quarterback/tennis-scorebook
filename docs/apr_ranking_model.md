
# 🧮 Flighted Team Tennis Ranking Model (APR System)
  
Designed by Ron Bronson

This document outlines the custom **Adjusted Playoff Ranking (APR)** system designed for Oregon high school tennis, but could be modified for any format of HS or even collegiate tennis. It is intended to support fair and competitive **team-based rankings** that account for match difficulty, team depth, and league parity—while avoiding the flaws of traditional win-loss or TRPR systems.

---

## 🧷 Summary

This APR model:
- Allows **cross-classification matches** without penalty
- Rewards **competitive scheduling and key flight wins**
- Includes **ties as partial wins** to reflect match closeness
- Uses **Opponent Strength Index (OSI)** to simulate strength of schedule
- Replaces **League Strength Coefficient (LSC)** with improved balance
- Prioritizes real-world accuracy over easily gamed metrics

---

## 🧮 Formula

```txt
APR = WS10 × OSI
```

Where:

- `WS10` = Weighted Score from the top 5 flights:
  - 1st Singles (1S) = 1.00
  - 1st Doubles (1D) = 1.00
  - 2nd Singles (2S) = 0.75
  - 2nd Doubles (2D) = 0.50
  - 3rd Singles (3S) = 0.40  
- `OSI` = Opponent Strength Index, calculated as average of opponents' WS10 values scaled to a neutral baseline (≈0.90 median)

---

## 📊 Components

### 🎾 WS10 (Weighted Score – Top 5 Flights)
Teams earn points in each dual based on wins in the top 5 flights. Other matches (e.g., 4S, 3D, etc.) contribute to the dual result but are not counted in the APR formula.

**Example:**
A team wins:
- 1S, 1D, 3S → 2.4 WS10 points for that dual

---

### 📈 OSI (Opponent Strength Index)
A team’s OSI is calculated from the **average WS10 scores of their opponents**, reflecting the difficulty of their schedule.  
- Teams that play strong teams get rewarded, regardless of match outcome.
- Opponent scores are only included **once the opponent has played at least 6 matches**.

---

### ➗ Ties
In 4-4 ties:
- Teams are credited with **0.5 win and 0.5 loss** in APR-calculated records.
- No tiebreaker (e.g., sets/games) is used in rankings.

---

## 🏆 APR Rankings & Playoffs

- Rankings update weekly once teams have at least **6 recorded matches**.
- The top teams in each classification are seeded using APR.
- **League champions qualify automatically** for state regardless of APR.
- At-large teams are selected based on top remaining APR scores.

---

## 🧪 Simulation Tool (Coming Soon)
We are building a companion simulation engine to generate:
- Full match results
- Realistic league standings
- APR-based rankings per classification
- Stress tests for edge cases

---

## 📁 How to Use This Model
1. Log dual matches in your scoring system (with flights recorded)
2. Aggregate WS10 values per team
3. Calculate OSI using opponent WS10 scores (6+ matches only)
4. Multiply WS10 × OSI → get APR
5. Rank teams by APR for seeding & at-large bids

---

About me: For years, I ran a college football computer ranking called Omnivore Rankings that sought to ID the best non-major conference team for the national title. I stopped doing that in 2011 after doing it for about 6 years. So computer rankings are kind of fun for me, doing this for HS tennis will be a great way to pick non-conference teams and rank teams across the state.  
