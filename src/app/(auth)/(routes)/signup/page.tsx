"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";
import { Button } from "@/modules/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SignupFormData,
  signupSchema,
} from "@/modules/auth/validators/signupSchema";
import toast from "react-hot-toast";

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    const toastId = toast.loading("Hold on tight... preparing account");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.message, { id: toastId });
        throw new Error(result.message || "Something went wrong");
      }

      toast.success("Account created successfully!", { id: toastId });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-slate-50">
      <div className="max-w-7xl w-full grid md:grid-cols-2 gap-10 p-6 md:p-12">
        {/* Form Section */}
        <div className="bg-slate-200 p-10">
          <h2 className="text-3xl font-bold mb-2 text-gray-700 mb-6">
            Create your Account
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="email"
                  className="text-slate-600 text-sm font-medium"
                >
                  Email
                </label>
                <input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="name@email.com"
                  className="input"
                />
                {errors.email && (
                  <p className="text-red-600 text-xs">{errors.email.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="firstName"
                    className="text-slate-600 text-sm font-medium"
                  >
                    First Name
                  </label>
                  <input
                    {...register("firstName")}
                    id="firstName"
                    type="text"
                    placeholder="e.g. Bonnie"
                    className="input"
                  />
                  {errors.firstName && (
                    <p className="text-red-600 text-xs">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="lastName"
                    className="text-slate-600 text-sm font-medium"
                  >
                    Last Name
                  </label>
                  <input
                    {...register("lastName")}
                    id="lastName"
                    type="text"
                    placeholder="e.g. Green"
                    className="input"
                  />
                  {errors.lastName && (
                    <p className="text-red-600 text-xs">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1">
  <label className="text-slate-600 text-sm font-medium">
    NIC
  </label>
  <input
    {...register("NIC")}
    type="text"
    placeholder="NIC number"
    className="input"
  />
</div>

            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="password"
                  className="text-slate-600 text-sm font-medium"
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
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="confirmPassword"
                  className="text-slate-600 text-sm font-medium"
                >
                  Confirm Password
                </label>
                <input
                  {...register("confirmPassword")}
                  id="confirmPassword"
                  type="password"
                  className="input"
                />
                {errors.confirmPassword && (
                  <p className="text-red-600 text-xs">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-6">
              <label className="flex gap-2 items-center text-sm text-gray-700">
                <input
                  type="checkbox"
                  {...register("agreeToTerms")}
                  className="accent-slate-600"
                />
                I agree to the Terms of Use and Privacy Policy.
              </label>
              {errors.agreeToTerms && (
                <p className="text-red-600 text-xs">
                  {errors.agreeToTerms.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 cursor-pointer"
            >
              {isSubmitting ? "Creating..." : "Create an account"}
            </Button>
          </form>

          <div className="flex items-center justify-between gap-4 my-6">
            <hr className="flex-1 border-gray-600" />
            <span className="text-gray-500 text-sm">or</span>
            <hr className="flex-1 border-gray-600" />
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full text-slate-700 cursor-pointer"
            onClick={() =>
              signIn("google", {
                callbackUrl: "/dashboard",
              })
            }
          >
            <Image
              src="/signup/google.png"
              alt="Google"
              width={20}
              height={20}
            />
            Sign up with Google
          </Button>
          <p className=" text-sm text-gray-700 mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-slate-500 hover:underline">
              Login here
            </a>
          </p>
        </div>

        {/* Illustration */}
        <div className="hidden md:flex items-center justify-center">
          <Image
            src="/signup/signup-illustration.svg"
            alt="Signup Illustration"
            width={400}
            height={400}
            priority
          />
        </div>
      </div>
    </div>
  );
}
