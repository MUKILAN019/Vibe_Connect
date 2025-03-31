import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export default function Create() {
  const [taskName, setTaskName] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateTask = async () => {
    setLoading(true);
    setError("");

    const Token = Cookies.get("access_token"); 
    console.log(Token);
    
    if (!Token) {
      setError("User not authenticated.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/task/create/",
        {
          title: taskName,
          assignee_id: assignedTo,
          due_date: dueDate,
        },
        {
          headers: {
            Authorization: `Bearer ${Token}`, 
            "Content-Type": "application/json",
          },
          withCredentials: true, 
        }
      );

      alert("Task created successfully!");
      setTaskName("");
      setAssignedTo("");
      setDueDate("");
      document.getElementById("task_modal").close();
    } catch (err) {
      
      setError(
        err.response?.data?.error || "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center">
      <button
        className="btn bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition-all"
        onClick={() => document.getElementById("task_modal").showModal()}
      >
        + New Task
      </button>

      <dialog id="task_modal" className="modal">
        <div className="modal-box w-11/12 max-w-2xl bg-gradient-to-b from-blue-900 to-green-900 text-white shadow-lg rounded-xl">
          <h3 className="text-2xl font-bold text-center text-green-300 mb-4">
            Create New Task
          </h3>

          {error && <p className="text-red-400 text-center">{error}</p>}

          <div className="space-y-4">
            <div>
              <label className="block text-green-300 text-sm font-medium mb-1">
                Task Name
              </label>
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className="w-full p-3 bg-blue-700 text-white border border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                placeholder="Enter task name..."
              />
            </div>

            <div>
              <label className="block text-green-300 text-sm font-medium mb-1">
                Assign To (User ID)
              </label>
              <input
                type="text"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full p-3 bg-blue-700 text-white border border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                placeholder="Enter user ID..."
              />
            </div>

            <div>
              <label className="block text-green-300 text-sm font-medium mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-3 bg-blue-700 text-white border border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
              />
            </div>
          </div>

          <div className="modal-action flex justify-end space-x-4 mt-4">
            <form method="dialog">
              <button className="btn bg-red-500 hover:bg-red-400 text-white px-5 py-2 rounded-lg shadow-md transition-all">
                Cancel
              </button>
            </form>
            <button
              onClick={handleCreateTask}
              className="btn bg-green-600 hover:bg-green-500 text-white px-5 py-2 rounded-lg shadow-md transition-all"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Task"}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
