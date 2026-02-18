import React, { useState } from "react";
import { customerHttp } from "../../api/http";
import { setCustomerToken } from "../../auth/authStore";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      // Backend endpoint (هنثبته بعدين):
      // POST /api/auth/customer/login -> { token }
      const res = await customerHttp.post("/auth/customer/login", { email, password });
      setCustomerToken(res.data.token);
      nav("/app");
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "60px auto", fontFamily: "Arial" }}>
      <h2>Customer Login</h2>
      {err && <p style={{ color: "crimson" }}>{err}</p>}
      <form onSubmit={submit}>
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ width:"100%", padding:10, margin:"6px 0 12px" }} />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width:"100%", padding:10, margin:"6px 0 12px" }} />
        <button style={{ width:"100%", padding:10 }}>Login</button>
      </form>

      <p style={{ marginTop: 12 }}>
        No account? <Link to="/signup">Sign up</Link>
      </p>

      <p>
        Admin? <Link to="/admin/login">Go to Admin Login</Link>
      </p>
    </div>
  );
}
