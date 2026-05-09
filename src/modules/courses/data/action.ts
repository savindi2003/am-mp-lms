"use server";

import { prisma } from "@/lib/db";

export async function getCourses() {
  const courses = await prisma.course.findMany({
    include: {
      courseType: {
        select: {
          name: true,
          id: true,
        },
      },
      instructor: {
        include: {
          user: true,
        },
      },
    },
    orderBy: { id: "asc" },
  });
  console.log(courses);
  return courses.map((course) => ({
    ...course,
    createdAt: course.createdAt.toISOString(),
    instructor: {
      ...course.instructor,
      createdAt: course.createdAt.toISOString(),
      user: {
        ...course.instructor.user,
        createdAt: course.instructor.user.createdAt.toISOString(),
      },
    },
  }));
}

export async function getInstructors() {
  return await prisma.instructor.findMany({
    orderBy: { id: "asc" },
  });
}


// classes
// classes
export async function getClassTypes() {
  try {
    const classTypes = await prisma.classType.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
      },
    });

    return classTypes;
  } catch (error) {
    console.error("getClassTypes error:", error);
    return [];
  }
}

export async function getClasses() {
  return await prisma.class.findMany({
    include: {
      classType: true,
    },
    orderBy: { id: "desc" },
  });
}

