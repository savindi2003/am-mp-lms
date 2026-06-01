"use client";

import * as React from "react";
import { useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/modules/ui/button";
import { createAccount } from "@/modules/admin/accounts/data/actions";
import {
  type CreateAccountFormData,
  createAccountSchema,
} from "@/modules/admin/accounts/validators/createAccountSchema";
import toast from "react-hot-toast";

type CreateState = {
  ok?: boolean;
  id?: number;
  error?: string;
  emailSent?: boolean;
};

const initial: CreateState = {};

const DEFAULTS: CreateAccountFormData = {
  role: "STUDENT",
  NIC: "",
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  title: "",
  contactNo: "",
  address: "",
  dob: "",
  gender: undefined,
  guardianContactNo: "",
  guardianFirstName: "",
  guardianLastName: "",
};

export default function AccountCreateForm({
  onCloseModal,
}: {
  onCloseModal?: () => void;
}) {
  const [state, action] = useActionState(createAccount, initial);
  const [pending, startTransition] = React.useTransition();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
    clearErrors,
  } = useForm<CreateAccountFormData>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: DEFAULTS,
    mode: "onBlur",
    shouldUnregister: true,
  });

  const role = watch("role");

  // Reset after successful create
  useEffect(() => {
  if (state?.ok && state.id) {
    reset(DEFAULTS);
    clearErrors();

    toast.success("Account created successfully");

    if (state.emailSent) {
      toast.success("Verification email sent successfully");
    } else {
      toast.error("Account created, but email failed");
    }

    onCloseModal?.();
  }

  if (state?.error) {
    toast.error(state.error);
  }
}, [
  state?.ok,
  state?.error,
  state?.id,
  state?.emailSent,
  reset,
  clearErrors,
  onCloseModal,
]);

  const onSubmit = (values: CreateAccountFormData) => {
    const fd = new FormData();

    // Common fields
    fd.set("role", values.role);
    fd.set("email", values.email);
    fd.set("NIC", values.NIC);
    fd.set("password", values.password);
    fd.set("firstName", values.firstName);
    fd.set("lastName", values.lastName);
    if (values.title) fd.set("title", values.title);

    // Student-only fields
    if (values.role === "STUDENT") {
      fd.set("contactNo", values.contactNo ?? "");
      fd.set("address", values.address ?? "");
      fd.set("dob", values.dob ?? "");
      fd.set("gender", values.gender ?? "");
      fd.set("guardianContactNo", values.guardianContactNo ?? "");
      fd.set("guardianFirstName", values.guardianFirstName ?? "");
      fd.set("guardianLastName", values.guardianLastName ?? "");
    }

    startTransition(() => {
      action(fd);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-6 grid gap-3 p-4">
      <h3 className="text-lg font-semibold text-slate-700">Add account</h3>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 md:min-w-5xl">
        {/* Role */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-700">User Role</label>
          <select
            {...register("role")}
            className="w-full border px-3 py-2 text-sm"
          >
            <option value="STUDENT">Student</option>
            <option value="INSTRUCTOR">Instructor</option>
            <option value="ADMIN">Admin</option>
          </select>
          {errors.role && (
            <p className="mt-1 text-xs text-red-600">{errors.role.message}</p>
          )}
        </div>

        {/* NIC */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-700">NIC</label>
          <input
            {...register("NIC")}
            type="text"
            placeholder="NIC"
            className="w-full border px-3 py-2 text-sm"
          />
          {errors.NIC && (
            <p className="mt-1 text-xs text-red-600">{errors.NIC.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-700">Email</label>
          <input
            {...register("email")}
            type="email"
            placeholder="Email"
            className="w-full border px-3 py-2 text-sm"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-700">Password</label>
          <input
            {...register("password")}
            type="password"
            placeholder="Password (min 8)"
            className="w-full border px-3 py-2 text-sm"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* First name */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-700">First Name</label>
          <input
            {...register("firstName")}
            placeholder="First name"
            className="w-full border px-3 py-2 text-sm"
          />
          {errors.firstName && (
            <p className="mt-1 text-xs text-red-600">
              {errors.firstName.message}
            </p>
          )}
        </div>

        {/* Last name */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-700">Last Name</label>
          <input
            {...register("lastName")}
            placeholder="Last name"
            className="w-full border px-3 py-2 text-sm"
          />
          {errors.lastName && (
            <p className="mt-1 text-xs text-red-600">
              {errors.lastName.message}
            </p>
          )}
        </div>

        {/* Title — only for instructors */}
        {role === "INSTRUCTOR" && (
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-700">Title</label>
            <input
              {...register("title")}
              placeholder="Title"
              className="w-full border px-3 py-2 text-sm"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-600">
                {errors.title.message}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Student-only section */}
      {role === "STUDENT" && (
        <fieldset className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-700">Contact No</label>
            <input
              {...register("contactNo")}
              type="tel"
              placeholder="Contact No (07XXXXXXXX)"
              className="w-full border px-3 py-2 text-sm"
            />
            {errors.contactNo && (
              <p className="mt-1 text-xs text-red-600">
                {errors.contactNo.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-700">Guardian Contact No (Optional)</label>
            <input
              {...register("guardianContactNo")}
              type="tel"
              placeholder="Guardian Contact No (07XXXXXXXX)"
              className="w-full border px-3 py-2 text-sm"
            />
            {errors.guardianContactNo && (
              <p className="mt-1 text-xs text-red-600">
                {errors.guardianContactNo.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-700">Guardian First Name</label>
            <input
              {...register("guardianFirstName")}
              placeholder="Guardian First Name"
              className="w-full border px-3 py-2 text-sm"
            />
            {errors.guardianFirstName && (
              <p className="mt-1 text-xs text-red-600">
                {errors.guardianFirstName.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-700">Guardian Last Name</label>
            <input
              {...register("guardianLastName")}
              placeholder="Guardian Last Name"
              className="w-full border px-3 py-2 text-sm"
            />
            {errors.guardianLastName && (
              <p className="mt-1 text-xs text-red-600">
                {errors.guardianLastName.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-700">Date of Birth</label>
            <input
              {...register("dob")}
              type="date"
              placeholder="Date of Birth"
              className="border px-3 py-2 text-sm"
            />

            {errors.dob && (
              <p className="mt-1 text-xs text-red-600">{errors.dob.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-700">Gender</label>
            <select
              {...register("gender")}
              className="w-full border px-3 py-2 text-sm"
              defaultValue=""
            >
              <option value="" disabled>
                Select gender
              </option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
            {errors.gender && (
              <p className="mt-1 text-xs text-red-600">
                {errors.gender.message}
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-slate-700">Address</label>
            <input
              {...register("address")}
              placeholder="Address"
              className="w-full border px-3 py-2 text-sm"
            />
            {errors.address && (
              <p className="mt-1 text-xs text-red-600">
                {errors.address.message}
              </p>
            )}
          </div>
        </fieldset>
      )}

      <div className="mt-2 flex items-center gap-3 ml-auto">
        <Button disabled={isSubmitting || pending} variant="gray">
          {isSubmitting || pending ? "Creating..." : "Create"}
        </Button>
        {state.error && (
          <span className="text-sm text-red-600">{state.error}</span>
        )}
      </div>
    </form>
  );
}
