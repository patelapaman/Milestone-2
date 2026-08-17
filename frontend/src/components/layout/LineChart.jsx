import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function LineChartComponent({ events = [] }) {
  const grouped = {};

  events.forEach((event) => {
    if (!event.timestamp) return;

    const hour = event.timestamp.substring(11, 13);

    grouped[hour] = (grouped[hour] || 0) + 1;
  });

  const lineData = Object.keys(grouped)
    .sort()
    .map((hour) => ({
      time: `${hour}:00`,
      events: grouped[hour],
    }));

  return (
    <div style={{ width: "100%", height: 350 }}>
      <h2>Event Trend</h2>

      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={lineData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="time" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="events"
            stroke="#1890FF"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}