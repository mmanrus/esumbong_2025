
export default function Page() {
  return (
    <>
      <h2 className="text-3xl font-bold mb-4">Track Concern Status</h2>
      <div className="overflow-x-auto bg-white shadow-md rounded-xl border">
        <table className="min-w-full text-lg">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="text-left px-6 py-3">ID</th>
              <th className="text-left px-6 py-3">Subject</th>
              <th className="text-left px-6 py-3">Date</th>
              <th className="text-left px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t hover:bg-gray-50">
              <td className="px-6 py-3">001</td>
              <td className="px-6 py-3">Street Light</td>
              <td className="px-6 py-3">2025-10-01</td>
              <td className="px-6 py-3 text-yellow-600 font-semibold">
                Pending
              </td>
            </tr>
            <tr className="border-t hover:bg-gray-50">
              <td className="px-6 py-3">002</td>
              <td className="px-6 py-3">Garbage Collection</td>
              <td className="px-6 py-3">2025-09-28</td>
              <td className="px-6 py-3 text-green-600 font-semibold">
                Resolved
              </td>
            </tr>
            <tr className="border-t hover:bg-gray-50">
              <td className="px-6 py-3">003</td>
              <td className="px-6 py-3">Noise Complaint</td>
              <td className="px-6 py-3">2025-09-15</td>
              <td className="px-6 py-3 text-blue-600 font-semibold">
                In Process
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
