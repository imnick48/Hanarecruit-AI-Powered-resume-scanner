import React from "react";
import Logo from "../components/ui/Logo";

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background:
          "linear-gradient(135deg, #eef2ff 0%, #f4f5f7 60%, #e0e7ff 100%)",
      }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mb-3">
            <Logo size="md" />
          </div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: "#1e1b4b" }}>
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm" style={{ color: "#6b7280" }}>
              {subtitle}
            </p>
          )}
        </div>
        <div className="card p-8">{children}</div>
      </div>
    </div>
  );
}
