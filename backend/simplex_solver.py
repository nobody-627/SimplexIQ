from __future__ import annotations

from typing import Any, Dict, List, Optional

from .schemas import ProblemIn


def solve_simplex(problem: ProblemIn) -> Dict[str, Any]:
    """
    Port of the existing front-end `solveSimplex(problem)` implementation.
    The output contract is intentionally kept identical so the UI can stay unchanged.
    """

    n = problem.numVars
    objCoeffs = list(problem.objCoeffs)
    constraints = list(problem.constraints)
    isMaximize = problem.isMaximize

    m = len(constraints)
    BIG_M = 1e7
    EPS = 1e-9

    preCons: List[Dict[str, Any]] = []
    for c in constraints:
        rhs = c.rhs if c.rhs is not None else 0.0
        if rhs >= 0:
            preCons.append({"type": c.type, "coeffs": list(c.coeffs), "rhs": rhs})
            continue

        flip = {"<=": ">=", ">=": "<=", "=": "="}
        preCons.append(
            {
                "type": flip[c.type],
                "coeffs": [v * -1 for v in c.coeffs],
                "rhs": -rhs,
            }
        )

    c = list(objCoeffs) if isMaximize else [v * -1 for v in objCoeffs]

    vars_list: List[Dict[str, Any]] = [{"name": f"x{i + 1}", "type": "original"} for i in range(n)]

    slackOf: List[int] = [-1 for _ in range(m)]
    artOf: List[int] = [-1 for _ in range(m)]
    vi = n

    for i in range(m):
        t = preCons[i]["type"]
        if t == "<=":
            slackOf[i] = vi
            vi += 1
            vars_list.append({"name": f"s{i + 1}", "type": "slack"})
        elif t == ">=":
            slackOf[i] = vi
            vi += 1
            vars_list.append({"name": f"e{i + 1}", "type": "surplus"})
            artOf[i] = vi
            vi += 1
            vars_list.append({"name": f"a{i + 1}", "type": "artificial"})
        else:
            artOf[i] = vi
            vi += 1
            vars_list.append({"name": f"a{i + 1}", "type": "artificial"})

    TV = vi
    tab: List[List[float]] = [[0.0 for _ in range(TV + 1)] for _ in range(m + 1)]
    basis: List[int] = [-1 for _ in range(m)]

    for i in range(m):
        # Constraint coefficients
        for j in range(n):
            tab[i][j] = preCons[i]["coeffs"][j] if j < len(preCons[i]["coeffs"]) else 0.0

        if slackOf[i] >= 0:
            tab[i][slackOf[i]] = -1.0 if preCons[i]["type"] == ">=" else 1.0

        if artOf[i] >= 0:
            tab[i][artOf[i]] = 1.0
            basis[i] = artOf[i]
        else:
            basis[i] = slackOf[i]

        tab[i][TV] = preCons[i]["rhs"] if preCons[i]["rhs"] is not None else 0.0

    # Objective row initialization
    for j in range(n):
        tab[m][j] = -c[j]
    for i in range(m):
        if artOf[i] >= 0:
            tab[m][artOf[i]] = float(BIG_M)

    # Big-M adjustments
    for i in range(m):
        if artOf[i] >= 0:
            for j in range(TV + 1):
                tab[m][j] -= BIG_M * tab[i][j]

    iterations: List[Dict[str, Any]] = []
    status = "solving"

    def snap(eCol: int, lRow: int, note: str) -> None:
        iterations.append(
            {
                "tab": [list(r) for r in tab],
                "basis": list(basis),
                "vars": [dict(v) for v in vars_list],
                "eCol": eCol,
                "lRow": lRow,
                "note": note,
                "TV": TV,
                "n": n,
                "m": m,
            }
        )

    snap(-1, -1, "📋 Initial Tableau — Big-M method applied")

    for it in range(200):
        if status != "solving":
            break

        eCol = -1
        mv = -EPS

        # Entering variable: most negative reduced cost
        for j in range(TV):
            if tab[m][j] < mv:
                mv = tab[m][j]
                eCol = j

        if eCol < 0:
            status = "optimal"
            break

        # Leaving variable: ratio test
        lRow = -1
        mr = float("inf")
        for i in range(m):
            if tab[i][eCol] > EPS:
                r = tab[i][TV] / tab[i][eCol]
                if r < (mr - EPS):
                    mr = r
                    lRow = i

        if lRow < 0:
            status = "unbounded"
            snap(eCol, -1, "⚠ Unbounded — no leaving variable (ratio test failed)")
            break

        snap(eCol, lRow, f"🔄 Iteration {it + 1}: {vars_list[eCol]['name']} enters ↑,  {vars_list[basis[lRow]]['name']} leaves ↓")

        basis[lRow] = eCol
        pe = tab[lRow][eCol]

        # Pivot normalization
        for j in range(TV + 1):
            tab[lRow][j] /= pe

        # Pivot elimination
        for i in range(m + 1):
            if i != lRow and abs(tab[i][eCol]) > EPS:
                f = tab[i][eCol]
                for j in range(TV + 1):
                    tab[i][j] -= f * tab[lRow][j]

    if status == "solving":
        status = "optimal"

    # Infeasibility check for Big-M artificial variables
    # Match JS logic: if the basis var in row `i` is an artificial var (exists in `artOf`)
    # and the RHS is still > EPS, the model is infeasible.
    for i in range(m):
        if basis[i] in artOf and tab[i][TV] > EPS:
            status = "infeasible"
            break

    snap(-1, -1, "✅ Optimal solution found" if status == "optimal" else f"❌ {status.upper()}")

    solution = [0.0 for _ in range(n)]
    for i in range(m):
        if basis[i] < n:
            solution[basis[i]] = max(0.0, tab[i][TV])

    objVal = tab[m][TV] if isMaximize else -tab[m][TV]

    # Shadow prices and slack values
    shadowPrices: List[Dict[str, Any]] = []
    for i in range(m):
        si = slackOf[i]
        raw: Optional[float] = tab[m][si] if si >= 0 else None

        if raw is not None:
            price = raw if isMaximize else -raw
        else:
            price = None

        if si >= 0:
            try:
                bi = basis.index(si)
            except ValueError:
                bi = -1

            slackVal = max(0.0, tab[bi][TV]) if bi >= 0 else 0.0

            if bi < 0:
                binding = True
            else:
                binding = tab[bi][TV] < EPS
        else:
            slackVal = 0.0
            binding = True

        shadowPrices.append(
            {
                "index": i,
                "type": preCons[i]["type"],
                "price": price,
                "slackVal": slackVal,
                "binding": binding,
            }
        )

    # Utilization rows
    utilization: List[Dict[str, Any]] = []
    preCons_raw = preCons  # naming for parity with JS mental model
    for i, con in enumerate(preCons_raw):
        used = 0.0
        for j, a in enumerate(con["coeffs"]):
            used += a * (solution[j] if j < len(solution) else 0.0)
        limit = con["rhs"] if con["rhs"] is not None else 0.0
        pct = (min(100.0, (used / limit) * 100.0) if limit > 0 else 0.0) if limit is not None else 0.0
        utilization.append(
            {
                "constraint": i,
                "used": used,
                "limit": limit,
                "pct": pct,
                "surplus": max(0.0, limit - used),
            }
        )

    return {
        "status": status,
        "solution": solution,
        "objVal": float(objVal),
        "iterations": iterations,
        "shadowPrices": shadowPrices,
        "utilization": utilization,
        "vars": vars_list,
        "slackOf": slackOf,
        "artOf": artOf,
        "TV": TV,
        "n": n,
        "m": m,
        "basis": list(basis),
        "finalTab": [list(r) for r in tab],
    }

