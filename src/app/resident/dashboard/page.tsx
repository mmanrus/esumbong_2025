export default function Page() {
    return (
        <>
        <h2 className="text-3xl font-bold mb-8">Welcome back, Juan!</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-t-8 border-blue-600">
            <h3 className="text-lg font-medium text-gray-500 mb-2">Total Concerns</h3>
            <p className="text-5xl font-bold text-blue-700">7</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-t-8 border-yellow-500">
            <h3 className="text-lg font-medium text-gray-500 mb-2">Pending Issues</h3>
            <p className="text-5xl font-bold text-yellow-600">3</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-t-8 border-green-600">
            <h3 className="text-lg font-medium text-gray-500 mb-2">Resolved</h3>
            <p className="text-5xl font-bold text-green-700">4</p>
          </div>
        </div>
      </>
    );
}