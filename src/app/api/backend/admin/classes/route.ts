import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { createGoogleMeeting } from '@/services/meeting-service';


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const classTypeId = searchParams.get("classTypeId");

  const classes = await prisma.class.findMany({
    where: {
      ...(classTypeId ? { classTypeId: Number(classTypeId) } : {}),
    },

    include: {
      classType: true,
      instructor: true,
    },

    orderBy: {
      id: "desc",
    },
  });

  return NextResponse.json(
    classes.map((c) => ({
      id: c.id,
      description: c.description,
      classFee: c.classFee,
      classType: c.classType.name,
      instructor: `${c.instructor.firstName} ${c.instructor.lastName}`,
      
    }))
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    
    const { classTypeName, description, instructorId, classFee, photo, linkExpireDate } = body;

    
    const classType = await prisma.classType.findUnique({
      where: { name: classTypeName },
    });

    if (!description || !linkExpireDate) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    if (!classType) {
      return NextResponse.json({ error: "Invalid class type" }, { status: 400 });
    }

    
    const meetingInfo = await createGoogleMeeting(description, linkExpireDate);

    
    const newClass = await prisma.class.create({
      data: {
        description,
        classFee: Number(classFee), 
        instructorId: Number(instructorId), 
        classTypeId: classType.id,
        photo: photo || null,
        
        meetingLink: meetingInfo.meetingLink, 
        googleEventId: meetingInfo.googleEventId,
        expireDate: new Date(linkExpireDate),
      },
    });

    return NextResponse.json(newClass);
    
  } catch (err: any) {
    console.error("DETAILED ERROR:", err);
    
    return NextResponse.json(
      { error: err.message || "Failed to create class" },
      { status: 500 }
    );
  }
}

