import React, { useEffect, useState } from "react";
import { adminApi } from "../../api/client";
import Table from "../../components/Table";
import Modal from "../../components/Modal";
import FormInput from "../../components/FormInput";
import Select from "../../components/Select";
import { useToast } from "../../components/Toast";

export default function AdminPayments() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [policy_id, setPolicy_id] = useState("");
  const [amount, setAmount] = useState("");
  const [payment_date, setPayment_date] = useState("");
  const [method, setMethod] = useState("card");
  const [submitLoading, setSubmitLoading] = useState(false);
  const { show: showToast } = useToast();

  const load = () => {
    setLoading(true);
    adminApi
      .get("/admin/payments")
      .then((res) => setList(res.data?.payments ?? res.data ?? []))
      .catch((err) => setError(err?.response?.data?.message || "Failed to load payments"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    adminApi
      .post("/admin/payments", { policy_id: Number(policy_id), amount: Number(amount), payment_date, method })
      .then(() => {
        showToast("Payment created", "success");
        setModalOpen(false);
        setPolicy_id("");
        setAmount("");
        setPayment_date("");
        setMethod("card");
        load();
      })
      .catch((err) => showToast(err?.response?.data?.message || "Create failed", "error"))
      .finally(() => setSubmitLoading(false));
  };

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
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Payments</h1>
        <button type="button" onClick={() => setModalOpen(true)} className="rounded-xl bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-600">Create Payment</button>
      </div>
      <Table columns={columns} data={list} emptyMessage="No payments." rowKey="payment_id" />

      <Modal open={modalOpen} title="Create Payment" onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput label="Policy ID" type="number" value={policy_id} onChange={setPolicy_id} required />
          <FormInput label="Amount" type="number" value={amount} onChange={setAmount} required />
          <FormInput label="Payment date" type="date" value={payment_date} onChange={setPayment_date} required />
          <Select
            label="Method"
            value={method}
            onChange={setMethod}
            options={[
              { value: "card", label: "Card" },
              { value: "cash", label: "Cash" },
              { value: "bank", label: "Bank transfer" },
            ]}
          />
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setModalOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm">Cancel</button>
            <button type="submit" disabled={submitLoading} className="rounded-xl bg-slate-700 px-4 py-2 text-sm text-white disabled:opacity-60">Create</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
