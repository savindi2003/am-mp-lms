import Link from "next/link";

function Payments() {
  return (
    <div className="border border-slate-200 p-6 bg-white">
      <h3 className="text-lg font-medium text-slate-800 mb-4">Payments</h3>
      <ul className="divide-y divide-slate-200 text-sm">
        <li className="flex justify-between py-3">
          <span className="text-slate-700">Course: Web Development</span>
          <span className="text-yellow-500">Paid - Rs. 10000</span>
        </li>
        <li className="flex justify-between py-3">
          <span className="text-slate-700">Course: UI/UX Design</span>
          <span className="text-yellow-500">Paid - Rs. 8000</span>
        </li>
        <li className="flex justify-between py-3">
          <span className="text-slate-700">Course: Data Science</span>
          <span className="text-yellow-500">Pending</span>
        </li>
      </ul>
      <Link
        href="/payments"
        className="block text-sm font-medium text-yellow-500 hover:underline mt-4"
      >
        View All Payments
      </Link>
    </div>
  );
}

export default Payments;
