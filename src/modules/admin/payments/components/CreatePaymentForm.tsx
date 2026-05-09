
"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";

import StudentSelect from "./StudentSelect";
import ClassSelector from "./ClassSelector";
import PackageSelector from "./PackageSelector";

import { useGetStudents } from "../hooks/useGetStudents";
import { useGetClassTypes } from "../hooks/useGetClassTypes";
import { useGetClassesByType } from "../hooks/useGetClassesByType";
import { useGetPackages } from "../hooks/useGetPackages";
import { useCreatePayment } from "../hooks/useCreatePayment";

import { Button } from "@/modules/ui/button";

import toast from "react-hot-toast";

type FormValues = {
  month: string;
};

export default function CreatePaymentForm({
  getEnrollments,
  onCloseModal,
}: {
  getEnrollments?: () => Promise<void>;
  onCloseModal?: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  const { students } = useGetStudents();
  const { classTypes } = useGetClassTypes();

  const [student, setStudent] =
    useState<any>(null);

  const [classTypeId, setClassTypeId] =
    useState<number | null>(null);

  const { classes } =
    useGetClassesByType(classTypeId);

  const { packages } =
    useGetPackages(classTypeId);

  const [selectedClasses, setSelectedClasses] =
    useState<number[]>([]);

  const [selectedPackage, setSelectedPackage] =
    useState<any>(null);

  const [usePackage, setUsePackage] =
    useState(false);

  const { createPayment, loading } =
    useCreatePayment();

  // AUTO TOTAL
  const total = usePackage
    ? selectedPackage?.totalFee || 0
    : classes
        .filter((c: any) =>
          selectedClasses.includes(c.id),
        )
        .reduce(
          (sum: number, c: any) =>
            sum + c.classFee,
          0,
        );

  const onSubmit = async (
    data: FormValues,
  ) => {
    // STUDENT VALIDATION
    if (!student) {
      return toast.error(
        "Please select a student",
      );
    }

    // CLASS TYPE VALIDATION
    if (!classTypeId) {
      return toast.error(
        "Please select the grade",
      );
    }

    // PACKAGE VALIDATION
    if (usePackage && !selectedPackage) {
      return toast.error(
        "Please select a package",
      );
    }

    // CLASS VALIDATION
    if (
      !usePackage &&
      selectedClasses.length === 0
    ) {
      return toast.error(
        "Please select at least one class",
      );
    }

    // TOTAL VALIDATION
    if (total <= 0) {
      return toast.error(
        "Invalid payment amount",
      );
    }

    try {
      await createPayment({
        studentId: student.id,

        classIds: usePackage
          ? selectedPackage.items.map(
              (i: any) => i.classId,
            )
          : selectedClasses,

        packageId: usePackage
          ? selectedPackage.id
          : null,

        month: data.month,

        amount: total,
      });

      toast.success("Payment successful");

      await getEnrollments?.();

      onCloseModal?.();

      reset();

      setStudent(null);
      setClassTypeId(null);
      setSelectedClasses([]);
      setSelectedPackage(null);
      setUsePackage(false);
    } catch (e: any) {
      toast.error(
        e?.message ||
          "Failed to create payment",
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <h3 className="text-lg font-semibold text-slate-700">
        Create Payment
      </h3>

      {/* STUDENT */}
      <div className="space-y-1">
        <label className="text-xs text-gray-600">
          Student
        </label>

        <StudentSelect
          students={students}
          onSelect={setStudent}
        />
      </div>

      {/* CLASS TYPE */}
      <div className="space-y-1">
        <label className="text-xs text-gray-600">
          Grade
        </label>

        <select
          className="w-full rounded-md border px-3 py-2 text-sm"
          value={classTypeId ?? ""}
          onChange={(e) => {
            const value = Number(
              e.target.value,
            );

            setClassTypeId(
              Number.isNaN(value)
                ? null
                : value,
            );

            setSelectedClasses([]);
            setSelectedPackage(null);
          }}
        >
          <option value="">
            Select Grade
          </option>

          {classTypes.map((t: any) => (
            <option
              key={t.id}
              value={t.id}
            >
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {/* PACKAGE TOGGLE */}
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={usePackage}
          onChange={() => {
            setUsePackage(!usePackage);

            setSelectedClasses([]);
            setSelectedPackage(null);
          }}
        />

        <span>
          Use Class Package{" "}
          <span className="text-xs text-gray-500">
            (All classes included in
            package)
          </span>
        </span>
      </label>

      {/* PACKAGE / CLASS */}
      {usePackage ? (
        <PackageSelector
          packages={packages}
          selected={selectedPackage?.id}
          setSelected={setSelectedPackage}
        />
      ) : (
        <ClassSelector
          classes={classes}
          selected={selectedClasses}
          setSelected={setSelectedClasses}
        />
      )}

      {/* MONTH */}
      <div className="space-y-1">
        <label className="text-xs text-gray-600">
          Select Month
        </label>

        <input
          type="month"
          className="w-full rounded-md border px-3 py-2 text-sm"
          {...register("month", {
            required:
              "Please select a month",
          })}
        />

        {errors.month && (
          <p className="text-xs text-red-500">
            {errors.month.message}
          </p>
        )}
      </div>

      {/* TOTAL */}
      <div className="space-y-1 mt-4">
        <label className="flex justify-between text-xs text-gray-600">
          <span>
            Total Amount (Rs)
          </span>

          <span className="text-gray-400">
            Auto calculated
          </span>
        </label>

        <input
          value={total}
          readOnly
          className="w-full rounded-md border bg-gray-100 px-3 py-2 text-sm"
        />
      </div>

      {/* BUTTON */}
      <Button
        disabled={loading}
        className="w-full"
      >
        {loading
          ? "Processing..."
          : "Pay & Enroll"}
      </Button>
    </form>
  );
}