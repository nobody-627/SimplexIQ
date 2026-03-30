from __future__ import annotations

from typing import Any, List, Literal, Optional

from pydantic import BaseModel, Field


ConstraintType = Literal["<=", ">=", "="]


class ConstraintIn(BaseModel):
    coeffs: List[float] = Field(default_factory=list)
    type: ConstraintType
    rhs: float = 0.0
    label: Optional[str] = None


class ProblemIn(BaseModel):
    numVars: int
    numConstraints: Optional[int] = None
    isMaximize: bool
    objCoeffs: List[float] = Field(default_factory=list)
    varLabels: Optional[List[str]] = None
    constraints: List[ConstraintIn] = Field(default_factory=list)


class SolveResult(BaseModel):
    status: str
    solution: List[float]
    objVal: float
    iterations: List[dict[str, Any]]
    shadowPrices: List[dict[str, Any]]
    utilization: List[dict[str, Any]]
    vars: List[dict[str, Any]]
    slackOf: List[int]
    artOf: List[int]
    TV: int
    n: int
    m: int
    basis: List[int]
    finalTab: List[List[float]]


