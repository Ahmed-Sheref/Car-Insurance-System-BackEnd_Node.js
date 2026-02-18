import React from "react";

export default function Select({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Select...",
  error,
  required,
  disabled,
}) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}
      <select
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className={`block w-full rounded-xl border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary/30 ${
          error ? "border-red-500 bg-red-50" : "border-slate-200 bg-white"
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
