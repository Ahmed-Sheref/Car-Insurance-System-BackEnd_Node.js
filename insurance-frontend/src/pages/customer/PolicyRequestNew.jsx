import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { customerApi } from "../../api/client";
import FormInput from "../../components/FormInput";
import Select from "../../components/Select";
import { useToast } from "../../components/Toast";

const COVERAGE_OPTIONS = [
  { value: "ThirdParty", label: "Third Party" },
  { value: "Full", label: "Full" },
];

export default function PolicyRequestNew() {
  const navigate = useNavigate();
  const { show: showToast } = useToast();
  const [cars, setCars] = useState([]);
  const [car_id, setCar_id] = useState("");
  const [coverage_type, setCoverage_type] = useState("");
  const [start_date, setStart_date] = useState("");
  const [end_date, setEnd_date] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    customerApi
      .get("/customer/car")
      .then((r) => setCars(r.data?.data?.cars ?? r.data?.cars ?? []))
      .catch(() => setCars([]))
      .finally(() => setDataLoading(false));
  }, []);

  const carOptions = cars.map((c) => ({
    value: String(c.car_id),
    label: `${c.make || ""} ${c.model || ""} (${c.year || ""})`.trim() || `Car #${c.car_id}`,
  }));

  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    const body = {
      car_id: Number(car_id),
      coverage_type: coverage_type.trim(),
      start_date: start_date.trim(),
      end_date: end_date.trim(),
    };
    customerApi
      .post("/policy/policy-requests", body)
      .then((res) => {
        const data = res.data?.data ?? res.data;
        const request = res.data?.request ?? data?.request;
        const proposedPremium = request?.proposed_premium ?? data?.premium;
        showToast(
          proposedPremium != null
            ? `Request created. Proposed premium: ${Number(proposedPremium).toFixed(2)}`
            : "Request created.",
          "success"
        );
        navigate("/app/policies");
      })
      .catch((err) =>
        showToast(
          err?.response?.data?.message || "Failed to create policy request",
          "error"
        )
      )
      .finally(() => setLoading(false));
  };

  if (dataLoading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-slate-500">
        Loading…
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold text-slate-900">New policy request</h1>
        <Link
          to="/app/policies"
          className="text-sm font-medium text-primary hover:underline"
        >
          ← Back to requests
        </Link>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <p className="mb-6 text-sm text-slate-600">
          Choose your car, coverage type, and policy period. No payment is taken when creating the request.
        </p>
        <form onSubmit={submit} className="max-w-md space-y-4">
          <Select
            label="Car"
            value={car_id}
            onChange={setCar_id}
            options={carOptions}
            placeholder="Select car"
            required
          />
          <Select
            label="Coverage type"
            value={coverage_type}
            onChange={setCoverage_type}
            options={COVERAGE_OPTIONS}
            placeholder="Select coverage type"
            required
          />
          <FormInput
            label="Start date"
            type="date"
            value={start_date}
            onChange={setStart_date}
            required
          />
          <FormInput
            label="End date"
            type="date"
            value={end_date}
            onChange={setEnd_date}
            required
          />
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-60"
            >
              {loading ? "Submitting…" : "Create request"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/app/policies")}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
