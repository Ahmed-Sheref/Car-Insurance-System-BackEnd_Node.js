import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../../api/client";
import Table from "../../components/Table";
import FormInput from "../../components/FormInput";

export default function Customers() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi
      .get("/customers")
      .then((res) => setList(res.data?.data?.customers ?? res.data?.customers ?? []))
      .catch((err) => setError(err?.response?.data?.message || "Failed to load customers"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = list.filter(
    (c) =>
      !search ||
      (c.email && c.email.toLowerCase().includes(search.toLowerCase())) ||
      (c.first_name && c.first_name.toLowerCase().includes(search.toLowerCase())) ||
      (c.second_name && c.second_name?.toLowerCase().includes(search.toLowerCase()))
  );

  const columns = [
    { key: "customer_id", label: "ID" },
    { key: "first_name", label: "First name" },
    { key: "second_name", label: "Second name" },
    { key: "email", label: "Email" },
    { key: "branch_code", label: "Branch" },
    { key: "customer_type", label: "Type" },
  ];

  if (loading) return <div className="rounded-xl border bg-white p-8 text-slate-500">Loading customers…</div>;
  if (error) return <div className="rounded-xl border bg-white p-8 text-red-600">{error}</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-900">Customers</h1>
      <FormInput placeholder="Search by email or name" value={search} onChange={setSearch} className="max-w-xs" />
      <Table
        columns={columns}
        data={filtered}
        emptyMessage="No customers."
        rowKey="customer_id"
        onRowClick={(row) => navigate(`/admin/customers/${row.customer_id}`)}
      />
    </div>
  );
}
