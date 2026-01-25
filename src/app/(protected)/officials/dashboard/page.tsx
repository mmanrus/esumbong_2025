"use client"
import { useAuth } from "@/contexts/authContext";
import { getFirstName } from "@/lib/formatWord";

export default function Page() {
  const { user } = useAuth()
  return (
    <>
      <div>
        <h2 className="text-3xl font-bold mb-8">Welcome, {getFirstName(user?.fullname)}!</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-t-8 border-blue-600">
            <h3 className="text-lg font-medium text-gray-500 mb-2">
              Total Concerns
            </h3>
            <p className="text-5xl font-bold text-blue-700">28</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-t-8 border-yellow-500">
            <h3 className="text-lg font-medium text-gray-500 mb-2">
              Ongoing Cases
            </h3>
            <p className="text-5xl font-bold text-yellow-600">8</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-t-8 border-green-600">
            <h3 className="text-lg font-medium text-gray-500 mb-2">Resolved</h3>
            <p className="text-5xl font-bold text-green-700">15</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-t-8 border-purple-600">
            <h3 className="text-lg font-medium text-gray-500 mb-2">
              Mediations Scheduled
            </h3>
            <p className="text-5xl font-bold text-purple-700">5</p>
          </div>
        </div>
      </div>
    </>
  );
}

