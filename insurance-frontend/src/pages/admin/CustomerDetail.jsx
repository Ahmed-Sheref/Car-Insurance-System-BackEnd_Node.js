import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { adminApi } from "../../api/client";

export default function CustomerDetail() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    adminApi
      .get(`/customers/${id}`)
      .then((res) => setCustomer(res.data?.customer ?? res.data))
      .catch((err) => setError(err?.response?.data?.message || "Failed to load customer"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="rounded-xl border bg-white p-8 text-slate-500">Loading…</div>;
  if (error) return <div className="rounded-xl border bg-white p-8 text-red-600">{error}</div>;
  if (!customer) return <div className="rounded-xl border bg-white p-8 text-slate-500">Customer not found.</div>;

  return (
    <div className="space-y-4">
      <Link to="/admin/customers" className="text-sm text-slate-600 hover:underline">← Back to Customers</Link>
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h1 className="text-xl font-semibold text-slate-900">Customer #{customer.customer_id}</h1>
        <dl className="mt-4 grid gap-2 text-sm">
          <div><dt className="text-slate-500">First name</dt><dd>{customer.first_name}</dd></div>
          <div><dt className="text-slate-500">Second name</dt><dd>{customer.second_name ?? "—"}</dd></div>
          <div><dt className="text-slate-500">Email</dt><dd>{customer.email}</dd></div>
          <div><dt className="text-slate-500">Branch</dt><dd>{customer.branch_code}</dd></div>
          <div><dt className="text-slate-500">Customer type</dt><dd>{customer.customer_type}</dd></div>
        </dl>
      </div>
    </div>
  );
}
