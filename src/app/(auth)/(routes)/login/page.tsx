"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";
import { Button } from "@/modules/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import {
  LoginFormData,
  loginSchema,
} from "@/modules/auth/validators/loginSchema";
import Link from "next/link";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    const toastId = toast.loading("Logging in...");
    const result = await signIn("credentials", {
      ...data,
      redirect: false,
    });

    if (result?.error) {
      toast.error("Incorrect NIC or password!", { id: toastId });
    } else {
      toast.success("Logged in!", { id: toastId });
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-7xl w-full grid md:grid-cols-2 gap-10 p-6 md:p-12">
        {/* Illustration */}
        <div className="hidden md:flex items-center justify-center">
          <Image
            src="/login/login-illustration.svg"
            alt="Login Illustration"
            width={400}
            height={400}
            priority
          />
        </div>
        {/* Form Section */}
        <div className="bg-slate-100 p-10 shadow">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Welcome back
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="email"
                className="text-slate-800 text-sm font-medium"
              >
                National ID
              </label>
              <input
                {...register("NIC")}
                id="nId"
                type="text"
                className="input"
              />
              {errors.NIC && (
                <p className="text-red-600 text-xs">{errors.NIC.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="password"
                className="text-slate-800 text-sm font-medium"
              >
                Password
              </label>
              <input
                {...register("password")}
                id="password"
                type="password"
                className="input"
              />
              {errors.password && (
                <p className="text-red-600 text-xs">
                  {errors.password.message}
                </p>
              )}
              <Link href="/forgot-password" className="hover:underline text-sm">
                forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="gray"
              disabled={isSubmitting}
              className="w-full mt-4"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
