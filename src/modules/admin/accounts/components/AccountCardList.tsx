import CardBox from "@/modules/shared/components/CardBox";
import AccountCard from "@/modules/admin/accounts/components/AccountCard";
import { getAllAccountsForAdmin } from "@/modules/admin/accounts/data/actions";
import type { Role } from "@prisma/client";
import Pagination from "@/modules/shared/components/Pagination";
import Empty from "@/modules/shared/components/Empty";

export default async function AccountCardList({
  selectedRole,
  page,
}: {
  selectedRole?: Role;
  page: number;
}) {
  const { items, total } = await getAllAccountsForAdmin(page, selectedRole);

  if (!items.length) {
    return <Empty resourceName="user account" />;
  }

  return (
    <>
      <CardBox>
        <CardBox.Item
          data={items}
          render={(u) => <AccountCard key={u.id} user={u} />}
        />
      </CardBox>
      <Pagination count={total} />
    </>
  );
}
