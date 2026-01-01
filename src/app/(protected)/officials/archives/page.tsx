import { Button } from "@/components/ui/button";

export default function Page() {
    return (
        <>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-[#1F4251]">Archives</h2>
            <p className="text-sm text-gray-600">Archived concerns and past mediation records.</p>
          </div>
          <div>
            <Button className="px-4 py-2 cursor-pointer bg-gray-200 rounded text-black hover:bg-gray-300">Restore Sample</Button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3">Archived Case #</th>
                <th className="text-left px-4 py-3">Title</th>
                <th className="text-left px-4 py-3">Archived On</th>
                <th className="text-left px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-3">C-2024-050</td>
                <td className="px-4 py-3">Noise Complaint - Resolved</td>
                <td className="px-4 py-3">2024-12-20</td>
                <td className="px-4 py-3"><Button className="px-3 py-1 bg-green-600 cursor-pointer text-white rounded text-sm">View</Button></td>
              </tr>
            </tbody>
          </table>
        </div>
        </>
    );
}