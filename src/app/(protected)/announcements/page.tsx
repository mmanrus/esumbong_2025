"use client";
import AnnouncementList from "@/components/atoangUI/announcement/announcements";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {  useState } from "react";

export default function Page() {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState({
    search: "",
  });
  

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-[#1F4251]">
            View Announcements
          </h2>
          <p className="text-sm text-gray-600">
            Browse all published announcements. Click <strong>View</strong> to
            read the full details.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search by case, name, plate..."
            className="border p-2 rounded-md cursor-text focus:ring-2 focus:ring-blue-400"
          />
          <Button
            onClick={() =>
              setQuery({
                search: input,
              })
            }
            className="px-4 py-2 bg-green-600 rounded cursor-pointer hover:bg-gray-300"
          >
            Search
          </Button>
        </div>
      </div>
      <div>
        <AnnouncementList sidebar={"false"} search={query.search}/>
      </div>
    </>
  );
}
