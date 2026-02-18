import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { clearCustomerToken } from "../../auth/authStore";

export default function CustomerLayout() {
  const nav = useNavigate();

  const logout = () => {
    clearCustomerToken();
    nav("/login");
  };

  const links = [
    { to: "/app", label: "Dashboard" },
    { to: "/app/cars", label: "Cars" },
    { to: "/app/policies", label: "Policies" },
    { to: "/app/accidents", label: "Accidents" },
    { to: "/app/payments", label: "Payments" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <nav className="flex gap-4">
            {links.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-sm font-medium text-slate-600 hover:text-primary"
              >
                {label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            onClick={logout}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
