import React, { useState } from "react";
import { customerHttp } from "../../api/http";
import { setCustomerToken } from "../../auth/authStore";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const nav = useNavigate();
  const [first_name, setFirstName] = useState("");
  const [second_name, setSecondName] = useState("");
  const [email, setEmail] = useState("");
  const [branch_code, setBranchCode] = useState("");
  const [customer_type, setCustomerType] = useState("Individual");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    if (password !== confirm) return setErr("Password confirmation does not match");

    try {
      // Backend endpoint:
      // POST /api/auth/customer/signup -> { token }
      const res = await customerHttp.post("/auth/customer/signup", {
        first_name,
        second_name,
        email,
        branch_code,
        customer_type,
        password,
      });
      setCustomerToken(res.data.token);
      nav("/app");
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: "40px auto", fontFamily: "Arial" }}>
      <h2>Create Customer Account</h2>
      {err && <p style={{ color: "crimson" }}>{err}</p>}
      <form onSubmit={submit}>
        <label>First name</label>
        <input value={first_name} onChange={(e) => setFirstName(e.target.value)} style={{ width:"100%", padding:10, margin:"6px 0 12px" }} />

        <label>Second name</label>
        <input value={second_name} onChange={(e) => setSecondName(e.target.value)} style={{ width:"100%", padding:10, margin:"6px 0 12px" }} />

        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ width:"100%", padding:10, margin:"6px 0 12px" }} />

        <label>Branch code</label>
        <input value={branch_code} onChange={(e) => setBranchCode(e.target.value)} style={{ width:"100%", padding:10, margin:"6px 0 12px" }} />

        <label>Customer type</label>
        <select value={customer_type} onChange={(e) => setCustomerType(e.target.value)} style={{ width:"100%", padding:10, margin:"6px 0 12px" }}>
          <option value="Individual">Individual</option>
          <option value="Company">Company</option>
        </select>

        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width:"100%", padding:10, margin:"6px 0 12px" }} />

        <label>Confirm password</label>
        <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} style={{ width:"100%", padding:10, margin:"6px 0 12px" }} />

        <button style={{ width:"100%", padding:10 }}>Sign up</button>
      </form>

      <p style={{ marginTop: 12 }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
