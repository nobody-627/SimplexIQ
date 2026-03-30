import { useMemo } from "react";
import { statusMeta, T } from "../constants/theme";
import { fmt } from "../utils/format";
import { Badge, Card, SectionTitle } from "../components/common/UIPrimitives";

export default function ResultsSection({ result, problem }) {
  const { status, solution, objVal, shadowPrices } = result;
  const meta = statusMeta[status] || statusMeta.optimal;

  const explanationLines = useMemo(() => {
    if (status !== "optimal") return [];
    const varLabels = problem.varLabels || solution.map((_, i) => `x${i + 1}`);
    const lines = [];
    lines.push(`The ${problem.isMaximize ? "maximum" : "minimum"} value of z is ${fmt(objVal)}, achieved at:`);
    solution.forEach((v, i) => {
      if (v > 1e-9) lines.push(`  • ${varLabels[i]}: ${fmt(v)}`);
    });
    const binding = shadowPrices.filter((s) => s.binding && s.type === "<=");
    if (binding.length > 0) {
      lines.push(
        `Binding constraints: ${binding.map((s) => problem.constraints[s.index]?.label || `C${s.index + 1}`).join(", ")} — these limit the optimal further.`,
      );
    }
    const highShadow = shadowPrices
      .filter((s) => s.price !== null && Math.abs(s.price) > 1e-9)
      .sort((a, b) => Math.abs(b.price) - Math.abs(a.price));
    if (highShadow.length > 0) {
      lines.push(
        `Most valuable constraint: "${problem.constraints[highShadow[0].index]?.label || `C${highShadow[0].index + 1}`}" — relaxing it by 1 unit changes z by ${fmt(highShadow[0].price)}.`,
      );
    }
    return lines;
  }, [objVal, problem, shadowPrices, solution, status]);

  return (
    <div className="fade-in">
      <SectionTitle icon="📊" title="Optimal Solution" sub="Simplex method results and sensitivity analysis." />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12, marginBottom: 16 }}>
        <Card style={{ background: meta.bg, border: `1px solid ${meta.color}44` }}>
          <div style={{ fontSize: 11, color: meta.color, fontWeight: 600, marginBottom: 8, letterSpacing: "0.08em" }}>STATUS</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: `${meta.color}22`,
                border: `1.5px solid ${meta.color}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                color: meta.color,
              }}
            >
              {meta.icon}
            </div>
            <span className="mono" style={{ fontSize: 22, fontWeight: 700, color: meta.color }}>
              {meta.label}
            </span>
          </div>
        </Card>
        <Card>
          <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 600, marginBottom: 8, letterSpacing: "0.08em" }}>
            {problem.isMaximize ? "MAXIMUM" : "MINIMUM"} VALUE
          </div>
          <div className="mono" style={{ fontSize: 32, fontWeight: 700, color: T.amber }}>
            {status === "optimal" ? fmt(objVal) : "—"}
          </div>
          <div style={{ fontSize: 12, color: T.textMuted, marginTop: 4 }}>z*</div>
        </Card>
      </div>

      {status === "optimal" && (
        <Card style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 600, marginBottom: 12, letterSpacing: "0.06em" }}>OPTIMAL VARIABLE VALUES</div>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(solution.length, 4)}, 1fr)`, gap: 10 }}>
            {solution.map((v, i) => (
              <div
                key={i}
                style={{ background: T.surface, borderRadius: 10, padding: "12px 14px", border: `1px solid ${T.border}`, textAlign: "center" }}
              >
                <div className="mono" style={{ fontSize: 11, color: T.indigoLight, marginBottom: 6, fontWeight: 600 }}>
                  x{i + 1}
                </div>
                {problem.varLabels?.[i] && <div style={{ fontSize: 10, color: T.textMuted, marginBottom: 6 }}>{problem.varLabels[i]}</div>}
                <div className="mono" style={{ fontSize: 24, fontWeight: 700, color: v > 1e-9 ? T.text : T.textFaint }}>
                  {fmt(v)}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 600, marginBottom: 12, letterSpacing: "0.06em" }}>
          SENSITIVITY ANALYSIS — SHADOW PRICES
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>
                {["Constraint", "Type", "RHS", "Used", "Slack", "Shadow Price", "Binding"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "6px 12px",
                      textAlign: "left",
                      borderBottom: `1px solid ${T.border}`,
                      color: T.textMuted,
                      fontWeight: 600,
                      fontSize: 11,
                      letterSpacing: "0.05em",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {problem.constraints.map((con, i) => {
                const sp = shadowPrices[i];
                const util = result.utilization[i];
                return (
                  <tr key={i} style={{ borderBottom: `1px solid ${T.border}22` }}>
                    <td style={{ padding: "8px 12px", color: T.text, fontWeight: 500 }}>{con.label || `C${i + 1}`}</td>
                    <td style={{ padding: "8px 12px" }}>
                      <Badge label={con.type} color={T.cyan} />
                    </td>
                    <td className="mono" style={{ padding: "8px 12px", color: T.amber }}>
                      {fmt(con.rhs)}
                    </td>
                    <td className="mono" style={{ padding: "8px 12px", color: T.text }}>
                      {fmt(util?.used ?? 0)}
                    </td>
                    <td className="mono" style={{ padding: "8px 12px", color: sp?.slackVal > 1e-9 ? T.emerald : T.rose }}>
                      {fmt(sp?.slackVal ?? 0)}
                    </td>
                    <td className="mono" style={{ padding: "8px 12px", color: sp?.price !== null && sp?.price > 1e-9 ? T.indigo : T.textMuted, fontWeight: 600 }}>
                      {sp?.price !== null ? fmt(sp.price) : "N/A"}
                    </td>
                    <td style={{ padding: "8px 12px" }}>
                      <Badge label={sp?.binding ? "YES" : "NO"} color={sp?.binding ? T.rose : T.emerald} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div
          style={{
            marginTop: 12,
            padding: "10px 14px",
            background: T.surface,
            borderRadius: 8,
            border: `1px solid ${T.border}`,
            fontSize: 12,
            color: T.textMuted,
            lineHeight: 1.6,
          }}
        >
          <strong style={{ color: T.text }}>Shadow Price:</strong> How much the objective z improves per unit increase in that
          constraint&apos;s RHS. A binding constraint (Slack = 0) limits the optimum.
        </div>
      </Card>

      {explanationLines.length > 0 && (
        <Card style={{ borderColor: `${T.indigo}44`, background: "#f4f5ff" }}>
          <div style={{ fontSize: 11, color: T.indigoLight, fontWeight: 600, marginBottom: 10, letterSpacing: "0.06em" }}>
            💡 SOLUTION INTERPRETATION
          </div>
          {explanationLines.map((l, i) => (
            <p key={i} style={{ margin: "4px 0", fontSize: 13, color: i === 0 ? T.text : T.textMuted, paddingLeft: l.startsWith("  •") ? 8 : 0 }}>
              {l}
            </p>
          ))}
        </Card>
      )}
    </div>
  );
}
