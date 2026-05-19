"use client";

import { useMemo, useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { packageSchema } from "../validators/packageSchema";
import { useCreatePackage } from "../hooks/useCreatePackage";

import { Button } from "@/modules/ui/button";

import { useRouter } from "next/navigation";

export default function CreatePackageForm({
  classes,
  onCreated,
}: any) {

  const router = useRouter();

  const [selectedType, setSelectedType] =
    useState("");

  const {
    loading,
    createPackage,
  } = useCreatePackage();

const {
  register,
  handleSubmit,
  reset,
} = useForm({
  resolver: zodResolver(packageSchema),

  defaultValues: {
    name: "",
    totalFee: "",
    classIds: [],
  },
});

  // unique class types
  const classTypes = useMemo(() => {
  const map = new Map<number, string>();

  classes.forEach((cls: any) => {
    if (cls?.classType) {
      map.set(cls.classType.id, cls.classType.name);
    }
  });

  return Array.from(map.entries()); // [id, name]
}, [classes]);

  // filtered classes
  const filteredClasses = classes.filter(
    (cls: any) =>
      cls.classType.name === selectedType
  );

  async function onSubmit(data: any) {

  const success = await createPackage({
    ...data,

    classIds: data.classIds.map(
      (id: string) => Number(id)
    ),
  });

  if (success) {

    // clear form
    reset();

    // reset grade select
    setSelectedType("");

    // refresh package list
    onCreated();

    // optional next refresh
    router.refresh();
  }
}

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >

      {/* PACKAGE NAME */}
      <div>
        <label className="text-sm font-medium">
          Package Name
        </label>

        <input
          {...register("name")}
          className="w-full border rounded-xl p-3"
          placeholder="Grade 11 Theory + Paper"
        />
      </div>

      {/* TOTAL FEE */}
      <div>
        <label className="text-sm font-medium">
          Total Fee
        </label>

        <input
          type="number"
          {...register("totalFee")}
          className="w-full border rounded-xl p-3"
        />
      </div>

      {/* CLASS TYPE */}
      <div>

        <label className="text-sm font-medium">
          Select Grade
        </label>

        <select
          className="w-full border rounded-xl p-3"
          value={selectedType}
          onChange={(e) =>
            setSelectedType(e.target.value)
          }
        >

          <option value="">
            Select Grade
          </option>

          {classTypes.map(([id, name]) => (
  <option
    key={id}
    value={name}
  >
    {name}
  </option>
))}

        </select>

      </div>

      {/* FILTERED CLASSES */}
      {selectedType && (

        <div className="space-y-3">

          <p className="text-sm font-medium">
            Select Classes
          </p>

          {filteredClasses.map((cls: any) => (

            <label
              key={cls.id}
              className="flex items-center gap-3 border rounded-xl p-3 hover:bg-slate-50 cursor-pointer"
            >

              <input
                type="checkbox"
                value={cls.id}
                {...register("classIds")}
              />

              <div>
                <p className="font-medium">
                  {cls.description}
                </p>

                <p className="text-xs text-slate-500">
                  Rs. {cls.classFee}
                </p>
              </div>

            </label>

          ))}

        </div>

      )}


      <Button
        className="w-full"
        disabled={loading}
      >
        {loading
          ? "Creating..."
          : "Create Package"}
      </Button>

    </form>
  );
}

