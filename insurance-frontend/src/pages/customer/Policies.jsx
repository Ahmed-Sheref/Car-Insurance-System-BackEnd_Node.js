import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { customerApi } from "../../api/client";
import Table from "../../components/Table";

function formatDate(val) {
  if (val == null) return "—";
  const d = typeof val === "string" ? new Date(val) : val;
  return isNaN(d.getTime()) ? String(val) : d.toLocaleDateString();
}

function fetchPolicyRequests() {
  return customerApi
    .get("/policy/policy-requests")
    .then((r) => {
      const raw = r.data?.data ?? r.data;
      return Array.isArray(raw) ? raw : [];
    });
}

export default function Policies() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const load = () => {
    setError("");
    return fetchPolicyRequests()
      .then(setList)
      .catch((err) => {
        setList([]);
        if (err?.response?.status === 401) {
          setError("Please sign in again.");
        } else {
          setError(err?.response?.data?.message || "Failed to load policy requests.");
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    load();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPolicyRequests()
      .then((data) => {
        setList(data);
        setError("");
      })
      .catch((err) => {
        setError(err?.response?.data?.message || "Failed to load.");
      })
      .finally(() => setRefreshing(false));
  };

  const columns = [
    { key: "request_id", label: "Request ID" },
    { key: "car_make", label: "Make" },
    { key: "car_model", label: "Model" },
    { key: "status", label: "Status" },
    { key: "coverage_type", label: "Coverage" },
    { key: "start_date", label: "Start", render: (val) => formatDate(val) },
    { key: "end_date", label: "End", render: (val) => formatDate(val) },
    {
      key: "proposed_premium",
      label: "Proposed Premium",
      render: (val, row) =>
        val != null ? Number(val).toFixed(2) : (row.premium != null ? Number(row.premium).toFixed(2) : "—"),
    },
  ];

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-slate-500">
        Loading policy requests…
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

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-semibold text-slate-900">Policy requests</h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>
          <Link
            to="/app/policies/new"
            className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
          >
            New policy request
          </Link>
        </div>
      </div>
      <Table
        columns={columns}
        data={list}
        emptyMessage="No policy requests. Create one to get started."
        rowKey="request_id"
        onRowClick={(row) => navigate(`/app/policies/${row.request_id}`)}
      />
    </div>
  );
}
