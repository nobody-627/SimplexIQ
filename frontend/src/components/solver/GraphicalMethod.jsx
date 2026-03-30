import { CHART_COLORS, T } from "../../constants/theme";
import { fmt } from "../../utils/format";

export default function GraphicalMethod({ problem }) {
  if (problem.numVars !== 2) return null;
  const { constraints, objCoeffs, isMaximize } = problem;

  const maxV =
    Math.max(
      10,
      ...constraints.map((c) => {
        const [a, b] = c.coeffs;
        return Math.max(a > 0 ? c.rhs / a : 0, b > 0 ? c.rhs / b : 0);
      }),
    ) * 1.4;

  const W = 380;
  const H = 280;
  const PX = 46;
  const PY = 30;
  const sx = (x) => PX + (x / maxV) * (W - PX - 20);
  const sy = (y) => H - PY - (y / maxV) * (H - PY - 20);

  const lines = constraints.map(({ coeffs: [a, b], rhs }, i) => {
    const pts = [];
    if (Math.abs(b) > 1e-10) {
      pts.push([0, rhs / b]);
      pts.push([maxV, (rhs - a * maxV) / b]);
    } else if (Math.abs(a) > 1e-10) {
      const x = rhs / a;
      pts.push([x, 0]);
      pts.push([x, maxV]);
    }
    return { pts, color: CHART_COLORS[i] };
  });

  const candidates = [[0, 0]];
  for (const { coeffs: [a, b], rhs } of constraints) {
    if (Math.abs(b) > 1e-10) candidates.push([0, rhs / b]);
    if (Math.abs(a) > 1e-10) candidates.push([rhs / a, 0]);
  }
  for (let i = 0; i < constraints.length; i++) {
    for (let j = i + 1; j < constraints.length; j++) {
      const [a1, b1] = constraints[i].coeffs;
      const r1 = constraints[i].rhs;
      const [a2, b2] = constraints[j].coeffs;
      const r2 = constraints[j].rhs;
      const det = a1 * b2 - a2 * b1;
      if (Math.abs(det) > 1e-10) {
        candidates.push([(r1 * b2 - r2 * b1) / det, (a1 * r2 - a2 * r1) / det]);
      }
    }
  }

  const feasible = candidates.filter(([x, y]) => {
    if (x < -1e-8 || y < -1e-8 || x > maxV * 1.1 || y > maxV * 1.1) return false;
    return constraints.every(({ coeffs: [a, b], type, rhs }) => {
      const val = a * x + b * y;
      return type === "<=" ? val <= rhs + 1e-6 : type === ">=" ? val >= rhs - 1e-6 : Math.abs(val - rhs) <= 1e-6;
    });
  });

  let optPt = null;
  let optVal = isMaximize ? -Infinity : Infinity;
  for (const [x, y] of feasible) {
    const val = objCoeffs[0] * x + objCoeffs[1] * y;
    if ((isMaximize && val > optVal) || (!isMaximize && val < optVal)) {
      optVal = val;
      optPt = [x, y];
    }
  }

  const hull = [...feasible];
  if (hull.length > 2) {
    const cx = hull.reduce((s, [x]) => s + x, 0) / hull.length;
    const cy = hull.reduce((s, [, y]) => s + y, 0) / hull.length;
    hull.sort((a, b) => Math.atan2(a[1] - cy, a[0] - cx) - Math.atan2(b[1] - cy, b[0] - cx));
  }

  return (
    <div style={{ background: T.surface, borderRadius: 10, padding: "1rem", border: `1px solid ${T.border}` }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 10, letterSpacing: "0.06em" }}>
        📐 GRAPHICAL METHOD
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="auto" style={{ display: "block", maxWidth: W, margin: "0 auto" }}>
        {[...Array(5)].map((_, k) => {
          const v = ((k + 1) * maxV) / 5;
          return (
            <g key={k} opacity={0.25}>
              <line x1={sx(0)} y1={sy(v)} x2={sx(maxV)} y2={sy(v)} stroke={T.border} strokeWidth={1} />
              <line x1={sx(v)} y1={sy(0)} x2={sx(v)} y2={sy(maxV)} stroke={T.border} strokeWidth={1} />
            </g>
          );
        })}
        {[...Array(5)].map((_, k) => {
          const v = ((k + 1) * maxV) / 5;
          return (
            <g key={k}>
              <text x={sx(0) - 4} y={sy(v) + 4} fontSize={9} fill={T.textMuted} textAnchor="end" fontFamily="JetBrains Mono">
                {Math.round(v)}
              </text>
              <text x={sx(v)} y={H - PY + 18} fontSize={9} fill={T.textMuted} textAnchor="middle" fontFamily="JetBrains Mono">
                {Math.round(v)}
              </text>
            </g>
          );
        })}

        <line x1={sx(0)} y1={sy(0)} x2={sx(maxV * 0.93)} y2={sy(0)} stroke={T.borderBright} strokeWidth={1.5} />
        <line x1={sx(0)} y1={sy(0)} x2={sx(0)} y2={sy(maxV * 0.93)} stroke={T.borderBright} strokeWidth={1.5} />
        <text x={sx(maxV * 0.93) + 6} y={sy(0) + 4} fontSize={11} fill={T.textMuted} fontWeight={700} fontFamily="JetBrains Mono">
          x₁
        </text>
        <text x={sx(0) - 2} y={sy(maxV * 0.93) - 6} fontSize={11} fill={T.textMuted} fontWeight={700} fontFamily="JetBrains Mono">
          x₂
        </text>

        {hull.length >= 3 && (
          <polygon
            points={hull.map(([x, y]) => `${sx(x)},${sy(y)}`).join(" ")}
            fill={`${T.indigo}22`}
            stroke={`${T.indigo}66`}
            strokeWidth={1}
            strokeDasharray="4,3"
          />
        )}

        {lines.map((l, i) => {
          if (l.pts.length < 2) return null;
          const [[x1, y1], [x2, y2]] = l.pts;
          const cx1 = Math.max(0, Math.min(maxV, x1));
          const cy1 = Math.max(0, Math.min(maxV, y1));
          const cx2 = Math.max(0, Math.min(maxV, x2));
          const cy2 = Math.max(0, Math.min(maxV, y2));
          return (
            <g key={i}>
              <line x1={sx(cx1)} y1={sy(cy1)} x2={sx(cx2)} y2={sy(cy2)} stroke={l.color} strokeWidth={2} />
              <text
                x={(sx(cx1) + sx(cx2)) / 2 + 8}
                y={(sy(cy1) + sy(cy2)) / 2 - 6}
                fontSize={10}
                fill={l.color}
                fontWeight={700}
                fontFamily="JetBrains Mono"
              >
                C{i + 1}
              </text>
            </g>
          );
        })}

        {feasible.map(([x, y], i) => {
          const isOpt = optPt && Math.abs(x - optPt[0]) < 0.01 && Math.abs(y - optPt[1]) < 0.01;
          return (
            <g key={i}>
              <circle
                cx={sx(x)}
                cy={sy(y)}
                r={isOpt ? 8 : 4}
                fill={isOpt ? T.amber : T.borderBright}
                stroke={T.bg}
                strokeWidth={1.5}
              />
              {isOpt && (
                <text x={sx(x) + 12} y={sy(y) + 4} fontSize={10} fill={T.amber} fontWeight={700} fontFamily="JetBrains Mono">
                  ({fmt(x)},{fmt(y)})
                </text>
              )}
            </g>
          );
        })}
      </svg>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 10 }}>
        {constraints.map((c, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: T.textMuted }}>
            <div style={{ width: 16, height: 2, background: CHART_COLORS[i], borderRadius: 1 }} />
            C{i + 1}: {c.label || `Constraint ${i + 1}`}
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: T.amber }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.amber }} />
          Optimal Point
        </div>
      </div>
    </div>
  );
}
