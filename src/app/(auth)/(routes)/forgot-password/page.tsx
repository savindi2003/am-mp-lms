"use client";

import { useState } from "react";
import { Button } from "@/modules/ui/button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const error = await res.text();
        const { error: errorMessage } = JSON.parse(error);

        throw new Error(errorMessage || "Something went wrong");
      }

      setSent(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-slate-100 p-5">
        <h1 className="text-3xl font-semibold text-slate-800">
          Forgot password
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Enter your email and we’ll send you a reset link.
        </p>

        <div className="mt-4">
          <label className="block text-sm text-slate-700 mb-1">Email</label>
          <input
            type="email"
            className="w-full input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
        </div>

        <Button
          variant="gray"
          className="mt-4 w-full py-2 text-sm"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send reset link"}
        </Button>

        {sent && (
          <p className="mt-3 text-sm text-green-700">
            If the email exists, we’ve sent a reset link.
          </p>
        )}
      </form>
    </main>
  );
}
