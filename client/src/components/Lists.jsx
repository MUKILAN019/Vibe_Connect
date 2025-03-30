export default function Lists() {
    return (
      <div className="w-full max-w-6xl p-4 bg-green-900 text-white rounded-lg shadow-lg">
        <table className="w-full border-collapse border border-green-600">
          <thead>
            <tr className="bg-green-700 text-white">
              <th className="border border-green-500 p-3">Title</th>
              <th className="border border-green-500 p-3">Status</th>
              <th className="border border-green-500 p-3">Created By</th>
              <th className="border border-green-500 p-3">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {/* Data rows can be mapped here */}
          </tbody>
        </table>
      </div>
    );
  }