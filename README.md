# 🟢 Tennis Scorebook

A modern ranking and scorekeeping system for high school tennis, built to replace the limitations of our existing very bad tennis online scorebook and provide a transparent, flexible model for evaluating team performance in real time modeled for tennis!

---

## 🎯 Purpose

This project began as an experiment to address long-standing frustrations with the current lack of intelligent, explainable tennis rankings in Oregon high school tennis. It now includes:

- A fully defined ranking algorithm designed specifically for dual match play
- A team tennis results entry and standings engine
- A real-time APR (Adjusted Playoff Ranking) calculator based on match quality and opponent strength
- A roadmap toward a full replacement of our current system

---

## 📊 Features

- 🔢 **Custom APR Ranking System**
  - Based on 3 components: Flight-Weighted Score (FWS), Opponent Strength Index (OSI), and WS10 (best 10-match average)
  - Weights meaningful positions (1S, 1D, 2S, 2D, 3S)
  - Cross-classification neutral — no unfair boosts or penalties

- 📒 **Match Data System**
  - Dual match input with full lineup cards
  - Tie support (4–4 matches count as 0.5 wins/losses)
  - Tournaments and doubleheaders supported

- 🧠 **AI-Accelerated Simulation Tools**
  - Realistic match generation for testing and visualization
  - League-wide season modeling
  - APR and OSI auto-calculation from results

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
- CSV import/export for coaches

---

## 📬 Contribute / Watch

This is a personal tool developed to fix a niche-but-infuriating problem. If you're interested in helping, reach out via GitHub or Bluesky.

> 🧠 [@quarterback.bsky.social](https://bsky.app/profile/quarterback.bsky.social)  
> 🧪 Built for Oregon, but adaptable anywhere.

---
