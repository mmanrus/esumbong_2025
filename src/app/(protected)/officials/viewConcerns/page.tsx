"use client";
import DialogAlert from "@/components/atoangUI/alertDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Info } from "lucide-react";
import { useState } from "react";

export default function Page() {
  const [status, setStatus] = useState("concern");
  const [input, setInput] = useState("");
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-[#1F4251]">View Concerns</h2>
          <p className="text-sm text-gray-600">
            Browse all submitted concerns. Click <strong>View</strong> to see
            details.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search by case, name, plate..."
            className="border p-2 rounded-md cursor-text focus:ring-2 focus:ring-blue-400"
          />

          <Select
            defaultValue="validated"
            onValueChange={setStatus}
            value={status}
          >
            <SelectTrigger className="w-[180px] cursor-pointer">
              <SelectValue placeholder="Report type" />
            </SelectTrigger>
            <SelectContent className="cursor-pointer">
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="validated">Validated</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
          <Button className="px-4 py-2 bg-green-600 rounded cursor-pointer hover:bg-gray-300">
            Export CSV
          </Button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <table id="vcTable" className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3">Case #</th>
              <th className="text-left px-4 py-3">Complainant</th>
              <th className="text-left px-4 py-3">Concern Type</th>
              <th className="text-left px-4 py-3">Date</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3">C-2025-001</td>
              <td className="px-4 py-3">Maria Santos</td>
              <td className="px-4 py-3">Noise Complaint</td>
              <td className="px-4 py-3">2025-10-01</td>
              <td className="px-4 py-3">
                <span className="inline-block px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-sm">
                  Pending
                </span>
              </td>
              <td className="px-4 py-3 flex gap-1">
                <Button className="px-3 py-1 cursor-pointer bg-blue-600 text-white rounded text-sm">
                  View
                </Button>
                <DialogAlert
                  trigger={
                    <Button className="px-3 py-1 cursor-pointer bg-amber-500 text-white rounded text-sm">
                      Validate
                    </Button>
                  }
                  Icon={Info}
                  IconColor="blue-600"
                  message={"Do you want to mark this data as Validated?"}
                  headMessage={""}
                />
              </td>
            </tr>

            <tr>
              <td className="px-4 py-3">C-2025-002</td>
              <td className="px-4 py-3">Juan Dela Cruz</td>
              <td className="px-4 py-3">Garbage Disposal</td>
              <td className="px-4 py-3">2025-10-03</td>
              <td className="px-4 py-3">
                <span className="inline-block px-2 py-1 rounded bg-green-100 text-green-800 text-sm">
                  Validated
                </span>
              </td>
              <td className="px-4 py-3 flex gap-1">
                <Button className="px-3 py-1 cursor-pointer bg-blue-600 text-white rounded text-sm">
                  View
                </Button>
                <DialogAlert
                  trigger={
                    <Button className="px-3 py-1 cursor-pointer bg-amber-500 text-white rounded text-sm">
                      Validate
                    </Button>
                  }
                  Icon={Info}
                  IconColor="blue-600"
                  message={"Do you want to mark this data as Validated?"}
                  headMessage={""}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
