"use client";

import { useEffect, useState } from "react";
import ClassTypeSelector from "./ClassTypeSelector";
import ClassCardsGrid from "./ClassCardsGrid";

export default function ClassDashboard() {
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

    fetch(`/api/backend/classes/by-type?classTypeId=${selectedType}`)
      .then((res) => res.json())
      .then(setClasses);
  }, [selectedType]);

  return (
    <div className="space-y-6">
      <ClassTypeSelector
        classTypes={classTypes}
        selectedType={selectedType}
        onSelect={setSelectedType}
      />

      <ClassCardsGrid classes={classes} />
    </div>
  );
}