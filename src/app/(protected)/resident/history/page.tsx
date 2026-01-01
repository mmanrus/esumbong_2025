export default function Page() {
  return (
    <>
      <h2 className="text-3xl font-bold mb-4">
        Concern &amp; Feedback History
      </h2>
      <ul className="space-y-5">
        <li className="bg-white p-6 rounded-xl shadow-md">
          <div className="font-semibold text-lg">Concern: Noise Complaint</div>
          <div className="text-base text-gray-500">
            Submitted: 2025-09-15 | Status: In Process
          </div>
        </li>
        <li className="bg-white p-6 rounded-xl shadow-md">
          <div className="font-semibold text-lg">
            Feedback: More Lighting in Playground
          </div>
          <div className="text-base text-gray-500">Submitted: 2025-09-10</div>
        </li>
        <li className="bg-white p-6 rounded-xl shadow-md">
          <div className="font-semibold text-lg">
            Concern: Stray Dogs in Street
          </div>
          <div className="text-base text-gray-500">
            Submitted: 2025-08-22 | Status: Resolved
          </div>
        </li>
      </ul>
    </>
  );
}
