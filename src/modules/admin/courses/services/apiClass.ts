export type CreateClassApiPayload = {
  classTypeName: string;
  description: string;
  instructorId: number;
  classFee: number;
  month: string;
  coverImage?: File;
};

async function presignClassCover(file: File) {
  const res = await fetch("/api/backend/admin/classes/cover/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contentType: file.type }),
  });

  if (!res.ok) throw new Error("Presign failed");
  return res.json();
}

export async function createClass(payload: CreateClassApiPayload) {
  // 1. ClassType
  const ctRes = await fetch("/api/backend/admin/class-types", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: payload.classTypeName.trim() }),
  });

  if (!ctRes.ok) throw new Error("Failed class type");

  const ct = await ctRes.json();

  let coverImageKey: string | null = null;

  // 2. Try upload (optional)
  if (payload.coverImage) {
    try {
      const { uploadUrl, key, requiredHeaders } =
        await presignClassCover(payload.coverImage);

      const putRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: requiredHeaders,
        body: payload.coverImage,
      });

      if (putRes.ok) {
        coverImageKey = key;
      }
    } catch {
      // ignore → keep null
    }
  }

  // 3. Create Class
  const res = await fetch("/api/backend/admin/classes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      description: payload.description,
      instructorId: payload.instructorId,
      classFee: payload.classFee,
      classTypeId: ct.id,
      photo: coverImageKey, //  null allowed
      month: payload.month, //  NEW
    }),
  });

  if (!res.ok) {
    const msg = (await res.json()).error || "Failed create class";
    throw new Error(msg);
    console.log(msg);
  }

  return res.json();
}