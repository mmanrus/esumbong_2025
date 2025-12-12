"use client";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Select } from "@radix-ui/react-select";
import { useState } from "react";

export default function Page() {
  const [selectedStatus, setSelectedStatus] = useState("quick-update");
  const [caseStatus, selectedCaseStatus] = useState("")

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-[#1F4251]">Update Status</h2>
          <p className="text-sm text-gray-600">
            Change case statuses quickly (e.g., Resolved, In Progress).
          </p>
        </div>
        <div>
          <Select onValueChange={setSelectedStatus} value={selectedStatus}>
            <SelectTrigger className="w-[180px] cursor-pointer">
              <SelectValue
                placeholder="Quick update sample"
                className="text-black"
              />
            </SelectTrigger>

            <SelectContent className="cursor-pointer">
              <SelectItem value="resolved">Mark sample as Resolved</SelectItem>
              <SelectItem value="in-progress">
                Mark sample as In Progress
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3">Case #</th>
              <th className="text-left px-4 py-3">Complainant</th>
              <th className="text-left px-4 py-3">Current Status</th>
              <th className="text-left px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3">C-2025-005</td>
              <td className="px-4 py-3">Ligaya Ramos</td>
              <td className="px-4 py-3">
                <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-sm">
                  Assigned
                </span>
              </td>
              <td className="px-4 py-3">

                <Select
                  onValueChange={selectedCaseStatus}
                  value={caseStatus}
                >
                  <SelectTrigger className="w-[100px] cursor-pointer">
                    <SelectValue
                      placeholder="Change status"
                    />
                  </SelectTrigger>

                  <SelectContent className="cursor-pointer">
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
