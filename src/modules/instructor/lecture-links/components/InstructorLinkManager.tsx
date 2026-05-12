"use client";

import LectureLinkList from "./LectureLinkList";
import { useLectureLinks } from "../hooks/useLectureLinks";
import Spinner from "@/modules/shared/components/Spinner";

export default function InstructorLinkManage({
  courseId,
}: {
  courseId: number;
}) {
  const { links, loading, getLinks } = useLectureLinks(courseId);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      

      
      <LectureLinkList links={links} />
    </div>
  );
}