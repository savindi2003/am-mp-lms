"use client";

import { useState } from "react";
import { createAdminEnrollment } from "../services/apiEnrollment";
import { CreatePaymentFormData } from "@/modules/admin/enrollments/validators/createPaymentSchema";
import toast from "react-hot-toast";

export function useCreateEnrollment() {
  const [loading, setLoading] = useState(false);

  const createEnrollment = async (payload: CreatePaymentFormData | null) => {
    if (!payload) throw new Error("EnrollmentPayload not found");
    setLoading(true);
    const toastId = toast.loading("Saving...");
    try {
      await createAdminEnrollment(payload);
      toast.success("New payment created", { id: toastId });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      toast.error(e.message, { id: toastId });
    } finally {
      setLoading(false); 
    }
  };

  return {
    loading,
    createEnrollment,
  };
}
