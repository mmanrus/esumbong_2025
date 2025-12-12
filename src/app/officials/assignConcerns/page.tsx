"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
export default function Page() {
  const [selectedAssignee, setSelectedAssignee] = useState("");
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-[#1F4251]">
            Assign / Respond
          </h2>
          <p className="text-sm text-gray-600">
            Assign validated concerns to personnel or units and log responses.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Input
            id="assignSearch"
            type="search"
            placeholder="Search..."
            className="border p-2 rounded-md"
          />
        
          <Select
            defaultValue="1"
            onValueChange={setSelectedAssignee}
            value={selectedAssignee}
          >
            <SelectTrigger className="w-[210px] cursor-pointer">
              <SelectValue placeholder="Filter by Assignee" />
            </SelectTrigger>
            <SelectContent className="cursor-pointer">
              <SelectItem value="1">Officer A</SelectItem>
              <SelectItem value="1">Barangay Cooperatives</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <table id="assignTable" className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3">Case #</th>
              <th className="text-left px-4 py-3">Concern</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Assigned To</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3">C-2025-002</td>
              <td className="px-4 py-3">Garbage Disposal</td>
              <td className="px-4 py-3">
                <span className="px-2 py-1 rounded bg-green-100 text-green-800 text-sm">
                  Validated
                </span>
              </td>
              <td className="px-4 py-3">—</td>
              <td className="px-4 py-3 flex gap-1">
                <Button className="px-3 py-1 bg-green-600 hover:bg-green-900 text-white rounded text-sm">
                  Assign
                </Button>
                <Button className="px-3 py-1 bg-gray-200 hover:bg-gray-500 text-mute rounded text-sm ml-2">
                  Mark Responded
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
