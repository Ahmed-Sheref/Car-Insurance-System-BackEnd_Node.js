import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../../api/client";
import Table from "../../components/Table";
import Select from "../../components/Select";

export default function AdminAccidents() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("Pending");

  useEffect(() => {
    adminApi
      .get("/accidents")
      .then((res) => setList(res.data?.accidents ?? res.data ?? []))
      .catch((err) => setError(err?.response?.data?.message || "Failed to load accidents"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filterStatus ? list.filter((a) => (a.claim_status || "Pending").toLowerCase() === filterStatus.toLowerCase()) : list;

  const columns = [
    { key: "acc_id", label: "ID" },
    { key: "car_id", label: "Car ID" },
    { key: "policy_id", label: "Policy ID" },
    { key: "accident_date", label: "Date" },
    { key: "claim_status", label: "Status" },
    { key: "claimed_amount", label: "Claimed" },
    { key: "approved_amount", label: "Approved" },
  ];

  if (loading) return <div className="rounded-xl border bg-white p-8 text-slate-500">Loading accidents…</div>;
  if (error) return <div className="rounded-xl border bg-white p-8 text-red-600">{error}</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-900">Accidents / Claims</h1>
      <Select
        label="Filter by claim status"
        value={filterStatus}
        onChange={setFilterStatus}
        options={[
          { value: "", label: "All" },
          { value: "Pending", label: "Pending" },
          { value: "Approved", label: "Approved" },
          { value: "Rejected", label: "Rejected" },
        ]}
      />
      <Table
        columns={columns}
        data={filtered}
        emptyMessage="No accidents."
        rowKey="acc_id"
        onRowClick={(row) => navigate(`/admin/accidents/${row.acc_id}`)}
      />
    </div>
  );
}
