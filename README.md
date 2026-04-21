# Crash HUD 🚀

A real-time Chrome Extension for quantitative analysis of the BC.Game Crash game. It uses a **Mean Reversion Statistical Model** to identify variance in the house's hard-coded algorithm.

## Features
- **Live Interception:** Captures crash data via `MutationObserver` instantly.
- **Dynamic Probability Engine:** Calculates the probability of the next crash exceeding 2x, 3x, and 5x based on historical deviation.
- **Confidence Meter:** Visual cues (Red/Yellow/Green) to indicate when enough data has been gathered for statistical significance.
- **Local persistence:** Data stays in your browser across sessions.

## The Math
The HUD operates on the principle that while each round is cryptographically random, the session must revert to its mathematical mean (99% RTP) over time. 
- **Warm-up Phase:** < 30 rounds (High Variance)
- **Calibrated Phase:** 100+ rounds (Statistical Stability)

## Installation
1. Clone this repo.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable **Developer Mode**.
4. Click **Load Unpacked** and select the folder.

## Disclaimer
This tool is for educational and analytical purposes only. It calculates probabilities based on historical data; it does not guarantee future results. Play responsibly.