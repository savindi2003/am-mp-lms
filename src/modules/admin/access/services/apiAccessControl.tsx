export async function searchStudents(q: string) {
  const res = await fetch(
    `/api/backend/admin/access/students?q=${q}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to search students");
  }

  return res.json();
}

export async function getEnrollments(studentId: number) {
  const res = await fetch(
    `/api/backend/admin/access/enrollments?studentId=${studentId}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to load enrollments");
  }

  return res.json();
}

export async function createAccess(payload: any) {
  const res = await fetch(
    `/api/backend/admin/access/month-access`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to create access");
  }

  return res.json();
}

export async function updateAccess(payload: any) {
  const res = await fetch(
    `/api/backend/admin/access/month-access`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to update access");
  }

  return res.json();
}

export async function getAccessList() {
  const res = await fetch(
    `/api/backend/admin/access/month-access`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to load access list");
  }

  return res.json();
}

export async function getClassTypes() {
  const res = await fetch(
    `/api/backend/admin/attendance/class-types`,
    { cache: "no-store" }
  );

  if (!res.ok) throw new Error("Failed to load class types");

  return res.json();
}