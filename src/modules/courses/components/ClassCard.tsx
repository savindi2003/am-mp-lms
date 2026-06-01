import Image from "next/image";
import Link from "next/link";

export default function ClassCard({
  classItem,
  role,
}: any) {
  const href =
    role === "ADMIN"
      ? `/admin/courses/${classItem.id}/resources`
      : `/courses`;

  return (
    <div className="max-w-sm bg-slate-50 border border-slate-200 shadow-sm">
      
      <Link href={href}>
        <Image
          src={
            classItem.photo
              ? `/api/storage/image?key=${classItem.photo}`
              : "/default-class.jpg"
          }
          alt="class"
          width={400}
          height={250}
          className="w-full h-auto object-cover"
        />
      </Link>

      <div className="p-4">
        <h2 className="text-lg font-semibold text-slate-700">
          {classItem.classType.name}
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          {classItem.description}
        </p>

       

       
      </div>
    </div>
  );
}