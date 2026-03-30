from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .schemas import ProblemIn
from .simplex_solver import solve_simplex

app = FastAPI(title="SimplexIQ Python Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/solve")
def solve(problem: ProblemIn) -> dict:
    return solve_simplex(problem)

