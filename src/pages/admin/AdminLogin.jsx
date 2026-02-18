import React, { useState } from "react";
import { adminHttp } from "../../api/http";
import { setAdminToken } from "../../auth/authStore";
import { useNavigate, Link } from "react-router-dom";

export default function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      // Backend endpoint:
      // POST /api/auth/employee/login -> { token }
      const res = await adminHttp.post("/auth/employee/login", { email, password });
      setAdminToken(res.data.token);
      nav("/admin");
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Admin login failed");
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "60px auto", fontFamily: "Arial" }}>
      <h2>Admin / Employee Login</h2>
      {err && <p style={{ color: "crimson" }}>{err}</p>}
      <form onSubmit={submit}>
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ width:"100%", padding:10, margin:"6px 0 12px" }} />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width:"100%", padding:10, margin:"6px 0 12px" }} />
        <button style={{ width:"100%", padding:10 }}>Login</button>
      </form>

      <p style={{ marginTop: 12 }}>
        Back to Customer <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
