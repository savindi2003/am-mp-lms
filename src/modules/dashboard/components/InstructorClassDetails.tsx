"use client";

import { useEffect, useState } from "react";
import ClassTypeSelector from "./ClassTypeSelector";
import ClassCardsGrid from "./ClassCardsGrid";
import { HiH2 } from "react-icons/hi2";

export default function InstructorClassDetails() {
  const [classTypes, setClassTypes] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [classes, setClasses] = useState<any[]>([]);

  // CLASS TYPES
  useEffect(() => {
    fetch("/api/backend/class-types")
      .then((res) => res.json())
      .then((data) => {
        setClassTypes(data);
        if (data.length > 0) setSelectedType(data[0].id);
      });
  }, []);

  // CLASSES BY TYPE
  useEffect(() => {
    if (!selectedType) return;

    fetch(`/api/backend/classes/instructor/by-type?classTypeId=${selectedType}&instructorId=1`)
      .then((res) => res.json())
      .then(setClasses);
  }, [selectedType]);

  return (
    <div className="space-y-6 mb-5">

        <h3 className="text-2xl font-semibold mb-4">
                Overview
        </h3>

      <ClassTypeSelector
        classTypes={classTypes}
        selectedType={selectedType}
        onSelect={setSelectedType}
      />

      <ClassCardsGrid classes={classes} />
    </div>
  );
}