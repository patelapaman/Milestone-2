import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
} from "recharts";

const COLORS = ["#60a5fa", "#fbbf24", "#c084fc", "#fb7185", "#6ee7b7"];

export function AnomalyChart({ data }) {
  return (
    <div className="m2-panel chart-panel">
      <div className="m2-panel-head">
        <div>
          <h2>Anomaly Distribution</h2>
          <p>Normal, suspicious and critical outcomes</p>
        </div>
      </div>
      <div className="m2-chart">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={65} outerRadius={95} paddingAngle={4}>
              {data.map((item, i) => <Cell key={item.name} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function ThreatTypeChart({ data }) {
  return (
    <div className="m2-panel chart-panel">
      <div className="m2-panel-head">
        <div>
          <h2>Threat Types</h2>
          <p>Detected security patterns</p>
        </div>
      </div>
      <div className="m2-chart">
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ left: 8, right: 12 }}>
            <CartesianGrid strokeDasharray="3 3" opacity=".15" />
            <XAxis type="number" allowDecimals={false} />
            <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 10 }} />
            <Tooltip />
            <Bar dataKey="value" radius={[0, 6, 6, 0]} fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function TrendChart({ data }) {
  return (
    <div className="m2-panel chart-panel">
      <div className="m2-panel-head">
        <div>
          <h2>Anomaly Trend</h2>
          <p>Detected anomalies across recent events</p>
        </div>
      </div>
      <div className="m2-chart">
        <ResponsiveContainer>
          <LineChart data={data} margin={{ left: 4, right: 12 }}>
            <CartesianGrid strokeDasharray="3 3" opacity=".15" />
            <XAxis dataKey="label" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="anomalies" stroke="#38bdf8" strokeWidth={3} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
