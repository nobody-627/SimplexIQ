import { CHART_COLORS, T } from "../constant/theme";
import { TEMPLATES } from "../data/templets";
import { Badge, Card, SectionTitle } from "../components/common/UIPrimitives";

export default function TemplatesSection({ onLoad }) {
  return (
    <div className="fade-in">
      <SectionTitle
        icon="📋"
        title="Problem Templates"
        sub="Pre-built real-world LP problems. Click Load to populate the input form."
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
        {TEMPLATES.map((t, i) => (
          <Card key={i} style={{ cursor: "pointer", transition: "border-color .15s" }} className="template-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div>
                <span style={{ fontSize: 24, display: "block", marginBottom: 6 }}>{t.icon}</span>
                <Badge label={t.tag} color={CHART_COLORS[i]} />
              </div>
              <button
                onClick={() => onLoad(t)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  background: `${T.indigo}22`,
                  color: T.indigoLight,
                  border: `1px solid ${T.indigo}44`,
                  cursor: "pointer",
                }}
              >
                Load →
              </button>
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: T.text, marginBottom: 6 }}>{t.name}</div>
            <div style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.5 }}>{t.desc}</div>
            <div style={{ marginTop: 12, padding: "8px 10px", background: T.surface, borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 6, fontWeight: 600 }}>{t.problem.isMaximize ? "MAX" : "MIN"} z =</div>
              <div className="mono" style={{ fontSize: 12, color: T.indigoLight }}>
                {t.problem.objCoeffs.map((c, j) => `${j > 0 ? "+" : ""}${c}x${j + 1}`).join(" ")}
              </div>
              <div style={{ fontSize: 11, color: T.textMuted, marginTop: 6 }}>
                {t.problem.constraints.length} constraint{t.problem.constraints.length !== 1 ? "s" : ""} · {t.problem.numVars} variable
                {t.problem.numVars !== 1 ? "s" : ""}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card style={{ marginTop: 12, borderColor: `${T.indigo}33` }}>
        <div style={{ fontSize: 11, color: T.indigoLight, fontWeight: 600, marginBottom: 12, letterSpacing: "0.06em" }}>📘 LINEAR PROGRAMMING — THEORY</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, fontSize: 13, color: T.textMuted, lineHeight: 1.7 }}>
          <div>
            <strong style={{ color: T.text }}>What is LP?</strong>
            <br />
            Linear Programming optimizes a linear objective function subject to linear equality/inequality constraints.
          </div>
          <div>
            <strong style={{ color: T.text }}>The Simplex Method</strong>
            <br />
            It iterates along the edges of the feasible polytope, improving the objective at each step until optimality.
          </div>
          <div>
            <strong style={{ color: T.text }}>Big-M Method</strong>
            <br />
            Handles ≥ and = constraints by adding artificial variables with a large penalty (M) in the objective.
          </div>
          <div>
            <strong style={{ color: T.text }}>Sensitivity Analysis</strong>
            <br />
            Shadow prices quantify how much the optimal objective changes per unit relaxation of each constraint.
          </div>
        </div>
      </Card>
    </div>
  );
}
