"use client"
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
            Validate / Record Concerns
          </h2>
          <p className="text-sm text-gray-600">
            Review and validate incoming complaints before recording them.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Input
            onChange={(e) => setInput(e.target.value)}
            type="search"
            value={input}
            placeholder="Search..."
            className="border p-2 cursor-text rounded-md"
          />
          <Button className="px-4 py-2 bg-amber-500 cursor-pointer text-white rounded hover:bg-amber-600">
            Validate Selected
          </Button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <table id="valTable" className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">
                <Input type="checkbox" />
              </th>
              <th className="text-left px-4 py-3">Case #</th>
              <th className="text-left px-4 py-3">Complainant</th>
              <th className="text-left px-4 py-3">Details</th>
              <th className="text-left px-4 py-3">Date</th>
              <th className="text-left px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3">
                <Input type="checkbox" data-case="C-2025-003" />
              </td>
              <td className="px-4 py-3">C-2025-003</td>
              <td className="px-4 py-3">Ana Lopez</td>
              <td className="px-4 py-3">Illegal parking near market</td>
              <td className="px-4 py-3">2025-10-05</td>
              <td className="px-4 py-3">
                <Button className="px-3 py-1 rounded cursor-pointer bg-amber-500 hover:bg-amber-600 text-white text-sm">
                  Validate
                </Button>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3">
                <Input type="checkbox" data-case="C-2025-004" />
              </td>
              <td className="px-4 py-3">C-2025-004</td>
              <td className="px-4 py-3">Pedro Reyes</td>
              <td className="px-4 py-3">Street vendor dispute</td>
              <td className="px-4 py-3">2025-10-07</td>
              <td className="px-4 py-3">
                <Button className="px-3 py-1 rounded cursor-pointer bg-amber-500 hover:bg-amber-600 text-white text-sm">
                  Validate
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
