"use client";
import { UserConcernRows } from "@/components/atoangUI/concern/userConcernRows";

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
              <th className="text-left px-6 py-3">View</th>
            </tr>
          </thead>
          <tbody>
            <UserConcernRows/>
            
          </tbody>
        </table>
      </div>
    </>
  )
}
