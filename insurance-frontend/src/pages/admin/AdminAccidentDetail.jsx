import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { adminApi } from "../../api/client";
import FormInput from "../../components/FormInput";
import Select from "../../components/Select";
import { useToast } from "../../components/Toast";

export default function AdminAccidentDetail() {
  const { id } = useParams();
  const [accident, setAccident] = useState(null);
  const [images, setImages] = useState([]);
  const [claim_status, setClaim_status] = useState("Pending");
  const [approved_amount, setApproved_amount] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const { show: showToast } = useToast();

  useEffect(() => {
    if (!id) return;
    Promise.all([
      adminApi.get(`/accidents/${id}`).then((r) => r.data?.accident ?? r.data),
      adminApi.get(`/accidents/${id}/images`).then((r) => r.data?.images ?? r.data ?? []).catch(() => []),
    ])
      .then(([acc, imgs]) => {
        setAccident(acc);
        setClaim_status(acc?.claim_status ?? "Pending");
        setApproved_amount(acc?.approved_amount ?? "");
        setImages(Array.isArray(imgs) ? imgs : []);
      })
      .catch((err) => setError(err?.response?.data?.message || "Failed to load"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    const payload = { claim_status, approved_amount: claim_status === "Approved" ? approved_amount : undefined };
    adminApi
      .put(`/accidents/${id}`, payload)
      .then(() => {
        showToast("Claim updated", "success");
        setAccident((prev) => (prev ? { ...prev, ...payload } : null));
      })
      .catch((err) => showToast(err?.response?.data?.message || "Update failed", "error"))
      .finally(() => setSubmitLoading(false));
  };

  if (loading) return <div className="rounded-xl border bg-white p-8 text-slate-500">Loading…</div>;
  if (error) return <div className="rounded-xl border bg-white p-8 text-red-600">{error}</div>;
  if (!accident) return <div className="rounded-xl border bg-white p-8 text-slate-500">Accident not found.</div>;

  return (
    <div className="space-y-6">
      <Link to="/admin/accidents" className="text-sm text-slate-600 hover:underline">← Back to Accidents</Link>
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h1 className="text-xl font-semibold text-slate-900">Claim #{accident.acc_id}</h1>
        <dl className="mt-4 grid gap-2 text-sm">
          <div><dt className="text-slate-500">Date</dt><dd>{accident.accident_date}</dd></div>
          <div><dt className="text-slate-500">Location</dt><dd>{accident.location}</dd></div>
          <div><dt className="text-slate-500">Description</dt><dd>{accident.acc_description}</dd></div>
          <div><dt className="text-slate-500">Car ID</dt><dd>{accident.car_id}</dd></div>
          <div><dt className="text-slate-500">Policy ID</dt><dd>{accident.policy_id}</dd></div>
          <div><dt className="text-slate-500">Claimed amount</dt><dd>{accident.claimed_amount}</dd></div>
        </dl>
        {images.length > 0 && (
          <div className="mt-4">
            <p className="text-slate-500 text-sm">Images: {images.length}</p>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold text-slate-900">Review claim</h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <Select
            label="Claim status"
            value={claim_status}
            onChange={setClaim_status}
            options={[
              { value: "Pending", label: "Pending" },
              { value: "Approved", label: "Approved" },
              { value: "Rejected", label: "Rejected" },
            ]}
          />
          {claim_status === "Approved" && (
            <FormInput label="Approved amount" type="number" value={approved_amount} onChange={setApproved_amount} required />
          )}
          <button type="submit" disabled={submitLoading} className="rounded-xl bg-slate-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">Save</button>
        </form>
      </div>
    </div>
  );
}
