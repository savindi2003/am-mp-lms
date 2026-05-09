import { getUserById as getUserByIdApi } from "@/modules/shared/attendances/services/apiAttendance";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type User = {
  admin?: {
    firstName: string;
    lastName: string;
  };
  instructor: { firstName: string; lastName: string };
} | null;

export function useGetUserById(id: number) {
  const [user, setUser] = useState<User>(null);

  const [loading, setLoading] = useState(false);

  async function getUserById() {
    setLoading(true);
    try {
      const data = await getUserByIdApi(id);
      console.log("ID", id);
      setUser(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to get user");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      await getUserById();
    })();
  }, []);

  return {
    user,
    loading,
    getUserById,
  };
}
