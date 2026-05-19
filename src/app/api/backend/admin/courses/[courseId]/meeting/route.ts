import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { createGoogleMeeting } from "@/services/meeting-service";



export async function PUT(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) {

    try {
        const { courseId } = await params;

        const classId = Number(courseId);
        const { expireDate } = await req.json();

        const cls = await prisma.class.findUnique({
            where: { id: classId },
        });

        if (!cls) {
            return NextResponse.json({ error: "Class not found" }, { status: 404 });
        }

        // 1. new meeting create
        const meeting = await createGoogleMeeting(
            cls.description,
            expireDate
        );

        // 2. update DB
        const updated = await prisma.class.update({
            where: { id: classId },
            data: {
                meetingLink: meeting.meetingLink,
                googleEventId: meeting.googleEventId,
                expireDate: new Date(expireDate),
            },
        });

        return NextResponse.json(updated);
    } catch (err: any) {
        return NextResponse.json(
            { error: err.message || "Update failed" },
            { status: 500 }
        );
    }
}