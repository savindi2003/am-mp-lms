"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/app/auth";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import type { AccountUser } from "@/modules/admin/accounts/types/typeAccountUser";
import { updateAccountSchema } from "@/modules/admin/accounts/validators/updateAccountSchema";
import { resetPasswordSchema } from "@/modules/admin/accounts/validators/resetPasswordSchema";
import { createAccountSchema } from "@/modules/admin/accounts/validators/createAccountSchema";
import { Gender, Role } from "@prisma/client";

const PAGE_SIZE = Number(process.env.NEXT_PUBLIC_PAGE_SIZE!);

async function assertAdmin() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  // if ((session.user as any).role !== "ADMIN") throw new Error("Forbidden");
}

type CreateState = { ok?: boolean; id?: number; error?: string };

export async function createAccount(
  prev: CreateState,
  form: FormData,
): Promise<CreateState> {
  try {
    await assertAdmin();

    const input = createAccountSchema.parse({
      role: form.get("role"),
      email: form.get("email"),
      NIC: form.get("NIC"),
      password: form.get("password"),
      firstName: form.get("firstName"),
      lastName: form.get("lastName"),
      title: (form.get("title") as string) || undefined,

      // student-only fields (optional in base; required when role === "STUDENT")
      contactNo: (form.get("contactNo") as string) || undefined,
      address: (form.get("address") as string) || undefined,
      dob: (form.get("dob") as string) || undefined,
      gender: (form.get("gender") as Gender) || undefined,
      guardianContactNo: (form.get("guardianContactNo") as string) || undefined,
      guardianFirstName: (form.get("guardianFirstName") as string) || undefined,
      guardianLastName: (form.get("guardianLastName") as string) || undefined,
    });

    const hashedPassword = await bcrypt.hash(input.password, 10);

    const existingUser = await prisma.user.findUnique({
      where: { NIC: input.NIC },
    });
    const existingEmail = await prisma.user.findUnique({
      where: { email: input.email },
    });
    if (existingUser) return { error: "NIC already exist" };
    if (existingEmail) return { error: "Email already exist" };

    const user = await prisma.user.create({
      data: {
        role: input.role,
        email: input.email,
        NIC: input.NIC,
        hashedPassword,
        ...(input.role === "ADMIN"
          ? {
              admin: {
                create: {
                  firstName: input.firstName,
                  lastName: input.lastName,
                },
              },
            }
          : input.role === "INSTRUCTOR"
            ? {
                instructor: {
                  create: {
                    firstName: input.firstName,
                    lastName: input.lastName,
                    title: input.title ?? "",
                  },
                },
              }
            : {
                student: {
                  create: {
                    firstName: input.firstName,
                    lastName: input.lastName,
                    contactNo: input.contactNo!,
                    address: input.address!,
                    dob: new Date(input.dob!),
                    gender: input.gender as Gender,
                    guardianContactNo: input.guardianContactNo!,
                    guardianFirstName: input.guardianFirstName!,
                    guardianLastName: input.guardianLastName!,
                  },
                },
              }),
      },
      select: { id: true },
    });

    revalidatePath("/admin/accounts");
    return { ok: true, id: user.id };
  } catch (e) {
    return { error: "Failed to create account" };
  }
}
export async function deleteAccount(form: FormData): Promise<void> {
  const userId = Number(form.get("userId"));
  if (!userId) return;
  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin/accounts");
}

