import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { customerApi } from "../../api/client";
import Table from "../../components/Table";

export default function Accidents() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      customerApi.get("/accident").then((r) => r.data?.data ?? r.data ?? []).catch(() => []),
      customerApi.get("/customer/car").then((r) => r.data?.data?.cars ?? r.data?.cars ?? []),
    ])
      .then(([accidents, carsList]) => {
        setList(Array.isArray(accidents) ? accidents : []);
        setCars(Array.isArray(carsList) ? carsList : []);
      })
      .catch((err) => setError(err?.response?.data?.message || "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  const carById = Object.fromEntries((cars || []).map((c) => [c.car_id, c]));

  const columns = [
    { key: "acc_id", label: "ID" },
    { key: "car_id", label: "Car", render: (val, row) => carById[row.car_id]?.model ?? row.car_id },
    { key: "policy_id", label: "Policy ID" },
    { key: "accident_date", label: "Date" },
    { key: "claim_status", label: "Claim Status" },
    { key: "claimed_amount", label: "Claimed" },
    { key: "approved_amount", label: "Approved" },
  ];

  if (loading) return <div className="rounded-xl border bg-white p-8 text-slate-500">Loading accidents…</div>;
  if (error) return <div className="rounded-xl border bg-white p-8 text-red-600">{error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">My Accidents / Claims</h1>
        <Link to="/app/accidents/new" className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-blue-600">Report Accident</Link>
      </div>
      <Table
        columns={columns}
        data={list}
        emptyMessage="No accidents reported."
        rowKey="acc_id"
        onRowClick={(row) => navigate(`/app/accidents/${row.acc_id}`)}
      />
    </div>
  );
}
