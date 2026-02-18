import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { customerApi } from "../../api/client";

export default function CustomerDashboard() {
  const [profile, setProfile] = useState(null);
  const [counts, setCounts] = useState({ cars: 0, policies: 0, accidents: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      customerApi.get("/customer/me").then((r) => r.data),
      customerApi.get("/customer/car").then((r) => r.data?.data?.cars ?? r.data?.cars ?? []).catch(() => []),
      customerApi.get("/policy/policy-requests").then((r) => r.data?.data ?? r.data ?? []).catch(() => []),
      customerApi.get("/accident").then((r) => r.data?.data ?? r.data ?? []).catch(() => []),
    ])
      .then(([meData, cars, policies, accidents]) => {
        setProfile(meData?.data ?? meData);
        setCounts({
          cars: Array.isArray(cars) ? cars.length : 0,
          policies: Array.isArray(policies) ? policies.length : 0,
          accidents: Array.isArray(accidents) ? accidents.length : 0,
        });
      })
      .catch((err) => setError(err?.response?.data?.message || "Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="rounded-xl border border-slate-200 bg-white p-8 text-slate-500">Loading dashboard…</div>;
  }
  if (error) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const name = (profile?.first_name && (profile?.second_name ? `${profile.first_name} ${profile.second_name}` : profile.first_name)) || "Customer";

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-semibold text-slate-900">Welcome, {name}</h1>
        <p className="mt-1 text-sm text-slate-500">{profile?.email}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link to="/app/cars" className="rounded-xl border border-slate-200 bg-white p-6 hover:border-primary/40">
          <p className="text-3xl font-bold text-primary">{counts.cars}</p>
          <p className="mt-1 text-sm text-slate-600">Cars</p>
        </Link>
        <Link to="/app/policies" className="rounded-xl border border-slate-200 bg-white p-6 hover:border-primary/40">
          <p className="text-3xl font-bold text-primary">{counts.policies}</p>
          <p className="mt-1 text-sm text-slate-600">Policies</p>
        </Link>
        <Link to="/app/accidents" className="rounded-xl border border-slate-200 bg-white p-6 hover:border-primary/40">
          <p className="text-3xl font-bold text-primary">{counts.accidents}</p>
          <p className="mt-1 text-sm text-slate-600">Accidents / Claims</p>
        </Link>
      </div>

      <div className="flex gap-3">
        <Link to="/app/cars" className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-blue-600">Cars</Link>
        <Link to="/app/policies" className="rounded-xl bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-300">Policies</Link>
        <Link to="/app/accidents" className="rounded-xl bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-300">Accidents</Link>
        <Link to="/app/payments" className="rounded-xl bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-300">Payments</Link>
      </div>
    </div>
  );
}
