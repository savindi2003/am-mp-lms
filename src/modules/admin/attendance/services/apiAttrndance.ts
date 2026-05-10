import { getBaseUrl } from "@/lib/getBaseUrl";


export async function getClasses(classTypeId: number) {
  const res = await fetch(
    `${getBaseUrl()}/api/backend/admin/attendance/classes?classTypeId=${classTypeId}`,
    { cache: "no-store" }
  );

  return res.json();
}


export async function getLectures(classId: number, date: string) {
  const res = await fetch(
    `${getBaseUrl()}/api/backend/admin/attendance/lectures?classId=${classId}&date=${date}`,
    { cache: "no-store" }
  );

  return res.json();
}


export async function getFilters() {
  const res = await fetch(
    `${getBaseUrl()}/api/backend/admin/attendance/filters`,
    { cache: "no-store" }
  );

  return res.json();
}


export async function getStudents(params: Record<string, any>) {
  const query = new URLSearchParams(params).toString();

  const res = await fetch(
    `${getBaseUrl()}/api/backend/admin/attendance/students?${query}`,
    { cache: "no-store" }
  );

  return res.json();
}


export async function saveAttendance(data: any) {
  const res = await fetch(
    `${getBaseUrl()}/api/backend/admin/attendance/save`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  return res.json();
}