import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_COLORS, T } from "../constant/theme";
import { fmt } from "../utils/format";
import { Card, SectionTitle } from "../components/common/UIPrimitives";
import GraphicalMethod from "../components/solver/GraphicalMethod";

export default function VisualizationsSection({ result, problem }) {
  const { solution, utilization, shadowPrices } = result;
  const varLabels = problem.varLabels || solution.map((_, i) => `x${i + 1}`);

  const solutionData = solution.map((v, i) => ({ name: varLabels[i], value: parseFloat(fmt(v, 4)) }));
  const utilizationData = utilization.map((u, i) => ({
    name: problem.constraints[i]?.label || `C${i + 1}`,
    Used: parseFloat(fmt(u.used, 2)),
    Capacity: parseFloat(fmt(u.limit, 2)),
    Pct: parseFloat(fmt(u.pct, 1)),
  }));
  const shadowData = shadowPrices
    .filter((s) => s.price !== null)
    .map((s) => ({ name: problem.constraints[s.index]?.label || `C${s.index + 1}`, "Shadow Price": parseFloat(fmt(s.price, 4)) }));

  const pieData = solutionData.filter((d) => d.value > 0);

  return (
    <div className="fade-in">
      <SectionTitle
        icon="📈"
        title="Data Visualizations"
        sub="Charts and graphs illustrating the optimal solution and resource allocation."
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12, marginBottom: 12 }}>
        <Card>
          <div style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 12, letterSpacing: "0.06em" }}>OPTIMAL VARIABLE VALUES</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={solutionData} margin={{ top: 5, right: 10, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
              <XAxis dataKey="name" tick={{ fill: T.textMuted, fontSize: 11 }} />
              <YAxis tick={{ fill: T.textMuted, fontSize: 11 }} />
              <Tooltip contentStyle={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8 }} labelStyle={{ color: T.text }} />
              <Bar dataKey="value" name="Value" radius={[4, 4, 0, 0]}>
                {solutionData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <div style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 12, letterSpacing: "0.06em" }}>RESOURCE DISTRIBUTION</div>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: T.borderBright }}
                  fontSize={10}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8 }} labelStyle={{ color: T.text }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ color: T.textMuted, fontSize: 13, textAlign: "center", paddingTop: 60 }}>No positive values to display.</div>
          )}
        </Card>
      </div>

      <Card style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 12, letterSpacing: "0.06em" }}>
          RESOURCE UTILIZATION vs. CAPACITY
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={utilizationData} margin={{ top: 5, right: 10, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
            <XAxis dataKey="name" tick={{ fill: T.textMuted, fontSize: 11 }} />
            <YAxis tick={{ fill: T.textMuted, fontSize: 11 }} />
            <Tooltip contentStyle={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8 }} labelStyle={{ color: T.text }} />
            <Legend wrapperStyle={{ color: T.textMuted, fontSize: 12 }} />
            <Bar dataKey="Used" fill={T.indigo} radius={[4, 4, 0, 0]} />
            <Bar dataKey="Capacity" fill={T.border} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {shadowData.length > 0 && (
        <Card style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 12, letterSpacing: "0.06em" }}>SHADOW PRICES (DUAL VALUES)</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={shadowData} margin={{ top: 5, right: 10, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
              <XAxis dataKey="name" tick={{ fill: T.textMuted, fontSize: 11 }} />
              <YAxis tick={{ fill: T.textMuted, fontSize: 11 }} />
              <Tooltip contentStyle={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8 }} />
              <Bar dataKey="Shadow Price" fill={T.amber} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {problem.numVars === 2 && <GraphicalMethod problem={problem} />}
    </div>
  );
}
