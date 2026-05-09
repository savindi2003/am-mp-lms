import { FaReceipt } from "react-icons/fa";

export default function PaymentRow({ row }: any) {
  return (
    <tr className="border-t">
      <td className="p-3">{row.classTypeName}</td>
      <td className="p-3">{row.description}</td>
      <td className="p-3">{row.enrollmentId}</td>
      <td className="p-3">{row.month}</td>
      <td className="p-3">Rs. {row.paidAmount}</td>
      <td className="p-3">
        {new Date(row.paidDate).toLocaleDateString()}
      </td>

      <td className="p-3 flex justify-end">
        <button
          className="text-gray-400 hover:text-gray-800 cursor-pointer"
          title="View Receipt"
        >
          <FaReceipt />
        </button>
      </td>
    </tr>
  );
}