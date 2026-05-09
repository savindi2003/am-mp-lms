export const runtime = "nodejs"; // avoid Edge for bcrypt / Prisma
export const dynamic = "force-dynamic";

import { handlers } from "@/app/auth";

export const { GET, POST } = handlers;
