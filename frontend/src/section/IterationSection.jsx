import { useState } from "react";
import { T } from "../constants/theme";
import { Badge, Card, Pill, SectionTitle } from "../components/common/UIPrimitives";
import SimplexTableau from "../components/solver/SimplexTableau";

export default function IterationsSection({ result }) {
  const { iterations } = result;
  const [active, setActive] = useState(0);
  const iter = iterations[active];
  const totalIter = iterations.length;

  return (
    <div className="fade-in">
      <SectionTitle
        icon="🔄"
        title="Step-by-Step Iterations"
        sub="Each pivot operation of the Simplex tableau. Highlighted: entering ↑ column, leaving ↓ row, pivot element."
      />

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <button onClick={() => setActive(0)} disabled={active === 0} style={{ padding: "5px 12px", borderRadius: 8, background: T.surface, border: `1px solid ${T.border}`, color: T.textMuted, cursor: active === 0 ? "not-allowed" : "pointer", fontSize: 13 }}>
          ⏮ First
        </button>
        <button onClick={() => setActive((a) => Math.max(0, a - 1))} disabled={active === 0} style={{ padding: "5px 12px", borderRadius: 8, background: T.surface, border: `1px solid ${T.border}`, color: T.textMuted, cursor: active === 0 ? "not-allowed" : "pointer", fontSize: 13 }}>
          ◀ Prev
        </button>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", flex: 1 }}>
          {iterations.map((it, i) => (
            <Pill key={i} active={active === i} onClick={() => setActive(i)}>
              {i === 0 ? "Init" : i === totalIter - 1 ? "Final" : `#${i}`}
            </Pill>
          ))}
        </div>
        <button onClick={() => setActive((a) => Math.min(totalIter - 1, a + 1))} disabled={active === totalIter - 1} style={{ padding: "5px 12px", borderRadius: 8, background: T.surface, border: `1px solid ${T.border}`, color: T.textMuted, cursor: active === totalIter - 1 ? "not-allowed" : "pointer", fontSize: 13 }}>
          Next ▶
        </button>
        <button onClick={() => setActive(totalIter - 1)} disabled={active === totalIter - 1} style={{ padding: "5px 12px", borderRadius: 8, background: T.surface, border: `1px solid ${T.border}`, color: T.textMuted, cursor: active === totalIter - 1 ? "not-allowed" : "pointer", fontSize: 13 }}>
          Last ⏭
        </button>
      </div>

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{iter?.note}</div>
          <div style={{ display: "flex", gap: 8 }}>
            {iter?.eCol >= 0 && <Badge label={`Entering: ${iter.vars[iter.eCol]?.name}`} color={T.cyan} />}
            {iter?.lRow >= 0 && <Badge label={`Leaving: ${iter.vars[iter.basis[iter.lRow]]?.name}`} color={T.emerald} />}
          </div>
        </div>
        <SimplexTableau iter={iter} />
      </Card>

      {iter && (
        <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
          <div style={{ fontSize: 12, color: T.textMuted, marginRight: 4, lineHeight: "28px" }}>Current Basis:</div>
          {iter.basis.map((b, i) => (
            <div key={i} className="mono" style={{ padding: "3px 10px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 12, color: T.indigoLight }}>
              Row {i + 1}: {iter.vars[b]?.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
