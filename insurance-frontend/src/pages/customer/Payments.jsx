import React, { useEffect, useState } from "react";
import { customerApi } from "../../api/client";
import Table from "../../components/Table";

export default function Payments() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    customerApi
      .get("/payments")
      .then((res) => setList(res.data?.payments ?? res.data ?? []))
      .catch((err) => {
        if (err?.response?.status === 404) setList([]);
        else setError(err?.response?.data?.message || "Failed to load payments");
      })
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: "payment_id", label: "ID" },
    { key: "policy_id", label: "Policy ID" },
    { key: "amount", label: "Amount" },
    { key: "payment_date", label: "Date" },
    { key: "method", label: "Method" },
  ];

  if (loading) return <div className="rounded-xl border bg-white p-8 text-slate-500">Loading payments…</div>;
  if (error) return <div className="rounded-xl border bg-white p-8 text-red-600">{error}</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-900">My Payments</h1>
      <Table columns={columns} data={list} emptyMessage="No payments." rowKey="payment_id" />
    </div>
  );
}
