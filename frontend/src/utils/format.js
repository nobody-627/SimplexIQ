export const fmt = (v, digits = 4) => {
  if (v === null || v === undefined || (typeof v === "number" && Number.isNaN(v))) return "—";
  const r = Math.round(v * 1e8) / 1e8;
  if (Math.abs(r) < 1e-9) return "0";
  if (Math.abs(r - Math.round(r)) < 1e-7) return Math.round(r).toString();
  return parseFloat(r.toFixed(digits)).toString();
};
