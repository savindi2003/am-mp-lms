export async function getClasses(classTypeId: number) {
  const res = await fetch(
    `/api/backend/admin/attendance/classes?classTypeId=${classTypeId}`
  );
  return res.json();
}

export async function getLectures(classId: number, date: string) {
  const res = await fetch(
    `/api/backend/admin/attendance/lectures?classId=${classId}&date=${date}`
  );
  return res.json();
}

export async function getFilters() {
  const res = await fetch("/api/backend/admin/attendance/filters");
  return res.json();
}

export async function getStudents(params: any) {
  const query = new URLSearchParams(params).toString();

  const res = await fetch(
    `/api/backend/admin/attendance/students?${query}`
  );

  return res.json();
}

export async function saveAttendance(data: any) {
  const res = await fetch(
    "/api/backend/admin/attendance/save",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );

  return res.json();
}

