import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";

import { ToastProvider } from "./components/Toast";
import ProtectedRoute from "./auth/ProtectedRoute";
import ProtectedAdminRoute from "./auth/ProtectedAdminRoute";
import CustomerLayout from "./components/Layout/CustomerLayout";
import AdminLayout from "./components/Layout/AdminLayout";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminLogin from "./pages/AdminLogin";
import AuthCallback from "./pages/customer/AuthCallback";

import CustomerDashboard from "./pages/customer/Dashboard";
import Cars from "./pages/customer/Cars";
import Policies from "./pages/customer/Policies";
import PolicyDetail from "./pages/customer/PolicyDetail";
import PolicyRequestNew from "./pages/customer/PolicyRequestNew";
import Accidents from "./pages/customer/Accidents";
import AccidentNew from "./pages/customer/AccidentNew";
import AccidentDetail from "./pages/customer/AccidentDetail";
import Payments from "./pages/customer/Payments";

import AdminDashboard from "./pages/admin/AdminDashboard";
import Customers from "./pages/admin/Customers";
import CustomerDetail from "./pages/admin/CustomerDetail";
import AdminPolicies from "./pages/admin/AdminPolicies";
import AdminAccidents from "./pages/admin/AdminAccidents";
import AdminAccidentDetail from "./pages/admin/AdminAccidentDetail";
import AdminPayments from "./pages/admin/AdminPayments";

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-50">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<div className="flex min-h-screen items-center justify-center px-4"><Login /></div>} />
            <Route path="/signup" element={<div className="flex min-h-screen items-center justify-center px-4"><Signup /></div>} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/admin/login" element={<div className="flex min-h-screen items-center justify-center px-4"><AdminLogin /></div>} />

            <Route path="/app" element={<ProtectedRoute><CustomerLayout /></ProtectedRoute>}>
              <Route index element={<CustomerDashboard />} />
              <Route path="cars" element={<Cars />} />
              <Route path="policies" element={<Policies />} />
              <Route path="policies/new" element={<PolicyRequestNew />} />
              <Route path="policies/:id" element={<PolicyDetail />} />
              <Route path="accidents" element={<Accidents />} />
              <Route path="accidents/new" element={<AccidentNew />} />
              <Route path="accidents/:id" element={<AccidentDetail />} />
              <Route path="payments" element={<Payments />} />
            </Route>

            <Route path="/admin" element={<ProtectedAdminRoute><AdminLayout /></ProtectedAdminRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="customers" element={<Customers />} />
              <Route path="customers/:id" element={<CustomerDetail />} />
              <Route path="policies" element={<AdminPolicies />} />
              <Route path="accidents" element={<AdminAccidents />} />
              <Route path="accidents/:id" element={<AdminAccidentDetail />} />
              <Route path="payments" element={<AdminPayments />} />
            </Route>

            <Route
              path="*"
              element={
                <div className="flex min-h-screen items-center justify-center px-4">
                  <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center">
                    <h2 className="text-xl font-semibold text-slate-900">Page not found</h2>
                    <p className="mt-2 text-sm text-slate-500">The page you’re looking for doesn’t exist.</p>
                    <div className="mt-6 flex justify-center gap-3">
                      <Link to="/login" className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white">Customer login</Link>
                      <Link to="/admin/login" className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">Admin login</Link>
                    </div>
                  </div>
                </div>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </ToastProvider>
  );
}
