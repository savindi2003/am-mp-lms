// Minimal service: create CourseType -> presign + PUT -> create Course (+ CourseDay[])
export type Weekday =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export type CreateCourseApiPayload = {
  courseTypeName: string; // will create a CourseType row first
  description: string;
  instructorId: number;
  totalSessions: number;
  courseFee: number;
  days: Weekday[]; // CourseDay[] created server-side
  coverImage: File; // uploaded to S3 before create
};

//type PresignResponse = { uploadUrl: string; key: string };

async function presignCourseCover(file: File) {
  const res = await fetch("/api/backend/admin/courses/cover/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contentType: file.type }), // ✅ matches server
  });
  if (!res.ok) {
    let msg = "Failed to get upload URL";
    try {
      msg = (await res.json()).error ?? msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export async function createCourse(
  payload: CreateCourseApiPayload,
  createReq?: boolean,
) {
  // 1) CourseType
  const ctRes = await fetch("/api/backend/admin/course-types", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: payload.courseTypeName.trim(), createReq }),
  });
  if (!ctRes.ok) {
    let msg = "Failed to create course type";
    try {
      msg = (await ctRes.json()).error ?? msg;
    } catch {}
    throw new Error(msg);
  }
  const ct = (await ctRes.json()) as { id: number; name: string };

  // 2) Presign + PUT with required headers
  const { uploadUrl, key, requiredHeaders } = await presignCourseCover(
    payload.coverImage,
  );
  const putRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: requiredHeaders, // ✅ includes Content-Type and SSE header
    body: payload.coverImage,
  });
  if (!putRes.ok) throw new Error("Failed to upload course cover image");

  // 3) Create course (+ days)
  const res = await fetch("/api/backend/admin/courses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      description: payload.description,
      totalSessions: payload.totalSessions,
      instructorId: payload.instructorId,
      courseFee: payload.courseFee,
      // courseTypeName: payload.courseTypeName,
      courseTypeId: ct.id,
      days: payload.days,
      coverImageKey: key,
    }),
  });

  if (!res.ok) {
    const msg = (await res.json()).error || "Failed to create Course";
    throw new Error(msg);
  }
  return res.json();
}

// --- types used by the getter ---

export type CourseDayRow = { day: Weekday };

export type CourseDetail = {
  id: number;
  description: string;
  instructorId: number;
  courseFee: number;
  photo: string | null; // S3 key
  currentWeek?: number;
  totalSessions?: number;

  courseType: { id: number; name: string };
  instructor: {
    id: number;
    firstName: string;
    lastName: string;
    title: string;
    user?: { photo?: string | null } | null;
  } | null;

  courseDay: CourseDayRow[];
};

// --- API: get one course by id ---
export async function getCourse(courseId: number) {
  const res = await fetch(`/api/backend/admin/courses/${courseId}`, {
    method: "GET",
  });
  if (!res.ok) {
    let msg = "Failed to load course";
    try {
      msg = (await res.json()).error ?? msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json() as Promise<CourseDetail>;
}

export type UpdateCourseApiPayload = {
  id: number;
  courseTypeName: string; // upsert by name (returns id)
  description: string;
  totalSessions: number;
  instructorId: number;
  courseFee: number;
  days: Weekday[]; // CourseDay reconcile on server
  coverImage?: File | undefined; // optional new cover
  currentCourseTypeName: string;
};

async function upsertCourseTypeByName(name: string) {
  const res = await fetch("/api/backend/admin/course-types", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) {
    let msg = "Failed to create course type";
    try {
      msg = (await res.json()).error ?? msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json() as Promise<{ id: number; name: string }>;
}

// export async function updateCourse(payload: UpdateCourseApiPayload) {
//   // 1) Upsert/get CourseType id
//   const ct = await upsertCourseTypeByName(payload.courseTypeName.trim());
//
//   // 2) Optional cover upload
//   let coverImageKey: string | undefined = undefined;
//   if (payload.coverImage) {
//     const { uploadUrl, key, requiredHeaders } = await presignCourseCover(
//       payload.coverImage,
//     );
//     const putRes = await fetch(uploadUrl, {
//       method: "PUT",
//       headers: requiredHeaders,
//       body: payload.coverImage,
//     });
//     if (!putRes.ok) throw new Error("Failed to upload course cover image");
//     coverImageKey = key;
//   }
//   const courseId = payload.id;
//   // 3) PATCH course (+ days)
//   const res = await fetch(`/api/backend/admin/courses/${courseId}`, {
//     method: "PATCH",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       description: payload.description,
//       instructorId: payload.instructorId,
//       courseFee: payload.courseFee,
//       courseTypeId: ct.id,
//       days: payload.days,
//       courseTypeName: payload.courseTypeName,
//       // currentCourseTypeName: payload.currentCourseTypeName,
//       coverImageKey, // only sent if new image uploaded (or undefined)
//     }),
//   });
//
//   if (!res.ok) {
//     let msg = "Failed to update Course";
//     try {
//       msg = (await res.json()).error ?? msg;
//     } catch {}
//     throw new Error(msg);
//   }
//   return res.json();
// }

export async function updateCourse(payload: UpdateCourseApiPayload) {
  // Optional cover upload
  let coverImageKey: string | undefined;
  if (payload.coverImage) {
    const { uploadUrl, key, requiredHeaders } = await presignCourseCover(
      payload.coverImage,
    );
    const putRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: requiredHeaders,
      body: payload.coverImage,
    });
    if (!putRes.ok) throw new Error("Failed to upload course cover image");
    coverImageKey = key;
  }

  // PATCH directly with names (server will compare currentCourseTypeName vs courseTypeName)
  const res = await fetch(`/api/backend/admin/courses/${payload.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      description: payload.description,
      instructorId: payload.instructorId,
      courseFee: payload.courseFee,
      totalSessions: payload.totalSessions,
      days: payload.days,
      courseTypeName: payload.courseTypeName.trim(),
      currentCourseTypeName: payload.currentCourseTypeName.trim(),
      ...(coverImageKey ? { coverImageKey } : {}),
    }),
  });

  if (!res.ok) {
    let msg = "Failed to update Course";
    try {
      msg = (await res.json()).error ?? msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export async function deleteCourse(courseId: number) {
  const res = await fetch(`/api/backend/admin/courses/${courseId}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    let msg = "Failed to delete Course";
    try {
      msg = (await res.json()).error ?? msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}
