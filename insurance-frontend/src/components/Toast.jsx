import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const show = useCallback((message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const hide = useCallback(() => setToast(null), []);

  return (
    <ToastContext.Provider value={{ show, hide }}>
      {children}
      {toast && (
        <div
          className={`fixed bottom-4 right-4 z-50 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg ${
            toast.type === "error" ? "bg-red-600" : toast.type === "success" ? "bg-emerald-600" : "bg-slate-800"
          }`}
          role="alert"
        >
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) return { show: () => {}, hide: () => {} };
  return ctx;
}
