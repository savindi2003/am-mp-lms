import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import PaymentsClient from "@/modules/shared/components/PaymentsClient";

export default async function PaymentsPage() {
  const session = await auth();

  if (session?.user?.role === "STUDENT") {
    redirect("/login");
  }

  return <PaymentsClient />;
}