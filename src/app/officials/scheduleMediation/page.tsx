import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-[#1F4251]">Schedule Mediation</h2>
          <p className="text-sm text-gray-600">
            Plan mediation sessions and notify parties.
          </p>
        </div>
        <div>
          <Button
            className="px-4 py-2 bg-pink-600 cursor-pointer text-white rounded hover:bg-pink-700"
          >
            New Mediation
          </Button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <table id="medTable" className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3">Case #</th>
              <th className="text-left px-4 py-3">Parties</th>
              <th className="text-left px-4 py-3">Scheduled Date</th>
              <th className="text-left px-4 py-3">Venue</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3">C-2025-006</td>
              <td className="px-4 py-3">A vs B</td>
              <td className="px-4 py-3">2025-10-25 10:00</td>
              <td className="px-4 py-3">Barangay Hall</td>
              <td className="px-4 py-3">
                <Button
                  className="px-3 py-1 bg-pink-600 cursor-pointer hover:bg-pink-700 text-white rounded text-sm"
                >
                  View
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
