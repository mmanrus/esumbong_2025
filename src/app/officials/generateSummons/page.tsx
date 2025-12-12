"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Page() {
  const [input, setInput] = useState("");
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-[#1F4251]">
            Generate Summons
          </h2>
          <p className="text-sm text-gray-600">
            Create summons documents for concerned parties.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Input
            placeholder="Search case..."
            className="border p-2 rounded-md"
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
          <Button
            //onclick="openModal('generate','C-2025-002')"
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 cursor-pointer"
          >
            New Summons
          </Button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <table id="summonsTable" className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3">Case #</th>
              <th className="text-left px-4 py-3">Respondent</th>
              <th className="text-left px-4 py-3">Type</th>
              <th className="text-left px-4 py-3">Date Issued</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3">C-2025-002</td>
              <td className="px-4 py-3">Local Vendor</td>
              <td className="px-4 py-3">Notice to Comply</td>
              <td className="px-4 py-3">—</td>
              <td className="px-4 py-3">
                <Button
                  className="px-3 py-1
                   bg-purple-600 text-white rounded text-sm hover:bg-purple-700 cursor-pointer"
                >
                  Generate
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
