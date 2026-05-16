export async function listLectureLinks(courseId: number) {
  const res = await fetch(
    `/api/backend/admin/courses/${courseId}/lecture-links`
  );
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createLectureLink(courseId: number, payload: any) {
  const res = await fetch(
    `/api/backend/admin/courses/${courseId}/lecture-links`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) throw new Error(await res.text());
}


export async function updateLectureStatus(
  courseId: number,
  lectureId: string,
  status: string
) {

  alert(lectureId);
  alert(courseId);

  const res = await fetch(
    `/api/backend/admin/courses/${courseId}/lecture-links/${lectureId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    }
  );

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

export async function updateLecture(courseId: string,
                              lectureId: string,
                              payload: any
) {
  console.log("PAYLOAD:", payload);
  const res = await fetch(
    `/api/backend/admin/courses/${courseId}/lecture-links/${lectureId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}