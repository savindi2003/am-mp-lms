import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);

        // const studentId = Number(searchParams.get("studentId"));
        const studentId = Number(searchParams.get("studentId"));

        if (!studentId) {
            return NextResponse.json(
                { error: "Student ID required" },
                { status: 400 }
            );
        }


        const today = new Date();

        const start = new Date(today);
        start.setHours(0, 0, 0, 0);

        const end = new Date(today);
        end.setHours(23, 59, 59, 999);

        const student = await prisma.student.findUnique({
            where: {
                userId: studentId, 
            },
            select: {
                id: true,
            },
        });

        if (!student) {
            return NextResponse.json(
                { error: "Student not found" },
                { status: 404 }
            );
        }


        const lectures = await prisma.courseLectureLink.findMany({
            where: {
                lectureDate: {
                    gte: start,
                    lte: end,
                },


                toTime: {
                    gte: new Date(),
                },


                status: {
                    in: ["SCHEDULED", "LIVE"],
                },


                class: {
                    enrollments: {
                        some: {
                            studentId: student.id,
                            enrollmentStatus: "ACTIVE",
                        },
                    },
                },
            },

            orderBy: {
                fromTime: "asc",
            },

            take: 4,

            include: {
                class: {
                    include: {
                        classType: true,
                    },
                },
            },
        });

        return NextResponse.json({
            lectures,
        });

    } catch (error) {
        console.error("Student lectures error:", error);

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
