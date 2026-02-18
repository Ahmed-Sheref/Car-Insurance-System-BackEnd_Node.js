import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { setCustomerToken } from "../../auth/authStore";

/**
 * Handles redirect from backend after Google SSO.
 * Backend redirects here with token in hash: /auth/callback#token=JWT
 * We store the token and send the user to the app.
 */
export default function AuthCallback() {
  const nav = useNavigate();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const hash = window.location.hash;
    if (!hash) {
      nav("/login", { replace: true });
      return;
    }
    const params = new URLSearchParams(hash.replace("#", ""));
    let token = params.get("token");
    if (token) {
      try {
        token = decodeURIComponent(token);
      } catch (_) {}
      setCustomerToken(token);
      nav("/app", { replace: true });
      window.history.replaceState(null, "", window.location.pathname);
    } else {
      nav("/login", { replace: true });
    }
  }, [nav]);

  return (
    <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-deep-card px-8 py-9 flex items-center justify-center min-h-[200px]">
      <p className="text-slate-500">Signing you in…</p>
    </div>
  );
}
