"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {
  createClassSchema,
  MONTH_VALUES,
} from "../validators/createClassSchema";

import { useCreateClass } from "../hooks/useCreateClass";
import { Button } from "@/modules/ui/button";
import { generateMonths } from "../utils/months";
import { useClassTypes } from "../hooks/useClassTypes";

export default function CreateClassForm({ instructors }: any) {
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(createClassSchema),
  });

  const { loading, handleCreate } = useCreateClass();
  const months = generateMonths();
  const { types, loading: classTypesLoading } = useClassTypes();

  const onSubmit = async (data: any) => {
    console.log("SUBMIT:", data);
    await handleCreate(data);
  };


  return (

    <>
      <label className="text-slate-700 font-semibold">Create Class</label>

      <form
        className="space-y-1 w-[min(100%,36rem)] grid grid-cols-2 gap-x-10 mt-5"
        onSubmit={handleSubmit(onSubmit)}
      >

        <div>

          <label
            htmlFor="className"
            className="text-sm font-medium text-slate-700"
          >
            Select Grade
          </label>

          <select
            className="w-full border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-500"
            {...register("classTypeName")}
          >
            <option value="">
              {classTypesLoading ? "Loading..." : "Select Class Type"}
            </option>

            {types.map((t) => (
              <option key={t.id} value={t.name}>
                {t.name}
              </option>
            ))}
          </select>

          {errors.classTypeName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.classTypeName.message as string}
            </p>
          )}

        </div>



        {/* Fee */}
        <div>
          <label
            htmlFor="classfee"
            className="text-sm font-medium text-slate-700"
          >
            Class fee
          </label>
          <input
            placeholder="2500"
            className="w-full border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-500"
            type="number"
            {...register("classFee")}
          />
         
        </div>

        {/* tITLE */}
        <div>
          <label
            htmlFor="instructorId"
            className="text-sm font-medium text-slate-700"
          >
            Title / Description
          </label>
          <textarea
            className="w-full border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-500"
            {...register("description")}
          />
           {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message as string}
            </p>
          )}
        </div>


        {/* Instructor */}
        <div>
          <label
            htmlFor="instructorId"
            className="text-sm font-medium text-slate-700"
          >
            Select Instructor
          </label>
          <select
            className="w-full border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-500" {...register("instructorId")}>
            <option value="">Select Instructor</option>
            {instructors.map((i: any) => (
              <option key={i.id} value={i.id}>
                {i.firstName} {i.lastName}
              </option>
            ))}
          </select>
          {errors.instructorId && (
            <p className="text-red-500 text-sm mt-1">
              {errors.instructorId.message as string}
            </p>
          )}
        </div>




        {/* Image */}

        <div>
          <label
            htmlFor="coverImage"
            className="text-sm font-medium text-slate-700"
          >
            Cover Image
          </label>

          <input
            type="file"
            accept="image/*"
            className="block w-full text-sm file:mr-4 file:border-0 file:bg-slate-700 file:px-3 file:py-1 file:cursor-pointer cursor-pointer file:text-white hover:file:bg-slate-700"
            onChange={(e) => {
              setValue("coverImage", e.target.files?.[0] as any);
            }}
          />
          {errors.coverImage && (
            <p className="text-red-500 text-sm mt-1">
              {errors.coverImage.message as string}
            </p>
          )}

        </div>

        <div>

          <label
            htmlFor="coverImage"
            className="text-sm font-medium text-slate-700"
          >
            Link Expire Date
          </label>

          <input
            className="w-full border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-500"
            type="date"
            {...register("linkExpireDate")}
          />
          {errors.linkExpireDate && (
            <p className="text-red-500 text-sm mt-1">
              {errors.linkExpireDate.message as string}
            </p>
          )}


        </div>


        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2 col-span-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              reset();

            }}
          >
            Cancel
          </Button>

          <Button
            className="col-span-2"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Class"}
          </Button>
        </div>

      </form>
    </>
  );
}