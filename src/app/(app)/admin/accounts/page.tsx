import AccountCreateModal from "@/modules/admin/accounts/components/AccountCreateModal";
import AccountTableView from "@/modules/admin/accounts/components/AccountTableView";
import { getAllAccountsForAdmin } from "@/modules/admin/accounts/data/actions";


export default async function AdminAccountsPage() {
  const users = await getAllAccountsForAdmin();

  return (
    <section className="container mx-auto px-4 md:px-0 lg:px-0">
      <h1 className="text-3xl font-semibold mb-5">
        Accounts
      </h1>

      <div className="flex justify-end my-5">
        <AccountCreateModal />
      </div>


      <AccountTableView users={users} />
    </section>
  );
}