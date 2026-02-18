import React, { useEffect, useState } from "react";
import { customerApi } from "../../api/client";
import Table from "../../components/Table";
import Modal from "../../components/Modal";
import ModalConfirm from "../../components/ModalConfirm";
import FormInput from "../../components/FormInput";
import { useToast } from "../../components/Toast";

export default function Cars() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [vin, setVin] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { show: showToast } = useToast();

  const load = () => {
    setLoading(true);
    customerApi
      .get("/customer/car")
      .then((res) => setList(res.data?.data?.cars ?? res.data?.cars ?? []))
      .catch((err) => setError(err?.response?.data?.message || "Failed to load cars"))
      .finally(() => setLoading(false));
  };

  useEffect(() => load(), []);

  const openAdd = () => {
    setEditId(null);
    setVin("");
    setMake("");
    setModel("");
    setYear("");
    setModalOpen(true);
  };
  const openEdit = (row) => {
    setEditId(row.car_id);
    setMake(row.make ?? "");
    setModel(row.model ?? "");
    setYear(row.year ?? "");
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    if (editId) {
      customerApi
        .patch(`/customer/car/${editId}`, {
          make: make.trim() || undefined,
          model: model.trim() || undefined,
          year: year ? Number(year) : undefined,
        })
        .then(() => {
          showToast("Car updated", "success");
          setModalOpen(false);
          load();
        })
        .catch((err) => showToast(err?.response?.data?.message || "Update failed", "error"))
        .finally(() => setSubmitLoading(false));
    } else {
      customerApi
        .post("/customer/car", { vin: vin.trim() })
        .then(() => {
          showToast("Car added", "success");
          setModalOpen(false);
          load();
        })
        .catch((err) => showToast(err?.response?.data?.message || "Add failed", "error"))
        .finally(() => setSubmitLoading(false));
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    customerApi
      .delete(`/customer/car/${deleteTarget.car_id}`)
      .then(() => {
        showToast("Car deleted", "success");
        setDeleteTarget(null);
        load();
      })
      .catch((err) => showToast(err?.response?.data?.message || "Delete failed", "error"));
  };

  const columns = [
    { key: "car_id", label: "ID" },
    { key: "make", label: "Make" },
    { key: "model", label: "Model" },
    { key: "year", label: "Year" },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <span className="flex gap-2">
          <button type="button" className="text-primary hover:underline" onClick={(e) => { e.stopPropagation(); openEdit(row); }}>Edit</button>
          <button type="button" className="text-red-600 hover:underline" onClick={(e) => { e.stopPropagation(); setDeleteTarget(row); }}>Delete</button>
        </span>
      ),
    },
  ];

  if (loading) return <div className="rounded-xl border bg-white p-8 text-slate-500">Loading cars…</div>;
  if (error) return <div className="rounded-xl border bg-white p-8 text-red-600">{error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">My Cars</h1>
        <button type="button" onClick={openAdd} className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-blue-600">Add Car</button>
      </div>
      <Table columns={columns} data={list} emptyMessage="No cars. Add your first car by entering its VIN." rowKey="car_id" />

      <Modal open={modalOpen} title={editId ? "Edit Car" : "Add Car"} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {editId ? (
            <>
              <FormInput label="Make" value={make} onChange={setMake} placeholder="e.g. Toyota" />
              <FormInput label="Model" value={model} onChange={setModel} required />
              <FormInput label="Year" type="number" value={year} onChange={setYear} placeholder="e.g. 2020" />
            </>
          ) : (
            <FormInput
              label="VIN (17 characters)"
              value={vin}
              onChange={setVin}
              placeholder="e.g. 1HGBH41JXMN109186"
              maxLength={17}
              required
            />
          )}
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setModalOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm">Cancel</button>
            <button type="submit" disabled={submitLoading} className="rounded-xl bg-primary px-4 py-2 text-sm text-white disabled:opacity-60">Save</button>
          </div>
        </form>
      </Modal>

      <ModalConfirm
        open={!!deleteTarget}
        title="Delete Car"
        message={deleteTarget ? `Delete car ${deleteTarget.make || ""} ${deleteTarget.model} (${deleteTarget.year})?` : ""}
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
