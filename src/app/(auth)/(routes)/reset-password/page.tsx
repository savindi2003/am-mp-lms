"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "@/modules/auth/validators/resetPasswordSchema";

export default function ResetPasswordPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const token = sp.get("token") || "";

  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  if (!token) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm border border-slate-200 p-5">
          <p className="text-sm text-red-600">Invalid reset link.</p>
        </div>
      </main>
    );
  }

  const onSubmit = handleSubmit(async ({ password }) => {
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed");
      setOk(true);
      reset(); // clear fields
      setTimeout(() => router.push("/login"), 1000);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setErr(e?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  });

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm bg-slate-200 p-5 rounded"
      >
        <h1 className="text-3xl font-semibold text-slate-800">
          Set a new password
        </h1>

        <div className="mt-4">
          <label className="block text-sm text-slate-700 mb-1">
            New password
          </label>
          <input
            type="password"
            className="w-full input"
            autoComplete="new-password"
            {...register("password")}
          />
          {errors.password && (
            <p className="mt-2 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="mt-3">
          <label className="block text-sm text-slate-700 mb-1">
            Confirm password
          </label>
          <input
            type="password"
            className="w-full input"
            autoComplete="new-password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="mt-2 text-sm text-red-600">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {err && <p className="mt-3 text-sm text-red-600">{err}</p>}

        <button
          className="mt-4 w-full border bg-slate-900 text-white py-2 text-sm rounded disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Saving..." : "Update password"}
        </button>

        {ok && (
          <p className="mt-3 text-sm text-green-700">
            Password updated. Redirecting…
          </p>
        )}
      </form>
    </main>
  );
}
