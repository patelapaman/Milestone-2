import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import { API_BASE_URL } from "../services/api";

export default function Profile() {
  const { id } = useParams();

  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/profile/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
      })
      .catch(console.error);
  }, [id]);

  if (!user) {
    return (
      <DashboardLayout pageTitle="My Profile">
        <div style={{ padding: 30, color: "white" }}>
          Loading...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="My Profile">
      <div style={{ padding: 30, color: "white" }}>
        <h2>My Profile</h2>

        <br />

        <p>
          <strong>Name:</strong> {user.name}
        </p>

        <p>
          <strong>Email:</strong> {user.email}
        </p>

        <p>
          <strong>Department:</strong> {user.department}
        </p>

        <p>
          <strong>Designation:</strong> {user.designation}
        </p>

        <p>
          <strong>Role:</strong> {user.role}
        </p>

        <p>
          <strong>Phone:</strong> {user.phone || "Not Added"}
        </p>
      </div>
    </DashboardLayout>
  );
}