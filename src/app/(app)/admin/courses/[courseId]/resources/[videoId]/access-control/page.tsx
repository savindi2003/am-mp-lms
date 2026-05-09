import AccessControlTable from "@/modules/admin/youtube-videos/[videoId]/access-control/components/AccessControlTable";

async function AdminCourseVideoAccessPage({
  params,
}: {
  params: Promise<{ videoId: string; courseId: string }>;
}) {
  const courseId = Number((await params).courseId);
  const videoId = (await params).videoId;

  return <AccessControlTable paramId={{ courseId, videoId }} />;
}

export default AdminCourseVideoAccessPage;
