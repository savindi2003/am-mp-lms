"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type ResetPasswordFormData,
  type ResetPasswordPayload,
  updatePasswordSchema,
} from "@/modules/auth/validators/updatePasswordSchema";
import { Button } from "@/modules/ui/button";
import { updatePassword as updatePasswordApi } from "@/modules/profile/services/apiUser";
import toast from "react-hot-toast";

function UpdatePassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(updatePasswordSchema),
  });

  const onSubmit = async ({
    currentPassword,
    newPassword,
  }: ResetPasswordPayload) => {
    // Call API to update password
    try {
      const result = await updatePasswordApi({ currentPassword, newPassword });
      toast.success(result.message);
      reset();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Current Password */}
      <div>
        <label className="block text-sm text-slate-700 mb-1">
          Current Password
        </label>
        <input
          type="password"
          {...register("currentPassword")}
          className="w-full input"
        />
        {errors.currentPassword && (
          <p className="text-red-500 text-xs mt-1">
            {errors.currentPassword.message}
          </p>
        )}
      </div>

      {/* New Password */}
      <div>
        <label className="block text-sm text-slate-700 mb-1">
          New Password
        </label>
        <input
          type="password"
          {...register("newPassword")}
          className="w-full input"
        />
        {errors.newPassword && (
          <p className="text-red-500 text-xs mt-1">
            {errors.newPassword.message}
          </p>
        )}
      </div>

      {/* Confirm New Password */}
      <div>
        <label className="block text-sm text-slate-700 mb-1">
          Confirm New Password
        </label>
        <input
          type="password"
          {...register("confirmPassword")}
          className="w-full input"
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-xs mt-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <Button variant="gray" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Updating..." : "Update Password"}
      </Button>
    </form>
  );
}

export default UpdatePassword;
