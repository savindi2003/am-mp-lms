const BASE_URL = "/api/backend/admin/free-classes";

export const getFreeLectures = async () => {
  const res = await fetch(BASE_URL, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch lectures");
  }

  return res.json();
};

export const createFreeLecture = async (
  data: any
) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to create lecture");
  }

  return res.json();
};

export const updateFreeLecture = async (
  id: number,
  data: any
) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update lecture");
  }

  return res.json();
};

export const deleteFreeLecture = async (
  id: number
) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete lecture");
  }

  return res.json();
};

export const getClassTypes = async () => {
  const res = await fetch("/api/backend/class-types", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch class types");
  }

  return res.json();
};

export const getInstructors = async () => {
  const res = await fetch("/api/backend/instructor", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch instructors");
  }

  return res.json();
};