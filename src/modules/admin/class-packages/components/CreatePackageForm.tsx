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
      className=" bg-slate-200 p-5 space-y-4"
    >

      {/* PACKAGE NAME */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Package Name
        </label>

        <input
          {...register("name")}
          className="input w-full sm:w-md"
          placeholder="Grade 11 Theory + Paper"
        />
      </div>

      {/* TOTAL FEE */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Total Fee
        </label>

        <input
          type="number"
          {...register("totalFee")}
          className="input w-full sm:w-md"
        />
      </div>

      {/* CLASS TYPE */}
      <div>

        <label className="block text-sm font-medium mb-1">
          Select Grade
        </label>

        <select
          className="input w-full sm:w-md"
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

          <p className="block text-sm font-medium mb-1">
            Select Classes
          </p>

          {filteredClasses.map((cls: any) => (

            <label
              key={cls.id}
              className="flex items-center gap-3 border border-slate-500 p-3 bg-white cursor-pointer hover:bg-slate-100 w-full sm:w-md"
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
        className="w-full sm:w-auto"
        disabled={loading}
      >
        {loading
          ? "Creating..."
          : "Create Package"}
      </Button>

    </form>
  );
}

