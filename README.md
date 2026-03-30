# SimplexIQ

SimplexIQ is a React + Python (FastAPI) web app for solving Linear Programming problems using the Simplex (Big‑M) method, with step-by-step tableau iterations, sensitivity analysis (shadow prices/slack), templates, and visualizations.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Usage Guide](#usage-guide)
- [Available Scripts](#available-scripts)
- [Configuration and Limits](#configuration-and-limits)
- [Quality and Testing](#quality-and-testing)
- [Troubleshooting](#troubleshooting)
- [Security and Responsible Use](#security-and-responsible-use)
- [Contributing](#contributing)
- [License](#license)
- [Disclaimer](#disclaimer)

## Overview

SimplexIQ is designed for learners, analysts, and practitioners who want an interactive way to solve LP problems and understand the mechanics of simplex optimization.

The app supports:
- Objective function definition (maximize or minimize)
- Dynamic variable and constraint entry
- Constraint types (`<=`, `>=`, `=`)
- Iterative simplex tableau breakdown
- Result interpretation with shadow prices and binding constraints
- Visual analytics and graphical method support for 2-variable problems

## Key Features

1. Interactive Problem Builder
Configure variables, objective coefficients, and constraints in a structured UI.

2. Simplex Solver Engine
Runs simplex logic and computes feasibility/optimality status.

3. Iteration Explorer
Navigate pivot-by-pivot tableau states with entering/leaving variable indicators.

4. Sensitivity Analysis
Review slack values, shadow prices, and binding constraints.

5. Visualization Dashboard
Inspect solution distribution, capacity utilization, and dual-value trends.

6. Built-in Templates
Load preconfigured LP scenarios for quick experimentation.

## How It Works

1. Create or load a problem template.
2. Define objective type and coefficients.
3. Add constraints and right-hand-side values.
4. Run simplex solve.
5. Review results, iterations, and visualizations.

## Tech Stack

- React 19
- Vite 8
- Recharts
- ESLint 9

## Project Structure

```text
frontend/
	src/                    React UI (unchanged)
	public/                 Static assets (favicon, etc.)

backend/
	app.py                  FastAPI app (exposes `/api/solve`)
	simplex_solver.py       Simplex/LPP solver implementation (Python)
	schemas.py              Request/response models
```

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm 9 or later

### Installation

```bash
cd frontend
npm install

cd ../backend
pip install -r requirements.txt
```

### Run in Development

```bash
# Terminal 1 (project root):
python -m uvicorn backend.app:app --host 127.0.0.1 --port 8000

# Terminal 2:
cd frontend
npm run dev
```

Vite will print the local URL (for example: http://localhost:5173 or next available port). The UI calls `http://localhost:8000/api/solve` by default.

### Build for Production

```bash
cd frontend
npm run build
```

### Preview Production Build

```bash
cd frontend
npm run preview
```

## Usage Guide

### Input Section
- Choose objective type (maximize/minimize).
- Set variable and constraint counts.
- Enter objective coefficients and constraint rows.

### Results Section
- View solution status and objective value.
- Inspect variable values and sensitivity table.

### Iterations Section
- Track each simplex iteration.
- Identify entering and leaving variables.

### Visualizations Section
- Compare variable values and resource usage.
- Analyze shadow prices in chart form.

### Templates Section
- Load predefined LP scenarios to test quickly.

## Available Scripts

- `npm run dev` - Start local development server
- `npm run build` - Generate production build
- `npm run preview` - Preview production bundle
- `npm run lint` - Run static lint checks

## Configuration and Limits

Current UI safeguards include:
- Variable count range: 1 to 8
- Constraint count range: 1 to 10

These limits are configurable in input-handling logic if your use case requires higher ranges.

## Quality and Testing

Minimum quality workflow:

```bash
npm run lint
npm run build
```

Recommended additions for production readiness:
- Unit tests for solver edge cases
- Integration tests for UI workflows
- Snapshot tests for key visualization states

## Troubleshooting

1. Port already in use
- Vite automatically switches to another port.
- Open the URL shown in terminal output.

2. Build size warning
- The project may output a chunk size warning during build.
- Consider route-based code splitting if needed.

3. Dependency issues
- Remove `node_modules` and lockfile, then reinstall dependencies.

## Security and Responsible Use

- Do not submit sensitive or confidential optimization data in shared deployments.
- Validate user-provided numeric inputs in any backend-integrated version.
- Apply authentication/authorization before exposing this app in multi-user environments.

## Contributing

Contributions are welcome.

Recommended process:
1. Create a feature branch.
2. Keep changes focused and documented.
3. Run lint and build checks.
4. Submit a pull request with clear context and screenshots (if UI changes).

## License

No license file is currently defined in this repository.

If you plan to distribute this project, add an explicit license file (for example MIT, Apache-2.0, or proprietary terms).

## Disclaimer

SimplexIQ is provided for educational and analytical purposes. Results should be independently validated before use in business-critical or regulatory decision-making contexts.
