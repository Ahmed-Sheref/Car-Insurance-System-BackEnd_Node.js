import React from "react";
import { clearCustomerToken } from "../../auth/authStore";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const nav = useNavigate();
  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2>Customer Dashboard</h2>
      <p>Next: Cars, Policies, Accidents, Payments</p>
      <button onClick={() => { clearCustomerToken(); nav("/login"); }}>
        Logout
      </button>
    </div>
  );
}
