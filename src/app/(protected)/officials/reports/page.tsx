"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export default function Page() {
  const [isLoading, setLoading] = useState(false);
  const [reportType, setReportType] = useState("concern");

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-[#1F4251]">
            Reports & Analytics
          </h2>
          <p className="text-sm text-gray-600">
            Generate summaries and charts (prototype UI).
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Select defaultValue="concern" onValueChange={setReportType} value={reportType}>
            <SelectTrigger className="w-[180px] cursor-pointer">
              <SelectValue placeholder="Report type" />
            </SelectTrigger>
            <SelectContent className="cursor-pointer">
              <SelectItem value="monthly">Monthly Summary</SelectItem>
              <SelectItem value="concern">By Concern Type</SelectItem>
              <SelectItem value="status">By Status</SelectItem>
            </SelectContent>
          </Select>
          <Button className="px-4 py-2 cursor-pointer bg-[#1F4251] text-white rounded">
            Generate
          </Button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div id="reportContent">
          <p className="text-gray-600">
            No report generated yet. Click <strong>Generate</strong> to preview
            sample data.
          </p>
        </div>
      </div>
    </>
  );
}