export async function updateAccount(form: FormData) {
  await assertAdmin();
  const input = updateAccountSchema.parse({
    userId: Number(form.get("userId")),
    email: form.get("email") || undefined,
    NIC: form.get("NIC") || undefined,
    firstName: form.get("firstName") || undefined,
    lastName: form.get("lastName") || undefined,
    title: form.get("title") || undefined,
    address: form.get("address") || undefined,
    contactNo: form.get("contactNo") || undefined,
    dob: form.get("dob") || undefined,
    gender: form.get("gender") || undefined,
    guardianContactNo: form.get("guardianContactNo") || undefined,
    guardianFirstName: form.get("guardianFirstName") || undefined,
    guardianLastName: form.get("guardianLastName") || undefined,
  });

  // Read role to decide which profile to update
  const user = await prisma.user.findUnique({
    where: { id: input.userId },
    select: { role: true },
  });
  if (!user) throw new Error("User not found");

  // --- 1) Pre-check uniqueness (email / NIC) ---
  const [emailTaken, nicTaken] = await Promise.all([
    input.email
      ? prisma.user.findFirst({
          where: { email: String(input.email), id: { not: input.userId } },
          select: { id: true },
        })
      : null,
    input.NIC
      ? prisma.user.findFirst({
          where: { NIC: String(input.NIC), id: { not: input.userId } },
          select: { id: true },
        })
      : null,
  ]);

  if (emailTaken)
    throw new Error("Email is already in use by another account.");
  if (nicTaken) throw new Error("NIC is already in use by another account.");
  // Update email on User if provided
  if (input.email) {
    await prisma.user.update({
      where: { id: input.userId },
      data: { email: input.email },
    });
  }

  if (input.NIC) {
    await prisma.user.update({
      where: { id: input.userId },
      data: { NIC: input.NIC },
    });
  }

  // Update role-specific profile names
  if (input.firstName || input.lastName || input.title) {
    if (user.role === "ADMIN") {
      await prisma.admin.update({
        where: { userId: input.userId },
        data: {
          ...(input.firstName ? { firstName: input.firstName } : {}),
          ...(input.lastName ? { lastName: input.lastName } : {}),
        },
      });
    } else if (user.role === "INSTRUCTOR") {
      await prisma.instructor.update({
        where: { userId: input.userId },
        data: {
          ...(input.firstName ? { firstName: input.firstName } : {}),
          ...(input.lastName ? { lastName: input.lastName } : {}),
          ...(input.title !== undefined ? { title: input.title } : {}),
        },
      });
    } else if (user.role === "STUDENT") {
      await prisma.student.update({
        where: { userId: input.userId },
        data: {
          ...(input.firstName ? { firstName: input.firstName } : {}),
          ...(input.lastName ? { lastName: input.lastName } : {}),
          ...(input.address ? { address: input.address } : {}),
          ...(input.contactNo ? { contactNo: input.contactNo } : {}),
          ...(input.guardianContactNo
            ? { guardianContactNo: input.guardianContactNo }
            : {}),
          ...(input.guardianFirstName
            ? { guardianFirstName: input.guardianFirstName }
            : {}),
          ...(input.guardianLastName
            ? { guardianLastName: input.guardianLastName }
            : {}),
          ...(input.dob ? { dob: new Date(input.dob) } : {}),
          ...(input.gender ? { gender: input.gender } : {}),
        },
      });
    }
  }

  return { ok: true };
}

export async function resetPassword(form: FormData) {
  await assertAdmin();
  const input = resetPasswordSchema.parse({
    userId: Number(form.get("userId")),
    newPassword: form.get("newPassword"),
  });

  const hashedPassword = await bcrypt.hash(input.newPassword, 10);
  await prisma.user.update({
    where: { id: input.userId },
    data: { hashedPassword },
  });

  return { ok: true };
}

export async function getAllAccountsForAdmin(
  page: number,
  selectedRole?: Role,
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const where = selectedRole ? { role: selectedRole } : undefined;
  const skip = (page - 1) * PAGE_SIZE;

  const [total, users] = await prisma.$transaction([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        NIC: true,
        photo: true,
        role: true,
        createdAt: true,
        admin: { select: { firstName: true, lastName: true } },
        instructor: {
          select: { firstName: true, lastName: true, title: true },
        },
        student: {
          select: {
            firstName: true,
            lastName: true,
            contactNo: true,
            address: true,
            dob: true,
            gender: true,
            guardianContactNo: true,
            guardianFirstName: true,
            guardianLastName: true,
          },
        },
      },
      orderBy: { id: "asc" },
      skip,
      take: PAGE_SIZE,
    }),
  ]);

  const items = users.map((u): AccountUser => {
    let profile;

    if (u.role === "ADMIN" && u.admin) {
      profile = {
        firstName: u.admin.firstName,
        lastName: u.admin.lastName,
      };
    } else if (u.role === "INSTRUCTOR" && u.instructor) {
      profile = {
        firstName: u.instructor.firstName,
        lastName: u.instructor.lastName,
        title: u.instructor.title,
      };
    } else if (u.role === "STUDENT" && u.student) {
      profile = {
        firstName: u.student.firstName,
        lastName: u.student.lastName,
        contactNo: u.student.contactNo,
        address: u.student.address,
        dob: u.student.dob,
        gender: u.student.gender,
        guardianContactNo: u.student.guardianContactNo,
        guardianFirstName: u.student.guardianFirstName,
        guardianLastName: u.student.guardianLastName,
      };
    }

    return {
      id: u.id,
      email: u.email,
      NIC: u.NIC,
      role: u.role as AccountUser["role"],
      photo: u.photo,
      createdAt: u.createdAt,
      profile,
    };
  });

  return { items, total };
}

export async function getUserRoles() {
  return await prisma.user.findMany({
    select: { role: true },
    distinct: ["role"],
  });
}
