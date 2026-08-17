import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#FF4D4F",
  "#FAAD14",
  "#1890FF",
  "#52C41A",
];

export default function PieChartComponent({ events = [] }) {
 const counts = {};

events.forEach((event) => {
  const severity = event.severity || "Unknown";
  counts[severity] = (counts[severity] || 0) + 1;
});

const pieData = Object.keys(counts).map((key) => ({
  name: key,
  value: counts[key],
}));

  return (
    <div style={{ width: "100%", height: 350 }}>
      <h2>Threat Distribution</h2>

      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label
          >
            {pieData.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}