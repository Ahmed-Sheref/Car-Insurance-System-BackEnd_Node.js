import React from "react";

export default function FormInput({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  required,
  disabled,
  ...rest
}) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`block w-full rounded-xl border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary/30 ${
          error ? "border-red-500 bg-red-50" : "border-slate-200 bg-white"
        }`}
        {...rest}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
