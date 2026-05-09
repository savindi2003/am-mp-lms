import { Suspense } from "react";
import Spinner from "@/modules/shared/components/Spinner";
import AccountCardList from "@/modules/admin/accounts/components/AccountCardList";
import AccountFilter from "@/modules/admin/accounts/components/AccountFilter";
import { Role } from "@prisma/client";
import { getUserRoles } from "@/modules/admin/accounts/data/actions";
import AccountCreateModal from "@/modules/admin/accounts/components/AccountCreateModal";

export default async function AdminAccountsPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; page?: string }>;
}) {
  const rows = await getUserRoles();
  const userTypes = rows.map((r) => r.role).sort() as Role[];

  const role = (await searchParams).role;

  const pageParam = (await searchParams).page;
  const page = pageParam ? Number(pageParam) : 1;

  const selectedRole = userTypes.includes(role as Role)
    ? ((await searchParams).role as Role)
    : undefined;
  return (
    <section>
      <div className="mb-6">
        <h1 className="my-5 text-3xl font-semibold text-slate-800">Accounts</h1>
      </div>

      <div className="ml-auto w-fit">
        <AccountCreateModal />
      </div>
      <AccountFilter userTypes={userTypes} selectedRole={selectedRole} />

      <Suspense fallback={<Spinner />}>
        <AccountCardList selectedRole={selectedRole} page={page} />
      </Suspense>
    </section>
  );
}
