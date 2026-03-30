import { useCallback } from "react";
import { T } from "../constant/theme";
import { Card, NumInput, Pill, SectionTitle, Select } from "../components/common/UIPrimitives";

export default function InputSection({ problem, setProblem, onSolve, solving }) {
  const { numVars, numConstraints, isMaximize, objCoeffs, constraints } = problem;

  const set = useCallback((patch) => setProblem((p) => ({ ...p, ...patch })), [setProblem]);

  const setNumVars = useCallback(
    (nextNumVars) => {
      const n = Math.max(1, Math.min(8, nextNumVars));
      set({
        numVars: n,
        objCoeffs: Array.from({ length: n }, (_, i) => objCoeffs[i] ?? 0),
        constraints: constraints.map((c) => ({
          ...c,
          coeffs: Array.from({ length: n }, (_, i) => c.coeffs[i] ?? 0),
        })),
      });
    },
    [constraints, objCoeffs, set],
  );

  const setNumCons = useCallback(
    (nextNumConstraints) => {
      const nc = Math.max(1, Math.min(10, nextNumConstraints));
      set({
        numConstraints: nc,
        constraints: Array.from({ length: nc }, (_, i) =>
          constraints[i] ?? {
            coeffs: new Array(numVars).fill(0),
            type: "<=",
            rhs: 0,
            label: `Constraint ${i + 1}`,
          },
        ),
      });
    },
    [constraints, numVars, set],
  );

  const updateObjCoeff = (j, val) => set({ objCoeffs: objCoeffs.map((v, i) => (i === j ? val : v)) });
  const updateCon = (i, patch) => set({ constraints: constraints.map((c, ci) => (ci === i ? { ...c, ...patch } : c)) });
  const updateConCoeff = (i, j, val) => updateCon(i, { coeffs: constraints[i].coeffs.map((v, k) => (k === j ? val : v)) });

  const label = (i) => `x${i + 1}`;

  return (
    <div className="fade-in">
      <SectionTitle
        icon="⚙️"
        title="Problem Setup"
        sub="Define your linear programming problem — variables, objective, and constraints."
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 12, marginBottom: 16 }}>
        <Card style={{ padding: "1rem" }}>
          <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 600, marginBottom: 8, letterSpacing: "0.06em" }}>OBJECTIVE</div>
          <div style={{ display: "flex", gap: 6 }}>
            <Pill active={isMaximize} onClick={() => set({ isMaximize: true })}>
              Maximize
            </Pill>
            <Pill active={!isMaximize} onClick={() => set({ isMaximize: false })}>
              Minimize
            </Pill>
          </div>
        </Card>
        <Card style={{ padding: "1rem" }}>
          <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 600, marginBottom: 8, letterSpacing: "0.06em" }}>VARIABLES</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => setNumVars(numVars - 1)} style={{ width: 28, height: 28, borderRadius: 6, background: T.surface, border: `1px solid ${T.border}`, color: T.text, cursor: "pointer", fontSize: 16 }}>
              −
            </button>
            <span className="mono" style={{ fontSize: 22, fontWeight: 700, color: T.indigoLight, minWidth: 30, textAlign: "center" }}>
              {numVars}
            </span>
            <button onClick={() => setNumVars(numVars + 1)} style={{ width: 28, height: 28, borderRadius: 6, background: T.surface, border: `1px solid ${T.border}`, color: T.text, cursor: "pointer", fontSize: 16 }}>
              +
            </button>
          </div>
        </Card>
        <Card style={{ padding: "1rem" }}>
          <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 600, marginBottom: 8, letterSpacing: "0.06em" }}>CONSTRAINTS</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => setNumCons(numConstraints - 1)} style={{ width: 28, height: 28, borderRadius: 6, background: T.surface, border: `1px solid ${T.border}`, color: T.text, cursor: "pointer", fontSize: 16 }}>
              −
            </button>
            <span className="mono" style={{ fontSize: 22, fontWeight: 700, color: T.amber, minWidth: 30, textAlign: "center" }}>
              {numConstraints}
            </span>
            <button onClick={() => setNumCons(numConstraints + 1)} style={{ width: 28, height: 28, borderRadius: 6, background: T.surface, border: `1px solid ${T.border}`, color: T.text, cursor: "pointer", fontSize: 16 }}>
              +
            </button>
          </div>
        </Card>
      </div>

      <Card style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 600, marginBottom: 12, letterSpacing: "0.06em" }}>
          OBJECTIVE FUNCTION — {isMaximize ? "MAXIMIZE" : "MINIMIZE"} z
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
          <span className="mono" style={{ fontSize: 14, color: T.textMuted }}>
            z =
          </span>
          {Array.from({ length: numVars }, (_, j) => (
            <div key={j} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {j > 0 && (
                <span className="mono" style={{ color: T.textMuted }}>
                  +
                </span>
              )}
              <NumInput value={objCoeffs[j] ?? 0} onChange={(v) => updateObjCoeff(j, v)} style={{ width: 64 }} />
              <span className="mono" style={{ fontSize: 13, color: T.indigoLight }}>
                {label(j)}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 600, marginBottom: 12, letterSpacing: "0.06em" }}>CONSTRAINTS</div>
        <div style={{ overflowX: "auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: `120px repeat(${numVars}, 70px) 80px 80px`, gap: 6, marginBottom: 8, alignItems: "center" }}>
            <span style={{ fontSize: 11, color: T.textFaint, fontWeight: 600, letterSpacing: "0.05em" }}>LABEL</span>
            {Array.from({ length: numVars }, (_, j) => (
              <span key={j} className="mono" style={{ fontSize: 12, color: T.indigoLight, textAlign: "center" }}>
                {label(j)}
              </span>
            ))}
            <span style={{ fontSize: 11, color: T.textFaint, fontWeight: 600, textAlign: "center" }}>TYPE</span>
            <span style={{ fontSize: 11, color: T.textFaint, fontWeight: 600, textAlign: "center" }}>RHS</span>
          </div>
          {constraints.map((con, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: `120px repeat(${numVars}, 70px) 80px 80px`, gap: 6, marginBottom: 6, alignItems: "center" }}>
              <input
                value={con.label || ""}
                onChange={(e) => updateCon(i, { label: e.target.value })}
                placeholder={`Constraint ${i + 1}`}
                style={{
                  padding: "5px 8px",
                  borderRadius: 8,
                  fontSize: 12,
                  background: T.surface,
                  border: `1px solid ${T.border}`,
                  color: T.textMuted,
                  outline: "none",
                  width: "100%",
                }}
              />
              {con.coeffs.slice(0, numVars).map((v, j) => (
                <NumInput key={j} value={v} onChange={(val) => updateConCoeff(i, j, val)} />
              ))}
              <Select
                value={con.type}
                onChange={(t) => updateCon(i, { type: t })}
                options={[
                  { value: "<=", label: "≤" },
                  { value: ">=", label: "≥" },
                  { value: "=", label: "=" },
                ]}
              />
              <NumInput
                value={con.rhs ?? 0}
                onChange={(v) => updateCon(i, { rhs: v })}
                style={{ background: "#fffaf0", borderColor: `${T.amber}55`, color: "#a2762d" }}
              />
            </div>
          ))}
        </div>
      </Card>

      <button
        onClick={onSolve}
        disabled={solving}
        style={{
          width: "100%",
          padding: "14px 0",
          borderRadius: 12,
          fontSize: 15,
          fontWeight: 700,
          background: solving ? "#eef1ff" : "linear-gradient(135deg, #20243c, #30395f)",
          color: solving ? T.textMuted : "white",
          border: "none",
          cursor: solving ? "not-allowed" : "pointer",
          transition: "opacity .2s",
          letterSpacing: "0.06em",
          boxShadow: solving ? "none" : "0 4px 24px rgba(99,102,241,.35)",
        }}
      >
        {solving ? (
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <span
              className="solving-dot"
              style={{ display: "inline-block", width: 8, height: 8, background: T.indigo, borderRadius: "50%" }}
            />
            SOLVING…
          </span>
        ) : (
          "⚡ SOLVE WITH SIMPLEX METHOD"
        )}
      </button>
    </div>
  );
}
