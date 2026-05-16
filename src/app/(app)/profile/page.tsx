import UpdatePassword from "@/modules/profile/components/UpdatePassword";
import UserDetails from "@/modules/profile/components/UserDetails";
import { auth } from "@/app/auth";
import { getStudentDetailsByUserId } from "@/modules/profile/data/action";
import ShowDetails from "@/modules/shared/components/ShowDetails";

export default async function StudentProfilePage() {
  const session = await auth();
  const userRole = session?.user.role;
  const userId = Number(session?.user.id);
  const student = await getStudentDetailsByUserId(userId);
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 m-auto">
      {/* Header */}
      <h1 className="text-3xl font-semibold text-slate-800 mb-8">My Profile</h1>

      <div className="grid grid-cols-1 gap-8">
        {/* Profile Photo + Info */}
        <UserDetails />
        {userRole === "STUDENT" && student && (
          <div className="m-auto w-fit">
            <ShowDetails
              title="Student Details"
              contactNo={student.contactNo}
              dob={student.dob.toString()}
              gender={student.gender}
              guardianContactNo={student.guardianContactNo ?? undefined}
              guardianFirstName={student.guardianFirstName}
              guardianLastName={student.guardianLastName}
              address={student.address}
            />
          </div>
        )}

        {/* Reset Password */}
        <div className="p-6 lg:w-lg lg:m-auto">
          <h3 className="text-lg font-medium text-slate-800 mb-4">
            Update Password
          </h3>
          <UpdatePassword />
        </div>
      </div>
    </div>
  );
}
