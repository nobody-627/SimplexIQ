import { T } from "../../constants/theme";

export const Card = ({ children, style = {}, className = "" }) => (
  <div
    className={`fade-in ${className}`}
    style={{
      background: "rgba(255, 255, 255, 0.86)",
      border: `1px solid ${T.border}`,
      borderRadius: 16,
      padding: "1.25rem",
      boxShadow: "0 12px 28px rgba(104, 112, 167, 0.13)",
      ...style,
    }}
  >
    {children}
  </div>
);

export const SectionTitle = ({ icon, title, sub }) => (
  <div style={{ marginBottom: "1.25rem" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
      <span style={{ fontSize: 20, filter: "saturate(0.75)" }}>{icon}</span>
      <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: T.text, letterSpacing: "-0.02em", fontFamily: "Space Grotesk, sans-serif" }}>{title}</h2>
    </div>
    {sub && <p style={{ margin: 0, fontSize: 13, color: T.textMuted, maxWidth: 680 }}>{sub}</p>}
  </div>
);

export const Badge = ({ label, color }) => (
  <span
    className="mono"
    style={{
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: "0.08em",
      padding: "4px 10px",
      borderRadius: 999,
      background: `${color}1e`,
      color,
      border: `1px solid ${color}38`,
    }}
  >
    {label}
  </span>
);

export const Pill = ({ children, active, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      padding: "6px 15px",
      borderRadius: 999,
      fontSize: 13,
      fontWeight: 600,
      cursor: disabled ? "not-allowed" : "pointer",
      border: `1px solid ${active ? `${T.indigo}66` : T.border}`,
      background: active ? `${T.indigo}1f` : "rgba(255, 255, 255, 0.75)",
      color: active ? T.indigo : disabled ? T.textFaint : T.textMuted,
      transition: "all .15s",
      outline: "none",
    }}
  >
    {children}
  </button>
);

export const NumInput = ({ value, onChange, min = 0, max = 999, style = {}, placeholder = "0" }) => (
  <input
    type="number"
    value={value}
    min={min}
    max={max}
    placeholder={placeholder}
    onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
    className="mono"
    style={{
      width: "100%",
      padding: "7px 10px",
      borderRadius: 10,
      fontSize: 13,
      background: "#ffffff",
      border: `1px solid ${T.border}`,
      color: T.text,
      outline: "none",
      textAlign: "center",
      transition: "border-color .15s",
      ...style,
    }}
    onFocus={(e) => {
      e.target.style.borderColor = T.indigo;
    }}
    onBlur={(e) => {
      e.target.style.borderColor = T.border;
    }}
  />
);

export const Select = ({ value, onChange, options, style = {} }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="mono"
    style={{
      padding: "7px 10px",
      borderRadius: 10,
      fontSize: 13,
      background: "#ffffff",
      border: `1px solid ${T.border}`,
      color: T.text,
      outline: "none",
      cursor: "pointer",
      ...style,
    }}
  >
    {options.map((o) => (
      <option key={o.value} value={o.value}>
        {o.label}
      </option>
    ))}
  </select>
);
