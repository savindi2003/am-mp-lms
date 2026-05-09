import { getCurrentUser } from "@/modules/shared/data/action";
import NavBar from "@/modules/shared/components/NavBar";
import { CurrentUserDTO } from "@/modules/shared/dto/User.dto";

export default async function NavBarServer() {
  const user: CurrentUserDTO | null = await getCurrentUser();
  if (!user) return null;

  return <NavBar user={user} />;
}
