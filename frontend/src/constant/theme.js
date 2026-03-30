export const T = {
  bg: "#aeb6e2",
  surface: "#f8f9ff",
  card: "#ffffff",
  border: "#d9ddf5",
  borderBright: "#b6bddf",
  indigo: "#6f78df",
  indigoLight: "#8d95f2",
  amber: "#d9a54a",
  emerald: "#3cab8d",
  rose: "#de6d8f",
  cyan: "#4f9ad6",
  text: "#202338",
  textMuted: "#6b7091",
  textFaint: "#a0a6c6",
};

export const CHART_COLORS = ["#7f89eb", "#61b39b", "#d6a55c", "#d97898", "#9c93e8", "#65acd8", "#ef9db5"];

export const statusMeta = {
  optimal: { label: "OPTIMAL", color: T.emerald, bg: "#eefbf5", icon: "✓" },
  unbounded: { label: "UNBOUNDED", color: T.amber, bg: "#fff7ea", icon: "∞" },
  infeasible: { label: "INFEASIBLE", color: T.rose, bg: "#fff0f5", icon: "✗" },
  solving: { label: "SOLVING…", color: T.cyan, bg: "#edf7ff", icon: "⟳" },
};
