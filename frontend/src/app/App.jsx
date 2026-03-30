import { useCallback, useState } from "react";
import { T, statusMeta } from "../constant/theme";
import { TEMPLATES } from "../data/templets";
import { solveSimplex } from "../solver/simplex_client";
import { fmt } from "../utils/format";
import { setupGlobalStyles } from "../styles/setupGlobalStyles";
import InputSection from "../section/InputSection";
import ResultsSection from "../section/ResultsSection";
import IterationSection from "../section/IterationSection";
import VisualizationSection from "../section/VisualizationSection";
import TempletesSection from "../section/TempletesSection";

setupGlobalStyles();

export default function App() {
    const [section, setSection] = useState("input");
    const [result, setResult] = useState(null);
    const [solving, setSolving] = useState(false);
    const [problem, setProblem] = useState({
        numVars: 2,
        numConstraints: 2,
        isMaximize: true,
        objCoeffs: [5, 4],
        varLabels: ["Product A", "Product B"],
        constraints: [
            { coeffs: [6, 4], type: "<=", rhs: 24, label: "Machine Hours" },
            { coeffs: [1, 2], type: "<=", rhs: 6, label: "Labor Hours" },
        ],
    });

    const handleSolve = useCallback(() => {
        setSolving(true);
        setTimeout(() => {
            solveSimplex(problem)
                .then((r) => {
                    setResult(r);
                    setSection("results");
                })
                .catch((e) => {
                    console.error(e);
                })
                .finally(() => {
                    setSolving(false);
                });
        }, 300);
    }, [problem]);

    const loadTemplate = useCallback((template) => {
        const p = template.problem;
        setProblem({
            numVars: p.numVars,
            numConstraints: p.constraints.length,
            isMaximize: p.isMaximize,
            objCoeffs: [...p.objCoeffs],
            varLabels: p.varLabels || Array.from({ length: p.numVars }, (_, i) => `x${i + 1}`),
            constraints: p.constraints.map((c) => ({ ...c, coeffs: [...c.coeffs] })),
        });
        setResult(null);
        setSection("input");
    }, []);

    const NAV = [
        { id: "input", label: "Problem Setup", icon: "⚙️" },
        { id: "results", label: "Results", icon: "📊", disabled: !result },
        { id: "iterations", label: "Iterations", icon: "🔄", disabled: !result },
        { id: "visualizations", label: "Visualizations", icon: "📈", disabled: !result },
        { id: "templates", label: "Templates", icon: "📋" },
    ];

    return (
        <div className="app-shell" style={{ color: T.text }}>
            <div className="app-window">
                <aside
                    className="app-sidebar"
                    style={{
                        width: 236,
                        background: "linear-gradient(180deg, #16162a 0%, #20203a 100%)",
                        display: "flex",
                        flexDirection: "column",
                        flexShrink: 0,
                        padding: "20px 14px",
                        borderRight: "1px solid rgba(255,255,255,0.06)",
                    }}
                >
                    <div style={{ marginBottom: 18 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div
                                style={{
                                    width: 42,
                                    height: 42,
                                    borderRadius: 14,
                                    background: "linear-gradient(135deg, #7786ec, #9ba5f8)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 800,
                                    fontSize: 14,
                                    color: "#ffffff",
                                }}
                            >
                                IQ
                            </div>
                            <div className="sidebar-wide-text">
                                <div className="brand-text" style={{ fontSize: 18, fontWeight: 700, color: "#ffffff", lineHeight: 1.05 }}>
                                    SimplexIQ
                                </div>
                                <div style={{ fontSize: 11, color: "#9fa5cb", letterSpacing: "0.04em" }}>Optimization Studio</div>
                            </div>
                        </div>
                    </div>

                    <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                        {NAV.map((item) => {
                            const active = section === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => !item.disabled && setSection(item.id)}
                                    disabled={item.disabled}
                                    title={item.label}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 10,
                                        width: "100%",
                                        padding: "10px 12px",
                                        borderRadius: 12,
                                        border: "1px solid transparent",
                                        cursor: item.disabled ? "not-allowed" : "pointer",
                                        fontSize: 13,
                                        fontWeight: 600,
                                        textAlign: "left",
                                        background: active ? "rgba(132, 147, 242, 0.24)" : "transparent",
                                        color: active ? "#f6f7ff" : item.disabled ? "#5c628e" : "#b9bde0",
                                        boxShadow: active ? "inset 0 0 0 1px rgba(165, 176, 251, 0.46)" : "none",
                                        transition: "all .16s",
                                    }}
                                >
                                    <span style={{ width: 18, textAlign: "center", opacity: active ? 1 : 0.9 }}>{item.icon}</span>
                                    <span className="sidebar-wide-text">{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>

                    <div style={{ paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                        <div className="sidebar-wide-text" style={{ fontSize: 10, color: "#8b91bb", fontWeight: 700, letterSpacing: "0.08em", marginBottom: 8, paddingLeft: 4 }}>
                            QUICK LOAD
                        </div>
                        {TEMPLATES.slice(0, 4).map((t, i) => (
                            <button
                                key={i}
                                onClick={() => loadTemplate(t)}
                                title={t.name}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    width: "100%",
                                    padding: "7px 10px",
                                    borderRadius: 10,
                                    background: "transparent",
                                    border: "none",
                                    cursor: "pointer",
                                    fontSize: 12,
                                    color: "#aab0d4",
                                    textAlign: "left",
                                    transition: "background .12s",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "transparent";
                                }}
                            >
                                <span>{t.icon}</span>
                                <span className="sidebar-wide-text">{t.name}</span>
                            </button>
                        ))}
                    </div>

                    {result && (
                        <div style={{ marginTop: 10, padding: "10px 12px", borderRadius: 12, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}>
                            <div className="sidebar-wide-text" style={{ fontSize: 10, color: "#8b91bb", marginBottom: 4 }}>LAST RESULT</div>
                            <div className="mono" style={{ fontSize: 12, color: statusMeta[result.status]?.color }}>
                                {statusMeta[result.status]?.label}
                            </div>
                            {result.status === "optimal" && (
                                <div className="mono" style={{ fontSize: 11, color: "#f2cd86" }}>z* = {fmt(result.objVal)}</div>
                            )}
                        </div>
                    )}
                </aside>

                <main style={{ flex: 1, overflowY: "auto", padding: "26px", minWidth: 0 }}>
                    <div
                        className="soft-card"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 14,
                            borderRadius: 18,
                            padding: "12px 14px",
                            marginBottom: 16,
                        }}
                    >
                        <div style={{ flex: 1, minWidth: 160 }}>
                            <div style={{ position: "relative" }}>
                                <span style={{ position: "absolute", left: 12, top: 8, color: T.textMuted, fontSize: 13 }}>⌕</span>
                                <input
                                    readOnly
                                    value="Search templates, constraints, objective"
                                    style={{
                                        width: "100%",
                                        padding: "8px 10px 8px 34px",
                                        borderRadius: 12,
                                        border: `1px solid ${T.border}`,
                                        background: "rgba(255,255,255,0.82)",
                                        color: T.textMuted,
                                        fontSize: 12,
                                        outline: "none",
                                    }}
                                />
                            </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <button style={{ width: 34, height: 34, borderRadius: 10, border: `1px solid ${T.border}`, background: "rgba(255,255,255,0.86)", cursor: "pointer" }}>🔔</button>
                            <div
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: "50%",
                                    background: "linear-gradient(135deg, #2d314f, #5f648f)",
                                    color: "#fff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 12,
                                    fontWeight: 700,
                                }}
                            >
                                SI
                            </div>
                        </div>
                    </div>

                    <div style={{ maxWidth: 1080, margin: "0 auto", width: "100%" }}>
                        {section === "input" && <InputSection problem={problem} setProblem={setProblem} onSolve={handleSolve} solving={solving} />}
                        {section === "results" && result && <ResultsSection result={result} problem={problem} />}
                        {section === "iterations" && result && <IterationSection result={result} />}
                        {section === "visualizations" && result && <VisualizationSection result={result} problem={problem} />}
                        {section === "templates" && <TempletesSection onLoad={loadTemplate} />}
                    </div>
                </main>
            </div>
        </div>
    );
}
