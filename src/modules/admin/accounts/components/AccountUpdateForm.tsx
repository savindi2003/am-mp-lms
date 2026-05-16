"use client";

import * as React from "react";
import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import type { AccountUser } from "@/modules/admin/accounts/types/typeAccountUser";
import { Button } from "@/modules/ui/button";
import toast from "react-hot-toast";
import { ImSpinner2 } from "react-icons/im";
import { updateAccountSchema } from "@/modules/admin/accounts/validators/updateAccountSchema";

type UpdateAccountFormData = z.infer<typeof updateAccountSchema>;

function AccountUpdateForm({
  user,
  onCloseModal,
  onSave,
}: {
  user: AccountUser;
  onCloseModal?: () => void;
  onSave: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const isStudent = user.role === "STUDENT";
  const isInstructor = user.role === "INSTRUCTOR";
  const dobDefault =
    isStudent && user.profile?.dob
      ? new Date(user.profile.dob).toISOString().slice(0, 10)
      : "";

  // ---- Role-aware client schema (no server change) ----
  const clientSchema = useMemo(
    () =>
      updateAccountSchema.superRefine((data, ctx) => {
        if (!isStudent) return;

        // Require these only for students
        const required: Array<[keyof UpdateAccountFormData, string]> = [
          ["email", "* Email is required"],
          ["contactNo", "* Contact number is required"],
          ["guardianFirstName", "* Guardian first name is required"],
          ["guardianLastName", "* Guardian last name is required"],
          ["address", "* Address is required"],
          ["gender", "* Gender is required"],
          ["dob", "* Date of birth is required"],
        ];

        for (const [field, message] of required) {
          const v = data[field];
          if (v == null || (typeof v === "string" && v.trim() === "")) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: [field],
              message,
            });
          }
        }
      }),
    [isStudent],
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateAccountFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      userId: user.id,
      NIC: user.NIC ?? "",
      email: user.email ?? "",
      firstName: user.profile?.firstName ?? "",
      lastName: user.profile?.lastName ?? "",
      title: user.profile?.title ?? "",
      contactNo: user.profile?.contactNo ?? "",
      guardianContactNo: user.profile?.guardianContactNo ?? "",
      guardianFirstName: user.profile?.guardianFirstName ?? "",
      guardianLastName: user.profile?.guardianLastName ?? "",
      gender:
        (user.profile?.gender as "MALE" | "FEMALE" | undefined) ?? undefined,
      dob: dobDefault || undefined,
      address: user.profile?.address ?? "",
    },
    shouldUnregister: true, // hide fields don't submit
  });

  // Helpers for setValueAs
  const trimOnly = (v: unknown) => (typeof v === "string" ? v.trim() : v);
  const trimOrUndefined = (v: unknown) =>
    typeof v === "string" ? (v.trim() === "" ? undefined : v.trim()) : v;

  // VALID submit -> pass real form to your parent handler
  const onValid = () => {
    const formEl = formRef.current;
    if (!formEl) return;

    setLoading(true);
    // const toastId = toast.loading("Saving...");
    const fakeEvent = {
      preventDefault: () => {},
      currentTarget: formEl,
    } as unknown as React.FormEvent<HTMLFormElement>;

    onSave(fakeEvent); // parent does new FormData(e.currentTarget)
    // toast.success("Saved successfully", { id: toastId });
    onCloseModal?.();
    // toast.error(error?.message ?? "Save failed", { id: toastId });
  };

  // INVALID -> show errors, do NOT close
  const onInvalid = () => {
    const first = Object.values(errors)[0]?.message as string | undefined;
    toast.error(first || "Please fix the highlighted fields");
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(onValid, onInvalid)}
      className="space-y-4 sm:min-w-2xl xl:min-w-5xl"
    >
      {/* hidden userId to satisfy schema */}
      <input
        type="hidden"
        {...register("userId", { valueAsNumber: true })}
        value={user.id}
        name="userId"
      />

      {/* Role (read-only display) */}
      <div className="text-xs uppercase tracking-wide text-slate-500 font-bold">
        {user.role}
      </div>

      {/* NIC */}
      <div className="space-y-1">
        <label htmlFor="NIC" className="text-sm font-medium text-slate-700">
          NIC
        </label>
        <input
          id="NIC"
          {...register("NIC")}
          name="NIC"
          type="text"
          defaultValue={user.NIC ?? ""}
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
        {errors.NIC && (
          <p className="text-xs text-red-600">{errors.NIC.message as string}</p>
        )}
      </div>

      {/* First / Last (trim only; required by min(1) if provided) */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <label
            htmlFor="firstName"
            className="text-sm font-medium text-slate-700"
          >
            First name
          </label>
          <input
            id="firstName"
            {...register("firstName", { setValueAs: trimOnly })}
            name="firstName"
            defaultValue={user.profile?.firstName ?? ""}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
          {errors.firstName && (
            <p className="text-xs text-red-600">
              {errors.firstName.message as string}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <label
            htmlFor="lastName"
            className="text-sm font-medium text-slate-700"
          >
            Last name
          </label>
          <input
            id="lastName"
            {...register("lastName", { setValueAs: trimOnly })}
            name="lastName"
            defaultValue={user.profile?.lastName ?? ""}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
          {errors.lastName && (
            <p className="text-xs text-red-600">
              {errors.lastName.message as string}
            </p>
          )}
        </div>
      </div>

      {/* Email — required for STUDENT, optional otherwise */}
      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          id="email"
          {...register("email", {
            setValueAs: isStudent ? trimOnly : trimOrUndefined,
          })}
          name="email"
          type="email"
          defaultValue={user.email ?? ""}
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
        {errors.email && (
          <p className="text-xs text-red-600">
            {errors.email.message as string}
          </p>
        )}
      </div>

      {/* Instructor-only: Title */}
      {isInstructor && (
        <div className="space-y-1">
          <label htmlFor="title" className="text-sm font-medium text-slate-700">
            Title
          </label>
          <input
            id="title"
            {...register("title", { setValueAs: trimOrUndefined })}
            name="title"
            defaultValue={user.profile?.title ?? ""}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
          {errors.title && (
            <p className="text-xs text-red-600">
              {errors.title.message as string}
            </p>
          )}
        </div>
      )}

      {/* Student-only: details — required if STUDENT */}
      {isStudent && (
        <fieldset className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-5">
          <legend className="col-span-full mb-1 text-sm font-semibold text-slate-700">
            Student details
          </legend>

          <div className="space-y-1">
            <label
              htmlFor="contactNo"
              className="text-sm font-medium text-slate-700"
            >
              Contact No
            </label>
            <input
              id="contactNo"
              {...register("contactNo", {
                setValueAs: isStudent ? trimOnly : trimOrUndefined,
              })}
              name="contactNo"
              type="tel"
              defaultValue={user.profile?.contactNo ?? ""}
              placeholder="07XXXXXXXX"
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
            {errors.contactNo && (
              <p className="text-xs text-red-600">
                {errors.contactNo.message as string}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label
              htmlFor="guardianContactNo"
              className="text-sm font-medium text-slate-700"
            >
              Guardian Contact No
            </label>
            <input
              id="guardianContactNo"
              {...register("guardianContactNo", {
                setValueAs: isStudent ? trimOnly : trimOrUndefined,
              })}
              name="guardianContactNo"
              type="tel"
              defaultValue={user.profile?.guardianContactNo ?? ""}
              placeholder="07XXXXXXXX"
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
            {errors.guardianContactNo && (
              <p className="text-xs text-red-600">
                {errors.guardianContactNo.message as string}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label
              htmlFor="guardianFirstName"
              className="text-sm font-medium text-slate-700"
            >
              Guardian First Name
            </label>
            <input
              id="guardianFirstName"
              {...register("guardianFirstName", {
                setValueAs: isStudent ? trimOnly : trimOrUndefined,
              })}
              name="guardianFirstName"
              defaultValue={user.profile?.guardianFirstName ?? ""}
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
            {errors.guardianFirstName && (
              <p className="text-xs text-red-600">
                {errors.guardianFirstName.message as string}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label
              htmlFor="guardianLastName"
              className="text-sm font-medium text-slate-700"
            >
              Guardian Last Name
            </label>
            <input
              id="guardianLastName"
              {...register("guardianLastName", {
                setValueAs: isStudent ? trimOnly : trimOrUndefined,
              })}
              name="guardianLastName"
              defaultValue={user.profile?.guardianLastName ?? ""}
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
            {errors.guardianLastName && (
              <p className="text-xs text-red-600">
                {errors.guardianLastName.message as string}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="dob" className="text-sm font-medium text-slate-700">
              Date of Birth
            </label>
            <input
              id="dob"
              {...register("dob", {
                setValueAs: isStudent ? (v) => v : (v) => (v ? v : undefined),
              })}
              name="dob"
              type="date"
              defaultValue={dobDefault}
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
            {errors.dob && (
              <p className="text-xs text-red-600">
                {errors.dob.message as string}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label
              htmlFor="gender"
              className="text-sm font-medium text-slate-700"
            >
              Gender
            </label>
            <select
              id="gender"
              {...register("gender", {
                setValueAs: isStudent ? (v) => v : (v) => (v ? v : undefined),
              })}
              name="gender"
              defaultValue={user.profile?.gender ?? ""}
              className="w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="" disabled>
                Select gender
              </option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
            {errors.gender && (
              <p className="text-xs text-red-600">
                {errors.gender.message as string}
              </p>
            )}
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label
              htmlFor="address"
              className="text-sm font-medium text-slate-700"
            >
              Address
            </label>
            <input
              id="address"
              {...register("address", {
                setValueAs: isStudent ? trimOnly : trimOrUndefined,
              })}
              name="address"
              defaultValue={user.profile?.address ?? ""}
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
            {errors.address && (
              <p className="text-xs text-red-600">
                {errors.address.message as string}
              </p>
            )}
          </div>
        </fieldset>
      )}

      <div className="flex gap-2 pt-2 ml-auto w-fit">
        <Button type="submit" variant="gray" disabled={isSubmitting || loading}>
          {isSubmitting || loading ? (
            <>
              <span>Saving..</span>
              <ImSpinner2 size={20} className="animate-spin" />
            </>
          ) : (
            "Save"
          )}
        </Button>
        <Button
          variant="secondary"
          type="button"
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default AccountUpdateForm;
