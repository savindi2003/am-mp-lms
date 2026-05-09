import { CreatePaymentFormData } from "@/modules/admin/enrollments/validators/createPaymentSchema";
import { CourseType, EnrollmentStatus } from "@prisma/client";

export async function getAdminEnrollments(page: number, courseTypeId?: number) {
  const qs = courseTypeId
    ? `courseTypeId=${encodeURIComponent(courseTypeId)}`
    : "";
  const p = `?page=${encodeURIComponent(page)}`;

  console.log(`/api/backend/admin/enrollments${p}${qs && `&${qs}`}`);
  const res = await fetch(
    `/api/backend/admin/enrollments${p}${qs && `&${qs}`}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  if (!res.ok) throw new Error("Failed to get Enrollments");
  return res.json();
}

export async function createAdminEnrollment(payload: CreatePaymentFormData) {
  const res = await fetch(`/api/backend/admin/enrollments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json(); // always read the body

  console.log("ERROR", data);
  if (!res.ok) {
    // Throw with API's error message if available
    throw new Error(data.error || "Failed to create Enrollment");
  }

  return data;
}

export async function deleteAdminEnrollment(enrollmentId: number) {
  const res = await fetch(`/api/backend/admin/enrollments/${enrollmentId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Failed to get Enrollments");
}

export async function getStudentNICs() {
  const res = await fetch("/api/backend/admin/students/get-NICs", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch enrollments");
  return res.json();
}

export async function getCourseTypes(): Promise<CourseType[]> {
  const res = await fetch("/api/backend/admin/course-types", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store", // keep it fresh
  });
  if (!res.ok) throw new Error("Failed to load course types");
  return res.json();
}

export async function updateEnrollmentStatus(
  enrollmentId: number,
  enrollmentStatus: EnrollmentStatus,
) {
  await fetch(`/api/backend/admin/enrollments/${enrollmentId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ enrollmentStatus }),
  });
}

export async function updateEnrollmentCourseDay(
  enrollmentId: number,
  courseDayId: number,
) {
  const res = await fetch(
    `/api/backend/admin/enrollments/${enrollmentId}/update-course-day`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseDayId }),
    },
  );

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "Failed to update course day");
  }

  return (await res.json()) as { ok: true };
}
