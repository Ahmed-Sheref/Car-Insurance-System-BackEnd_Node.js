import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { setAdminToken } from "../auth/authStore";
import FormInput from "../components/FormInput";

export default function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/admin/login", { email, password });
      const token = res.data?.data?.token;
      if (token) {
        setAdminToken(token);
        nav("/admin");
      } else {
        setError("No token received");
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.response?.data?.error || "Admin login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
      <h1 className="text-2xl font-semibold text-slate-900">Admin / Employee Login</h1>
      <p className="mt-1 text-sm text-slate-500">Sign in to the admin portal</p>

      {error && (
        <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      <form onSubmit={submit} className="mt-6 space-y-4">
        <FormInput
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="employee@company.com"
          required
        />
        <FormInput
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-slate-800 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Customer? <Link to="/login" className="font-medium text-primary hover:underline">Customer login</Link>
      </p>
    </div>
  );
}
