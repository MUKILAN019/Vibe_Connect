import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export default function Lists({ tasks: propTasks, fetchTasks }) {
  const [internalTasks, setInternalTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = Cookies.get("access_token");

  useEffect(() => {
    if (propTasks) {
      setInternalTasks(propTasks);
      setLoading(false);
      return;
    }

    if (!token) {
      setError("No token found. User must log in.");
      setLoading(false);
      return;
    }

    axios
      .get("https://vibe-connect-15wk.onrender.com/api/tasks/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setInternalTasks(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching tasks. Please try again.");
        console.error("Error fetching tasks:", error);
        setLoading(false);
      });
  }, [token, propTasks]);

  return (
    <div className="w-full max-w-6xl p-4 bg-green-900 text-white rounded-lg shadow-lg">
      {loading ? (
        <div className="text-center p-4">Loading tasks...</div>
      ) : error ? (
        <div className="text-center text-red-500 p-4">{error}</div>
      ) : (
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
            {internalTasks.length > 0 ? (
              internalTasks.map((task) => (
                <tr key={task.id} className="text-center">
                  <td className="border border-green-500 p-3">{task.title}</td>
                  <td className="border border-green-500 p-3">{task.status}</td>
                  <td className="border border-green-500 p-3">{task.created_by.username}</td>
                  <td className="border border-green-500 p-3">{task.due_date || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="border border-green-500 p-3 text-center">
                  No tasks available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}