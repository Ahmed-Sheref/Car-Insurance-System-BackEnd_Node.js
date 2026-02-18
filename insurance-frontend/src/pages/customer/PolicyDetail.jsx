import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { customerApi } from "../../api/client";

function formatDate(val) {
  if (val == null) return "—";
  const d = typeof val === "string" ? new Date(val) : val;
  return isNaN(d.getTime()) ? String(val) : d.toLocaleDateString();
}

export default function PolicyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    customerApi
      .get("/policy/policy-requests")
      .then((res) => {
        const list = res.data?.data ?? res.data ?? [];
        const found = Array.isArray(list) ? list.find((p) => String(p.request_id) === String(id)) : null;
        setPolicy(found ?? null);
      })
      .catch((err) => setError(err?.response?.data?.message || "Failed to load policy request."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-slate-500">
        Loading policy request…
      </div>
    );
  }
  if (error) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-red-600">
        {error}
      </div>
    );
  }
  if (!policy) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-slate-500">
        Policy request not found.
      </div>
    );
  }

  const carLabel = (policy.car_make && policy.car_model)
    ? `${policy.car_make} ${policy.car_model}`
    : "—";
  const proposedPremium =
    policy.proposed_premium != null
      ? Number(policy.proposed_premium).toFixed(2)
      : policy.premium != null
        ? Number(policy.premium).toFixed(2)
        : null;

  return (
    <div className="space-y-4">
      <Link to="/app/policies" className="text-sm font-medium text-primary hover:underline">
        ← Back to policy requests
      </Link>
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h1 className="text-xl font-semibold text-slate-900">Policy request #{policy.request_id}</h1>
        <dl className="mt-4 grid gap-2 text-sm">
          <div>
            <dt className="text-slate-500">Car</dt>
            <dd className="font-medium text-slate-900">{carLabel}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Status</dt>
            <dd className="font-medium text-slate-900">{policy.status ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Coverage type</dt>
            <dd className="font-medium text-slate-900">{policy.coverage_type ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Start date</dt>
            <dd className="font-medium text-slate-900">{formatDate(policy.start_date)}</dd>
          </div>
          <div>
            <dt className="text-slate-500">End date</dt>
            <dd className="font-medium text-slate-900">{formatDate(policy.end_date)}</dd>
          </div>
          {proposedPremium != null && (
            <div>
              <dt className="text-slate-500">Proposed premium</dt>
              <dd className="font-medium text-slate-900">{proposedPremium}</dd>
            </div>
          )}
        </dl>
        <div className="mt-6">
          <button
            type="button"
            onClick={() => navigate(`/app/accidents/new?policy_id=${policy.request_id}`)}
            className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
          >
            Report accident
          </button>
        </div>
      </div>
    </div>
  );
}
