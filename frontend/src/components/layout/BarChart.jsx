import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function BarChartComponent({ events = [] }) {
  const grouped = {};

  events.forEach((event) => {
    const attack = event.event_type || "Unknown";
    grouped[attack] = (grouped[attack] || 0) + 1;
  });

  const barData = Object.keys(grouped).map((type) => ({
    attack: type,
    count: grouped[type],
  }));

  return (
    <div style={{ width: "100%", height: 350 }}>
      <h2>Top Attack Types</h2>

      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={barData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="attack" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="count"
            fill="#52C41A"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}