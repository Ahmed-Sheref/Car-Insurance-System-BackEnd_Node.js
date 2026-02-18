import React from "react";
import { Link } from "react-router-dom";

export default function MyCars() {
  return (
    <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-deep-card px-8 py-9">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
          My Cars
        </h1>
        <Link
          to="/app"
          className="text-sm font-medium text-primary hover:text-blue-600"
        >
          ← Dashboard
        </Link>
      </div>
      <p className="text-sm text-slate-600 mb-6">
        Your registered cars will appear here. Add cars from your profile when the feature is connected.
      </p>
      <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 text-center text-slate-500">
        No cars yet. Use the dashboard to manage your account.
      </div>
    </div>
  );
}
