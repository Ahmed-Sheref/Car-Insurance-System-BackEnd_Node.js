import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { clearAdminToken } from "../../auth/authStore";

export default function AdminLayout() {
  const nav = useNavigate();

  const logout = () => {
    clearAdminToken();
    nav("/admin/login");
  };

  const links = [
    { to: "/admin", label: "Dashboard" },
    { to: "/admin/customers", label: "Customers" },
    { to: "/admin/policies", label: "Policies" },
    { to: "/admin/accidents", label: "Accidents" },
    { to: "/admin/payments", label: "Payments" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-slate-800 text-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <nav className="flex gap-4">
            {links.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-sm font-medium text-slate-200 hover:text-white"
              >
                {label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            onClick={logout}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-200 hover:bg-slate-700"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
