import React from 'react';
import { Navigate } from "react-router-dom";
import { useSessionStore } from "../store/sessionStore";

// Fix: Make children optional in the type definition to resolve potential TS errors at usage sites
export default function ProtectedRoute({ children }: { children?: React.ReactNode }) {
  const { session, loading } = useSessionStore();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-900 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-emerald-900 font-bold uppercase tracking-widest text-xs">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!session) return <Navigate to="/" replace />;

  return <>{children}</>;
}