import { T } from "../../constant/theme";
import { fmt } from "../../utils/format";

export default function SimplexTableau({ iter }) {
  if (!iter) return null;
  const { tab, basis, vars, eCol, lRow, TV, m } = iter;

  const typeColor = (v) =>
    v.type === "original"
      ? T.indigoLight
      : v.type === "artificial"
        ? T.rose
        : v.type === "surplus"
          ? T.amber
          : T.textMuted;

  const colBg = (j) => (j === eCol ? "#eef2ff" : "transparent");
  const rowBg = (i) => (i === lRow ? "#edf9f3" : i % 2 === 0 ? "transparent" : "#f8f9ff");

  return (
    <div style={{ overflowX: "auto", marginTop: 8 }}>
      <table style={{ borderCollapse: "collapse", fontSize: 12, width: "100%" }}>
        <thead>
          <tr>
            <th
              style={{
                padding: "6px 12px",
                background: T.surface,
                color: T.textMuted,
                fontWeight: 600,
                textAlign: "left",
                border: `1px solid ${T.border}`,
                minWidth: 64,
                fontFamily: "Outfit, sans-serif",
              }}
            >
              Basis
            </th>
            {vars.map((v, j) => (
              <th
                key={j}
                style={{
                  padding: "6px 10px",
                  textAlign: "center",
                  border: `1px solid ${T.border}`,
                  background: j === eCol ? "#eef2ff" : T.surface,
                  color: j === eCol ? T.cyan : typeColor(v),
                  fontFamily: "JetBrains Mono, monospace",
                  fontWeight: 700,
                  minWidth: 58,
                }}
              >
                {v.name}
                {j === eCol ? " ↑" : ""}
              </th>
            ))}
            <th
              style={{
                padding: "6px 14px",
                textAlign: "center",
                border: `1px solid ${T.border}`,
                background: "#fff7e8",
                color: T.amber,
                fontFamily: "JetBrains Mono, monospace",
                fontWeight: 700,
                minWidth: 70,
              }}
            >
              RHS
            </th>
          </tr>
        </thead>
        <tbody>
          {tab.slice(0, m).map((row, i) => (
            <tr key={i} style={{ background: rowBg(i) }}>
              <td
                style={{
                  padding: "5px 12px",
                  border: `1px solid ${T.border}`,
                  color: i === lRow ? T.emerald : T.textMuted,
                  fontFamily: "JetBrains Mono, monospace",
                  fontWeight: 600,
                }}
              >
                {vars[basis[i]]?.name ?? "?"}
                {i === lRow ? " ↓" : ""}
              </td>
              {row.slice(0, TV).map((v, j) => {
                const isPivot = i === lRow && j === eCol;
                return (
                  <td
                    key={j}
                    className={isPivot ? "tab-cell-highlight" : ""}
                    style={{
                      padding: "5px 10px",
                      textAlign: "center",
                      border: `1px solid ${T.border}`,
                      fontFamily: "JetBrains Mono, monospace",
                      background: isPivot ? "#fff2d9" : colBg(j),
                      color: isPivot ? T.amber : i === lRow ? T.emerald : j === eCol ? T.cyan : T.text,
                      fontWeight: isPivot ? 700 : 400,
                    }}
                  >
                    {fmt(v)}
                  </td>
                );
              })}
              <td
                style={{
                  padding: "5px 14px",
                  textAlign: "center",
                  border: `1px solid ${T.border}`,
                  fontFamily: "JetBrains Mono, monospace",
                  fontWeight: 600,
                  color: i === lRow ? T.emerald : T.amber,
                }}
              >
                {fmt(row[TV])}
              </td>
            </tr>
          ))}
          <tr style={{ background: "#f3f5ff", borderTop: `2px solid ${T.indigo}44` }}>
            <td
              style={{
                padding: "6px 12px",
                border: `1px solid ${T.border}`,
                color: T.indigoLight,
                fontFamily: "JetBrains Mono, monospace",
                fontWeight: 700,
              }}
            >
              z
            </td>
            {tab[m].slice(0, TV).map((v, j) => (
              <td
                key={j}
                style={{
                  padding: "6px 10px",
                  textAlign: "center",
                  border: `1px solid ${T.border}`,
                  fontFamily: "JetBrains Mono, monospace",
                  background: j === eCol ? "#eef2ff" : "transparent",
                  color: v < -1e-9 ? T.rose : j === eCol ? T.cyan : T.indigoLight,
                  fontWeight: v < -1e-9 ? 700 : 400,
                }}
              >
                {fmt(v)}
              </td>
            ))}
            <td
              style={{
                padding: "6px 14px",
                textAlign: "center",
                border: `1px solid ${T.border}`,
                fontFamily: "JetBrains Mono, monospace",
                fontWeight: 700,
                color: T.indigo,
              }}
            >
              {fmt(tab[m][TV])}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
