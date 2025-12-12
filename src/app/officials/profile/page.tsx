import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Page() {
  return (
    <>
      <h2 className="text-3xl font-bold mb-4 text-[#1F4251]">Profile</h2>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-gray-600">Name</label>
            <input
              className="w-full border p-2 rounded mt-1"
              value="Captain Reyes"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Role</label>
            <input
              className="w-full border p-2 rounded mt-1"
              value="Barangay Captain"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-gray-600">Email</label>
            <input
              className="w-full border p-2 rounded mt-1"
              value="captain.reyes@barangay.ph"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-gray-600">Bio</label>
            <Input type="text-area" className="w-full border p-2 rounded mt-1" />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button className="px-4 py-2 bg-[#1F4251] text-white rounded">
            Save Profile
          </Button>
        </div>
      </div>
    </>
  );
}
