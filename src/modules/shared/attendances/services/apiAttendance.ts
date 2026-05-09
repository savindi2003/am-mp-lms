import { AttendanceType } from "@/modules/shared/attendances/types/typeAttendance";

export type RosterRow = {
  enrollmentId: number;
  name: string;
  present: boolean;
  note?: string;
};

export type GetRosterResponse = {
  course: {
    id: number;
    title: string;
    totalSessions: number;
    currentWeek: number;
  };
  roster: RosterRow[];
};

export async function getAdminAttendances(
  enrollmentId: number,
): Promise<AttendanceType[]> {
  const res = await fetch(
    `/api/backend/admin/enrollments/${enrollmentId}/attendances/get-student-by-enrollment-id`,
    {
      cache: "no-store",
    },
  );
  if (!res.ok) {
    let msg = "Failed to load roster";
    try {
      msg = (await res.json()).error ?? msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

// tiny helper to list courses for the dropdown
export async function getAdminCourses(): Promise<
  Array<{
    id: number;
    title: string;
    totalSessions: number;
    currentWeek: number;
  }>
> {
  const res = await fetch("/api/backend/admin/courses-lite", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to load courses");
  return res.json();
}

export async function getAttendanceByEnrollmentId(
  enrollmentId: number,
) {
  const res = await fetch(
    `/api/backend/admin/enrollments/${enrollmentId}/attendances/get-student-by-enrollment-id`,
    {
      cache: "no-store",
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data?.error || "Failed to fetch attendance",
    );
  }

  return data;
}

export async function getUserById(id: number) {
  const res = await fetch(`/api/backend/user/get-user-by-id?id=${id}`, {
    method: "GET",
    cache: "no-store",
  });
  if (!res.ok) {
    let msg = "Failed to get User";
    try {
      msg = (await res.json()).error ?? msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export async function createAttendance(
  enrollmentId: number,
  payload: {
    present: boolean;
  },
) {
  const res = await fetch(
    `/api/backend/admin/enrollments/${enrollmentId}/attendances`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
  if (!res.ok) {
    let msg = "Failed to create Attendance";
    try {
      msg = (await res.json()).error ?? msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export async function deleteAttendance(
  attendanceId: number,
  enrollmentId: number,
) {
  const res = await fetch(
    `/api/backend/admin/enrollments/${enrollmentId}/attendances/${attendanceId}`,
    {
      method: "DELETE",
    },
  );
  if (!res.ok) {
    let msg = "Failed to delete Attendance";
    try {
      msg = (await res.json()).error ?? msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export async function updateAttendance(
  enrollmentId: number,
  attendanceId: number,
  payload: {
    present: boolean;
    weekNo: number;
  },
) {
  const res = await fetch(
    `/api/backend/admin/enrollments/${enrollmentId}/attendances/${attendanceId}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
  if (!res.ok) {
    let msg = "Failed to update Attendance";
    try {
      msg = (await res.json()).error ?? msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export async function getCourseAttendanceDetailsByEnrollmentId(
  enrollmentId: number,
) {
  const res = await fetch(
    `/api/backend/admin/enrollments/${enrollmentId}/attendances/get-course-attendances-details-by-enrollment-id`,
    {
      method: "GET",
    },
  );
  if (!res.ok) {
    let msg = "Failed to get course Attendance details";
    try {
      msg = (await res.json()).error ?? msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export async function updateCourseCurrentWeekByEnrollmentId(
  enrollmentId: number,
  payload: {
    currentWeek: number;
  },
) {
  const res = await fetch(
    `/api/backend/admin/enrollments/${enrollmentId}/attendances/update-course-current-week-by-enrollment-id`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
  if (!res.ok) {
    let msg = "Failed to update course week";
    try {
      msg = (await res.json()).error ?? msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export async function getStudentByEnrollmentId(enrollmentId: number) {
  const res = await fetch(
    `/api/backend/admin/enrollments/${enrollmentId}/attendances/get-student-by-enrollment-id`,
    {
      method: "GET",
    },
  );
  if (!res.ok) {
    let msg = "Failed to get student details";
    try {
      msg = (await res.json()).error ?? msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}
