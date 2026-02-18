import React, { useState } from "react";
import { adminHttp } from "../../api/http";
import { setAdminToken } from "../../auth/authStore";
import { useNavigate, Link } from "react-router-dom";

export default function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await adminHttp.post("/auth/logIn", {
        email,
        password,
      });
      setAdminToken(res.data.token);
      nav("/admin");
    } catch (e2) {
      setErr(e2?.response?.data?.message || e2?.response?.data?.data?.message || "Admin login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-deep-card px-8 py-9">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
          Admin / Employee sign in
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Log in to manage customers, policies, and accident workflows.
        </p>
      </header>

      {err && (
        <p className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
          {err}
        </p>
      )}

      <form className="space-y-4" onSubmit={submit}>
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-700 uppercase tracking-[0.09em]">
            Work email
          </label>
          <input
            className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/40"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="employee@company.com"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-700 uppercase tracking-[0.09em]">
            Password
          </label>
          <input
            className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/40"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <button
          className="mt-2 inline-flex w-full items-center justify-center rounded-3xl bg-emeraldAccent px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emeraldAccent/30 transition transform hover:scale-[1.02] hover:bg-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emeraldAccent/60 disabled:opacity-60 disabled:pointer-events-none"
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Customer?{" "}
        <Link className="font-semibold text-primary hover:text-blue-600" to="/login">
          Access the customer portal
        </Link>
      </p>
    </div>
  );
}

