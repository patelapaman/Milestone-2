export const getThreatDistribution = (events) => {
  const counts = {};

  events.forEach((event) => {
    const key = event.event_type;

    if (key) {
      counts[key] = (counts[key] || 0) + 1;
    }
  });

  return Object.keys(counts).map((key) => ({
    name: key,
    value: counts[key],
  }));
};

export const getEventTrend = (events) => {
  const counts = {};

  events.forEach((event) => {
    const hour = event.timestamp?.substring(11, 13);

    if (hour) {
      counts[hour] = (counts[hour] || 0) + 1;
    }
  });

  return Object.keys(counts)
    .sort()
    .map((hour) => ({
      time: `${hour}:00`,
      events: counts[hour],
    }));
};

export const getTopAttackTypes = (events) => {
  const counts = {};

  events.forEach((event) => {
    const key = event.event_type;

    if (key) {
      counts[key] = (counts[key] || 0) + 1;
    }
  });

  return Object.keys(counts).map((key) => ({
    attack: key,
    count: counts[key],
  }));
};