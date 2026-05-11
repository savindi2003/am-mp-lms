import Image from "next/image";
import Link from "next/link";
import { Progress } from "@/modules/ui/progress";

export default function StudentClassCard({
  classData,
  progress,
  presentCount,
  totalSessions
}: any) {
  return (
    <div className="w-full max-w-md bg-white border shadow-sm hover:shadow-md transition">
      <Link href={`/courses/${classData.id}/resources`}>
        <Image
          // src={`/api/storage/image?key=${encodeURIComponent(
          //   classData.photo || "/default-class.jpg"
          // )}`}

          src={
            classData.photo
              ? `/api/storage/image?key=${encodeURIComponent(classData.photo)}`
              : "/default-class.jpg"
          }


          alt="Class image"
          width={400}
          height={250}
          className="w-full h-55"
          unoptimized
        />
      </Link>

      <div className="p-5 space-y-4">
        <Link href={`/courses/${classData.id}/resources`}>
          <h5 className="font-semibold">
            {classData.classType.name}
          </h5>
        </Link>

        {/* <div>
          <h4 className="font-medium">
            {classData.instructor.firstName}{" "}
            {classData.instructor.lastName}
          </h4>
          <p className="text-sm text-gray-500">
            {classData.instructor.title}
          </p>
        </div> */}

        <p className="text-xl text-slate-600">
          {classData.description}
        </p>

        <div className="flex gap-4 text-sm text-gray-500">
          <p>attended: {presentCount}</p>
          <p>sessions: {totalSessions}</p>
        </div>

        <Progress value={progress} className="h-3" />

        <p className="text-right text-sm">{progress}% complete</p>
      </div>
    </div>
  );
}