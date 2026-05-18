import AccountCreateModal from "@/modules/admin/accounts/components/AccountCreateModal";
import AccountTableView from "@/modules/admin/accounts/components/AccountTableView";
import { getAllAccountsForAdmin } from "@/modules/admin/accounts/data/actions";


export default async function AdminAccountsPage() {
  const users = await getAllAccountsForAdmin();

  return (
    <section>
      <h1 className="text-3xl font-semibold mb-5">
        Accounts
      </h1>

      <div className="flex justify-end">
        <AccountCreateModal />
      </div>


      <AccountTableView users={users} />
    </section>
  );
}