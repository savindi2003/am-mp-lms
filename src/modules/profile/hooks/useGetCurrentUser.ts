import { getCurrentUser as getCurrentUserApi } from "@/modules/profile/services/apiUser";
import { useEffect, useState } from "react";
import { User } from "@/modules/shared/types/typeUser";
import toast from "react-hot-toast";

export function useGetCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState<boolean>(false);

  async function getCurrentUser() {
    setUserLoading(true);

    try {
      const user = await getCurrentUserApi();
      setUser(user);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUserLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      await getCurrentUser();
    })();
  }, []);

  return {
    user,
    userLoading,
  };
}
