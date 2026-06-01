"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";
import { Button } from "@/modules/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import Link from "next/link";

import {
  LoginFormData,
  loginSchema,
} from "@/modules/auth/validators/loginSchema";

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
      toast.error("Incorrect User name or password!", { id: toastId });
    } else {
      toast.success("Logged in!", { id: toastId });
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8">
      
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        
        {/* IMAGE */}
        <div className="hidden md:flex items-center justify-center">
          <Image
            src="/login/login-illustration.svg"
            alt="Login Illustration"
            width={380}
            height={380}
            priority
            className="w-full max-w-sm"
          />
        </div>

        {/* FORM */}
        <div className="bg-slate-100 w-full p-6 sm:p-8 md:p-10  shadow-md">
          
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 text-center md:text-left">
            Welcome back
          </h2>

          <form
            className="space-y-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            
            {/* NIC */}
            <div className="flex flex-col gap-1">
              <label className="text-slate-800 text-sm font-medium">
                User Name
              </label>

              <input
                {...register("userId")}
                type="text"
                className="input w-full"
                placeholder="Enter your User Name"
              />

              {errors.userId && (
                <p className="text-red-600 text-xs">
                  {errors.userId.message}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div className="flex flex-col gap-1">
              <label className="text-slate-800 text-sm font-medium">
                Password
              </label>

              <input
                {...register("password")}
                type="password"
                className="input w-full"
                placeholder="Enter password"
              />

              {errors.password && (
                <p className="text-red-600 text-xs">
                  {errors.password.message}
                </p>
              )}

              <Link
                href="/forgot-password"
                className="text-sm text-right hover:underline text-gray-600"
              >
                Forgot password?
              </Link>
            </div>

            {/* BUTTON */}
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