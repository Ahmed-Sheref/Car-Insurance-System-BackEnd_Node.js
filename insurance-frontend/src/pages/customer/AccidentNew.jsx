import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { customerApi } from "../../api/client";
import FormInput from "../../components/FormInput";
import Select from "../../components/Select";
import { useToast } from "../../components/Toast";

export default function AccidentNew() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedPolicyId = searchParams.get("policy_id");
  const preselectedCarId = searchParams.get("car_id");

  const [cars, setCars] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [car_id, setCar_id] = useState(preselectedCarId || "");
  const [policy_id, setPolicy_id] = useState(preselectedPolicyId || "");
  const [accident_date, setAccident_date] = useState("");
  const [location, setLocation] = useState("");
  const [acc_description, setAcc_description] = useState("");
  const [claimed_amount, setClaimed_amount] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const { show: showToast } = useToast();

  useEffect(() => {
    customerApi.get("/customer/car").then((r) => setCars(r.data?.data?.cars ?? r.data?.cars ?? [])).catch(() => setCars([]));
    customerApi.get("/policy/policy-requests").then((r) => setPolicies(r.data?.data ?? r.data ?? [])).catch(() => setPolicies([]));
    setDataLoading(false);
  }, []);

  useEffect(() => {
    if (preselectedCarId) setCar_id(preselectedCarId);
    if (preselectedPolicyId) setPolicy_id(preselectedPolicyId);
  }, [preselectedCarId, preselectedPolicyId]);

  const policyOptions = policies.map((p) => ({ value: String(p.request_id), label: `Request #${p.request_id} (${p.car_make || ""} ${p.car_model || ""})` }));
  const carOptions = cars.map((c) => ({ value: String(c.car_id), label: `${c.model} (${c.year})` }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const customerRes = await customerApi.get("/customer/me");
      const customerId = customerRes.data?.data?.customer_id ?? customerRes.data?.customer_id;
      const form = new FormData();
      form.append("acc_description", acc_description);
      form.append("location", location);
      form.append("accident_date", accident_date);
      form.append("car_id", car_id);
      form.append("customer_id", customerId);
      const fileInput = document.querySelector('input[name="acc_image"]');
      if (fileInput?.files?.[0]) form.append("acc_image", fileInput.files[0]);

      const res = await customerApi.post("/accident", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const id = res.data?.accident?.acc_id ?? res.data?.acc_id;
      showToast("Accident reported", "success");
      navigate(id ? `/app/accidents/${id}` : "/app/accidents");
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to report accident", "error");
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) return <div className="rounded-xl border bg-white p-8 text-slate-500">Loading…</div>;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <h1 className="text-xl font-semibold text-slate-900">Report Accident</h1>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <Select label="Car" value={car_id} onChange={(v) => { setCar_id(v); setPolicy_id(""); }} options={carOptions} required />
        <Select label="Policy" value={policy_id} onChange={setPolicy_id} options={policyOptions} required />
        <FormInput label="Accident date" type="date" value={accident_date} onChange={setAccident_date} required />
        <FormInput label="Location" value={location} onChange={setLocation} required />
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">Description *</label>
          <textarea value={acc_description} onChange={(e) => setAcc_description(e.target.value)} required className="block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" rows={3} />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">Photo (acc_image) *</label>
          <input name="acc_image" type="file" accept="image/*" required className="block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
        </div>
        <FormInput label="Claimed amount" type="number" value={claimed_amount} onChange={setClaimed_amount} />
        <div className="flex gap-2">
          <button type="submit" disabled={loading} className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-60">Submit</button>
          <button type="button" onClick={() => navigate("/app/accidents")} className="rounded-xl border border-slate-200 px-4 py-2 text-sm">Cancel</button>
        </div>
      </form>
    </div>
  );
}
