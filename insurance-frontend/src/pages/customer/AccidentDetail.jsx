import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { customerApi } from "../../api/client";
import { useToast } from "../../components/Toast";

export default function AccidentDetail() {
  const { id } = useParams();
  const [accident, setAccident] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const { show: showToast } = useToast();

  const load = () => {
    if (!id) return;
    Promise.all([
      customerApi.get(`/accidents/${id}`).then((r) => r.data?.accident ?? r.data),
      customerApi.get(`/accidents/${id}/images`).then((r) => r.data?.images ?? r.data ?? []).catch(() => []),
    ])
      .then(([acc, imgs]) => {
        setAccident(acc);
        setImages(Array.isArray(imgs) ? imgs : []);
      })
      .catch((err) => setError(err?.response?.data?.message || "Failed to load"))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const onFileChange = (e) => {
    const files = e.target.files;
    if (!files?.length) return;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) formData.append("images[]", files[i]);
    setUploading(true);
    customerApi
      .post(`/accidents/${id}/images`, formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then(() => {
        showToast("Images uploaded", "success");
        load();
      })
      .catch((err) => showToast(err?.response?.data?.message || "Upload failed", "error"))
      .finally(() => setUploading(false));
  };

  if (loading) return <div className="rounded-xl border bg-white p-8 text-slate-500">Loading…</div>;
  if (error) return <div className="rounded-xl border bg-white p-8 text-red-600">{error}</div>;
  if (!accident) return <div className="rounded-xl border bg-white p-8 text-slate-500">Accident not found.</div>;

  return (
    <div className="space-y-6">
      <Link to="/app/accidents" className="text-sm text-primary hover:underline">← Back to Accidents</Link>
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h1 className="text-xl font-semibold text-slate-900">Accident / Claim #{accident.acc_id}</h1>
        <dl className="mt-4 grid gap-2 text-sm">
          <div><dt className="text-slate-500">Date</dt><dd>{accident.accident_date}</dd></div>
          <div><dt className="text-slate-500">Location</dt><dd>{accident.location}</dd></div>
          <div><dt className="text-slate-500">Description</dt><dd>{accident.acc_description}</dd></div>
          <div><dt className="text-slate-500">Car ID</dt><dd>{accident.car_id}</dd></div>
          <div><dt className="text-slate-500">Policy ID</dt><dd>{accident.policy_id}</dd></div>
          <div><dt className="text-slate-500">Claim status</dt><dd>{accident.claim_status ?? "Pending"}</dd></div>
          <div><dt className="text-slate-500">Claimed amount</dt><dd>{accident.claimed_amount}</dd></div>
          <div><dt className="text-slate-500">Approved amount</dt><dd>{accident.approved_amount ?? "—"}</dd></div>
        </dl>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold text-slate-900">Images</h2>
        <label className="mt-2 inline-block rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm cursor-pointer hover:bg-slate-100">
          <input type="file" multiple accept="image/*" onChange={onFileChange} disabled={uploading} className="hidden" />
          {uploading ? "Uploading…" : "Upload images"}
        </label>
        <div className="mt-4 flex flex-wrap gap-4">
          {images.length === 0 && <p className="text-slate-500 text-sm">No images yet.</p>}
          {images.map((img, i) => (
            <div key={img.image_id ?? i} className="h-24 w-24 rounded-lg border bg-slate-100 overflow-hidden">
              {img.image_url ? <img src={img.image_url} alt="" className="h-full w-full object-cover" /> : <span className="flex h-full items-center justify-center text-xs text-slate-400">Image</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
