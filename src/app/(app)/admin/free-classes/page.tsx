"use client";

import { useState } from "react";

import toast from "react-hot-toast";

import FreeLectureForm from "@/modules/admin/free-class/components/FreeLectureForm";

import FreeLectureList from "@/modules/admin/free-class/components/FreeLectureList";

import { useFreeLectures } from "@/modules/admin/free-class/hooks/useFreeLectures";

export default function FreeLecturePage() {



  const {
    lectures,
    createLecture,
    updateLecture,
    removeLecture,
  } = useFreeLectures();

  const [selectedLecture, setSelectedLecture] =
    useState<any>(null);

  const handleSubmit = async (data: any) => {
    if (selectedLecture) {
      await updateLecture(
        selectedLecture.id,
        data
      );

      setSelectedLecture(null);
    } else {
      await createLecture(data);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await removeLecture(id);

      toast.success("Lecture deleted");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-6 space-y-8">
      <FreeLectureForm
        selectedLecture={selectedLecture}
        onSubmitData={handleSubmit}
        onCancel={() =>
          setSelectedLecture(null)
        }
      />

      <FreeLectureList
        lectures={lectures}
        onEdit={setSelectedLecture}
        onDelete={handleDelete}
      />
    </div>
  );
}