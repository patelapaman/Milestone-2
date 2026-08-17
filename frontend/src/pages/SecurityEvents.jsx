import React, { useEffect, useState } from "react";

import DashboardLayout from "../components/layout/DashboardLayout";
import SecurityEventsTable from "../components/SecurityEventsTable";
import { getEvents } from "../services/api";

export default function SecurityEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        console.error("Failed to load events:", err);
      }
    }

    loadEvents();
  }, []);

  return (
    <DashboardLayout pageTitle="Security Events">
      <SecurityEventsTable events={events} />
    </DashboardLayout>
  );
}