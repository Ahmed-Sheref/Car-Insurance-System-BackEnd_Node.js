import React, { useEffect, useState } from "react";
import { adminApi } from "../../api/client";
import Table from "../../components/Table";
import Modal from "../../components/Modal";
import FormInput from "../../components/FormInput";
import Select from "../../components/Select";
import { useToast } from "../../components/Toast";
function formatDate(val) {
  if (val == null) return "—";
  const d = typeof val === "string" ? new Date(val) : val;
  return isNaN(d.getTime()) ? String(val) : d.toLocaleDateString();
}
const STATUS_OPTIONS = [
  { value: "Active", label: "Active" },
  { value: "Expired", label: "Expired" },
  { value: "Cancelled", label: "Cancelled" },
  { value: "Pending", label: "Pending" },
];

export default function AdminPolicies() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [car_id, setCar_id] = useState("");
  const [coverage_type, setCoverage_type] = useState("");
  const [start_date, setStart_date] = useState("");
  const [end_date, setEnd_date] = useState("");
  const [premium, setPremium] = useState("");
  const [max_coverage, setMax_coverage] = useState("");
  const [status, setStatus] = useState("Active");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const { show: showToast } = useToast();

  const load = () => {
    setLoading(true);
    adminApi
      .get("/policies")
      .then((res) => setList(res.data?.policies ?? res.data ?? []))
      .catch((err) => setError(err?.response?.data?.message || "Failed to load policies"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    load();
    return () => {
      setLoading(false);
    };
  }, []);

  const filtered = filterStatus ? list.filter((p) => (p.status || "").toLowerCase() === filterStatus.toLowerCase()) : list;

  const openCreate = () => {
    setEditId(null);
    setCar_id("");
    setCoverage_type("");
    setStart_date("");
    setEnd_date("");
    setPremium("");
    setMax_coverage("");
    setStatus("Active");
    setModalOpen(true);
  };
  const openEdit = (row) => {
    setEditId(row.policy_id);
    setCar_id(row.car_id ?? "");
    setCoverage_type(row.coverage_type ?? "");
    setStart_date(row.start_date ?? "");
    setEnd_date(row.end_date ?? "");
    setPremium(row.premium ?? "");
    setMax_coverage(row.max_coverage ?? "");
    setStatus(row.status ?? "Active");
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    const payload = { car_id: car_id ? Number(car_id) : undefined, coverage_type, start_date, end_date, premium: premium ? Number(premium) : undefined, max_coverage: max_coverage ? Number(max_coverage) : undefined, status };
    const req = editId ? adminApi.put(`/policies/${editId}`, payload) : adminApi.post("/policies", payload);
    req
      .then(() => {
        showToast(editId ? "Policy updated" : "Policy created", "success");
        setModalOpen(false);
        load();
      })
      .catch((err) => showToast(err?.response?.data?.message || "Request failed", "error"))
      .finally(() => setSubmitLoading(false));
  };

  const columns = [
    { key: "policy_id", label: "ID" },
    { key: "car_id", label: "Car ID" },
    { key: "status", label: "Status" },
    { key: "coverage_type", label: "Coverage" },
    { key: "start_date", label: "Start", render: (val) => formatDate(val) ?? "—" },
    { key: "end_date", label: "End", render: (val) => formatDate(val) ?? "—" },
    { key: "premium", label: "Premium", render: (val) => Number(val).toFixed(2) ?? "—" },
    { key: "max_coverage", label: "Max Coverage", render: (val) => Number(val).toFixed(2) ?? "—" },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <button type="button" className="text-primary hover:underline" onClick={() => openEdit(row)}>Edit</button>
      ),
    },
  ];

  if (loading) return <div className="rounded-xl border bg-white p-8 text-slate-500">Loading policies…</div>;
  if (error) return <div className="rounded-xl border bg-white p-8 text-red-600">{error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Policies</h1>
        <button type="button" onClick={openCreate} className="rounded-xl bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-600">Create Policy</button>
      </div>
      <Select label="Filter by status" value={filterStatus} onChange={setFilterStatus} options={[{ value: "", label: "All" }, ...STATUS_OPTIONS]} />
      <Table columns={columns} data={filtered} emptyMessage="No policies." rowKey="policy_id" onRowClick={(row) => openEdit(row)} />

      <Modal open={modalOpen} title={editId ? "Edit Policy" : "Create Policy"} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput label="Car ID" type="number" value={car_id} onChange={setCar_id} />
          <FormInput label="Coverage type" value={coverage_type} onChange={setCoverage_type} />
          <FormInput label="Start date" type="date" value={start_date} onChange={setStart_date} required />
          <FormInput label="End date" type="date" value={end_date} onChange={setEnd_date} required />
          <FormInput label="Premium" type="number" value={premium} onChange={setPremium} />
          <FormInput label="Max coverage" type="number" value={max_coverage} onChange={setMax_coverage} />
          <Select label="Status" value={status} onChange={setStatus} options={STATUS_OPTIONS} />
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setModalOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm">Cancel</button>
            <button type="submit" disabled={submitLoading} className="rounded-xl bg-slate-700 px-4 py-2 text-sm text-white disabled:opacity-60">Save</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
