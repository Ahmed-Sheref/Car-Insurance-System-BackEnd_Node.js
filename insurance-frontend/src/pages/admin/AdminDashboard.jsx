import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../../api/client";

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ customers: 0, policies: 0, accidentsPending: 0, payments: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      adminApi.get("/admin/customers").then((r) => r.data?.customers ?? r.data ?? []).catch(() => []),
      adminApi.get("/admin/policies").then((r) => r.data?.policies ?? r.data ?? []).catch(() => []),
      adminApi.get("/admin/accidents").then((r) => r.data?.accidents ?? r.data ?? []).catch(() => []),
      adminApi.get("/admin/payments").then((r) => r.data?.payments ?? r.data ?? []).catch(() => []),
    ])
      .then(([customers, policies, accidents, payments]) => {
        setCounts({
          customers: Array.isArray(customers) ? customers.length : 0,
          policies: Array.isArray(policies) ? policies.length : 0,
          accidentsPending: Array.isArray(accidents) ? accidents.filter((a) => (a.claim_status || "").toLowerCase() === "pending").length : 0,
          payments: Array.isArray(payments) ? payments.length : 0,
        });
      })
      .catch((err) => setError(err?.response?.data?.message || "Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="rounded-xl border bg-white p-8 text-slate-500">Loading dashboard…</div>;
  if (error) return <div className="rounded-xl border bg-white p-8 text-red-600">{error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Admin Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link to="/admin/customers" className="rounded-xl border border-slate-200 bg-white p-6 hover:border-slate-300">
          <p className="text-3xl font-bold text-slate-800">{counts.customers}</p>
          <p className="mt-1 text-sm text-slate-600">Customers</p>
        </Link>
        <Link to="/admin/policies" className="rounded-xl border border-slate-200 bg-white p-6 hover:border-slate-300">
          <p className="text-3xl font-bold text-slate-800">{counts.policies}</p>
          <p className="mt-1 text-sm text-slate-600">Policies</p>
        </Link>
        <Link to="/admin/accidents" className="rounded-xl border border-slate-200 bg-white p-6 hover:border-slate-300">
          <p className="text-3xl font-bold text-amber-600">{counts.accidentsPending}</p>
          <p className="mt-1 text-sm text-slate-600">Accidents Pending</p>
        </Link>
        <Link to="/admin/payments" className="rounded-xl border border-slate-200 bg-white p-6 hover:border-slate-300">
          <p className="text-3xl font-bold text-slate-800">{counts.payments}</p>
          <p className="mt-1 text-sm text-slate-600">Payments</p>
        </Link>
      </div>
      <div className="flex gap-3">
        <Link to="/admin/customers" className="rounded-xl bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-600">Customers</Link>
        <Link to="/admin/policies" className="rounded-xl bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-600">Policies</Link>
        <Link to="/admin/accidents" className="rounded-xl bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-600">Accidents</Link>
        <Link to="/admin/payments" className="rounded-xl bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-600">Payments</Link>
      </div>
    </div>
  );
}
