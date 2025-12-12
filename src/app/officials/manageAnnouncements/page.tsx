import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <>
      <h2 className="text-3xl font-bold mb-6 text-[#1F4251] flex items-center space-x-3">
        <i data-lucide="megaphone" className="w-7 h-7"></i>
        <span>Manage Announcements</span>
      </h2>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <form id="announcementForm" className="space-y-4">
          <input
            id="announcementInput"
            type="text"
            placeholder="Enter new announcement..."
            className="w-full border p-3 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
          <Button className="cursor-pointer bg-blue-600 text-white px-5 py-3 rounded-md hover:bg-blue-700">
            Add Announcement
          </Button>
        </form>
        <hr className="my-6" />
        <h3 className="text-xl font-semibold mb-4 text-gray-700">
          Current Announcements
        </h3>
        <ul id="announcementList" className="space-y-3 text-gray-800">
          <li className="bg-blue-50 border-l-4 border-blue-600 p-3 rounded">
            📢 Barangay Council Meeting at 9 AM on October 12.
          </li>
          <li className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
            ⚠️ Submit all pending reports before Friday.
          </li>
        </ul>
      </div>
    </>
  );
}
