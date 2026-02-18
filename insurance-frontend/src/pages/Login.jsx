import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, API_BASE } from "../api/client";
import { setCustomerToken } from "../auth/authStore";
import FormInput from "../components/FormInput";

export default function Login() {
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
      // Backend: POST /api/v1/auth/logIn -> { status, data: { customer_id, email, token } }
      const res = await api.post("/auth/logIn", { email, password });
      const token = res.data?.data?.token ?? res.data?.token;
      if (token) {
        setCustomerToken(token);
        nav("/app");
      } else {
        setError("No token received");
      }
    } catch (err) {
      const msg = err?.response?.data?.message ?? err?.response?.data?.error ?? err?.message;
      setError(msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
      <h1 className="text-2xl font-semibold text-slate-900">Customer Login</h1>
      <p className="mt-1 text-sm text-slate-500">Sign in with your email</p>

      {error && (
        <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      <form onSubmit={submit} className="mt-6 space-y-4">
        <FormInput
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
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
          className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>

        <div className="relative my-4">
          <span className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200" />
          </span>
          <span className="relative flex justify-center text-xs font-medium uppercase tracking-wide text-slate-400">
            or
          </span>
        </div>

        <a
          href={`${API_BASE}/auth/google`}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Sign in with Google
        </a>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        No account? <Link to="/signup" className="font-medium text-primary hover:underline">Sign up</Link>
      </p>
    </div>
  );
}
