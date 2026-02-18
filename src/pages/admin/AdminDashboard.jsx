import React from "react";
import { clearAdminToken } from "../../auth/authStore";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const nav = useNavigate();
  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2>Admin Dashboard</h2>
      <p>Next: Customers, Policies, Accident Review, Payments</p>
      <button onClick={() => { clearAdminToken(); nav("/admin/login"); }}>
        Logout
      </button>
    </div>
  );
}
