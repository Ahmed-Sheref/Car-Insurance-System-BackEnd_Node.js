import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { setCustomerToken } from "../auth/authStore";
import FormInput from "../components/FormInput";
import Select from "../components/Select";

export default function Signup() {
  const nav = useNavigate();
  const [first_name, setFirst_name] = useState("");
  const [second_name, setSecond_name] = useState("");
  const [email, setEmail] = useState("");
  const [branch_code, setBranch_code] = useState("");
  const [customer_type, setCustomer_type] = useState("Individual");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirm_password] = useState("");
  const [branches, setBranches] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [branchesLoading, setBranchesLoading] = useState(true);

  useEffect(() => {
    api
      .get("/branches")
      .then((res) => setBranches(res.data?.branches ?? []))
      .catch(() => setBranches([]))
      .finally(() => setBranchesLoading(false));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm_password) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      // Backend: POST /api/v1/auth/signUp -> { status, data: { customer_id, email, token } }
      const res = await api.post("/auth/signUp", {
        first_name,
        second_name: second_name || undefined,
        email,
        branch_code: branch_code || undefined,
        customer_type,
        password,
        username: username || undefined,
      });
      const token = res.data?.data?.token ?? res.data?.token;
      if (token) {
        setCustomerToken(token);
        nav("/app");
      } else {
        setError("No token received");
      }
    } catch (err) {
      setError(err?.response?.data?.message ?? err?.response?.data?.error ?? err?.message ?? "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const branchOptions = branches.map((b) => ({ value: b.branch_code, label: `${b.branch_code} - ${b.location || b.branch_code}` }));

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
      <h1 className="text-2xl font-semibold text-slate-900">Customer Sign up</h1>
      <p className="mt-1 text-sm text-slate-500">Create your account</p>

      {error && (
        <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      <form onSubmit={submit} className="mt-6 space-y-4">
        <FormInput label="First name" value={first_name} onChange={setFirst_name} required />
        <FormInput label="Second name (optional)" value={second_name} onChange={setSecond_name} />
        <FormInput label="Email" type="email" value={email} onChange={setEmail} required />
        <Select
          label="Branch"
          value={branch_code}
          onChange={setBranch_code}
          options={branchOptions}
          required
          disabled={branchesLoading}
        />
        <Select
          label="Customer type"
          value={customer_type}
          onChange={setCustomer_type}
          options={[
            { value: "Individual", label: "Individual" },
            { value: "Company", label: "Company" },
          ]}
        />
        <FormInput label="Username (optional)" value={username} onChange={setUsername} />
        <FormInput label="Password" type="password" value={password} onChange={setPassword} required />
        <FormInput
          label="Confirm password"
          type="password"
          value={confirm_password}
          onChange={setConfirm_password}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-60"
        >
          {loading ? "Creating account…" : "Sign up"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account? <Link to="/login" className="font-medium text-primary hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
