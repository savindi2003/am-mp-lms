import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);

        const studentId = Number(searchParams.get("studentId"));

        if (!studentId) {
            return NextResponse.json(
                { error: "Student ID required" },
                { status: 400 }
            );
        }

        // Today range
        const today = new Date();

        const start = new Date(today);
        start.setHours(0, 0, 0, 0);

        const end = new Date(today);
        end.setHours(23, 59, 59, 999);

        // Fetch lectures
        const lectures = await prisma.courseLectureLink.findMany({
            where: {
                lectureDate: {
                    gte: start,
                    lte: end,
                },

                // Only active lectures
                status: {
                    in: ["SCHEDULED", "LIVE"],
                },

                // Only enrolled student classes
                class: {
                    enrollments: {
                        some: {
                            studentId: studentId,
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