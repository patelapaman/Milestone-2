import React, { useMemo, useState, useEffect } from "react";
import "./SecurityEventsTable.css";
const ROWS_PER_PAGE = 10;

export default function SecurityEventsTable({ events = [], searchQuery = "" }) {
  const [search, setSearch] = useState("");
  const [sortColumn, setSortColumn] = useState("timestamp");
  const [sortDirection, setSortDirection] = useState("desc");
  const [page, setPage] = useState(1);

  // Sync navbar search with local search
  useEffect(() => {
    setSearch(searchQuery);
    setPage(1);
  }, [searchQuery]);

  // ---------------- Filter ----------------

  const filtered = useMemo(() => {
    return events.filter((event) =>
      Object.values(event)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [events, search]);

  // ---------------- Sort ----------------

  const sorted = useMemo(() => {
    const data = [...filtered];

    data.sort((a, b) => {
      const valueA = (a[sortColumn] || "").toString().toLowerCase();
      const valueB = (b[sortColumn] || "").toString().toLowerCase();

      if (valueA < valueB)
        return sortDirection === "asc" ? -1 : 1;

      if (valueA > valueB)
        return sortDirection === "asc" ? 1 : -1;

      return 0;
    });

    return data;
  }, [filtered, sortColumn, sortDirection]);

  // ---------------- Pagination ----------------

  const totalPages = Math.max(
    1,
    Math.ceil(sorted.length / ROWS_PER_PAGE)
  );

  const currentRows = sorted.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE
  );

  function sort(column) {
    if (sortColumn === column) {
      setSortDirection((prev) =>
        prev === "asc" ? "desc" : "asc"
      );
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  }

  return (
    <div className="events-card">

      <div className="events-header">

        <h2>Security Events</h2>

        <input
          type="text"
          placeholder="Search events, IP, severity..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

      </div>

      <table className="events-table">

        <thead>

          <tr>

            <th onClick={() => sort("timestamp")}>
              Time
            </th>

            <th onClick={() => sort("event_type")}>
              Event Type
            </th>

            <th onClick={() => sort("severity")}>
              Severity
            </th>

            <th onClick={() => sort("source_ip")}>
              Source IP
            </th>

            <th onClick={() => sort("event_status")}>
              Status
            </th>

          </tr>

        </thead>

        <tbody>

          {currentRows.length > 0 ? (

            currentRows.map((event, index) => (

              <tr key={event._id || index}>

                <td>{event.timestamp}</td>

                <td>
                  {event.event_type ||
                    event.type ||
                    event.attack_type}
                </td>

                <td>

                  <span
                    className={`severity ${(event.severity || "").toLowerCase()}`}
                  >
                    {event.severity}
                  </span>

                </td>

                <td>{event.source_ip}</td>

                <td>{event.event_status}</td>

              </tr>

            ))

          ) : (

            <tr>

              <td
                colSpan="5"
                style={{
                  textAlign: "center",
                  padding: "25px",
                }}
              >
                No matching events found.
              </td>

            </tr>

          )}

        </tbody>

      </table>

      <div className="pagination">

        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>

      </div>

    </div>
  );
}