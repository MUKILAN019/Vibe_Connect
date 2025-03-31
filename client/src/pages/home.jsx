import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Create from "../components/Create";
import Kanban from "../components/Kanban";
import Lists from "../components/Lists";

export default function Home() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showKanban, setShowKanban] = useState(false);
  const [showList, setShowList] = useState(false);
  const [filterType, setFilterType] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [allTasks, setAllTasks] = useState([]);

  setTimeout(() => setLoading(false), 2000);

  useEffect(() => {
    fetchAllTasks();
  }, []);

  useEffect(() => {
    if (filterType) fetchTasks();
  }, [filterType]);

  const fetchAllTasks = async () => {
    try {
      const token = Cookies.get("access_token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.get("http://127.0.0.1:8000/api/tasks/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAllTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchTasks = async () => {
    try {
      const token = Cookies.get("access_token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.get("http://localhost:8000/api/tasks/", {
        headers: { Authorization: `Bearer ${token}` },
        params: filterType ? { filter: filterType } : {},
      });

      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const filterTasks = (taskList) => {
    if (!search) return taskList;
    
    return taskList.filter(task => 
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.status.toLowerCase().includes(search.toLowerCase()) ||
      task.created_by.username.toLowerCase().includes(search.toLowerCase()) ||
      (task.assignee && task.assignee.username.toLowerCase().includes(search.toLowerCase())) ||
      (task.due_date && task.due_date.toLowerCase().includes(search.toLowerCase()))
    );
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-green-950 text-white p-6">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <span className="loading loading-bars loading-xl"></span>
        </div>
      ) : (
        <>
          <h1 className="text-4xl font-extrabold text-green-300 mb-8">Task Manager</h1>

          <div className="flex justify-between items-center w-full max-w-6xl mb-6 px-6">
            <div className="flex space-x-4">
              <button
                className={`btn ${showKanban ? 'bg-blue-300' : 'bg-blue-600'} hover:bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg`}
                onClick={() => {
                  setShowKanban(true);
                  setShowList(false);
                  setFilterType(null);
                  setShowFilter(false);
                }}
              >
                Kanban
              </button>

              <button
                className={`btn ${showList ? 'bg-yellow-300' : 'btn-warning'} hover:bg-yellow-400 text-white px-4 rounded-lg shadow-lg`}
                onClick={() => {
                  setShowList(true);
                  setShowKanban(false);
                  setFilterType(null);
                  setShowFilter(false);
                }}
              >
                List
              </button>

              <div className="relative">
                <button
                  className="btn btn-error flex items-center justify-center px-6 py-2 rounded-lg shadow-lg"
                  onClick={() => setShowFilter(!showFilter)}
                >
                  Filter
                </button>

                {showFilter && (
                  <ul className="absolute left-0 mt-2 w-52 rounded-lg shadow-lg border border-green-600 bg-green-700 text-white flex flex-col">
                    <li>
                      <a
                        className="text-yellow-500 font-bold cursor-pointer block px-4 py-2 hover:bg-green-600 rounded-t-lg"
                        onClick={() => {
                          setFilterType("created_by_me");
                          setShowKanban(false);
                          setShowList(false);
                          setShowFilter(false);
                        }}
                      >
                        Created by Me
                      </a>
                    </li>
                    <li>
                      <a
                        className="text-orange-600 font-bold cursor-pointer block px-4 py-2 hover:bg-green-600 rounded-b-lg"
                        onClick={() => {
                          setFilterType("assigned_to_me");
                          setShowKanban(false);
                          setShowList(false);
                          setShowFilter(false);
                        }}
                      >
                        Assigned to Me
                      </a>
                    </li>
                  </ul>
                )}
              </div>
            </div>

            <div className="flex items-center gap-6">
              <Create fetchTasks={fetchAllTasks} />
              <label className="input bg-green-800">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                  </g>
                </svg>
                <input
                  type="search"
                  placeholder="Search tasks..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="grow"
                />
              </label>
            </div>
          </div>

          {showKanban && (
            <div className="w-full max-w-7xl overflow-x-auto flex justify-center">
              <Kanban tasks={filterTasks(allTasks)} fetchTasks={fetchAllTasks} />
            </div>
          )}

          {showList && (
            <div className="w-full max-w-7xl overflow-x-auto flex justify-center">
              <Lists tasks={filterTasks(allTasks)} />
            </div>
          )}

          {filterType && (
            <div className="w-full max-w-6xl p-4 bg-green-900 text-white rounded-lg shadow-lg mt-4">
              <h2 className="text-xl font-bold mb-2">
                {filterType === "created_by_me"
                  ? "Tasks Created by Me"
                  : filterType === "assigned_to_me"
                  ? "Tasks Assigned to Me"
                  : "All Tasks"}
              </h2>

              <table className="w-full border-collapse border border-green-600">
                <thead>
                  <tr className="bg-green-700 text-white">
                    <th className="border border-green-500 p-3">Title</th>
                    <th className="border border-green-500 p-3">Status</th>
                    <th className="border border-green-500 p-3">Created By</th>
                    <th className="border border-green-500 p-3">Assigned To</th>
                    <th className="border border-green-500 p-3">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filterTasks(tasks).length > 0 ? (
                    filterTasks(tasks).map((task) => (
                      <tr key={task.id}>
                        <td className="border border-green-500 p-3">{task.title}</td>
                        <td className="border border-green-500 p-3">{task.status}</td>
                        <td className="border border-green-500 p-3">{task.created_by.username} (ID: {task.created_by.id})</td>
                        <td className="border border-green-500 p-3">{task.assignee ? `${task.assignee.username} (ID: ${task.assignee.id})` : "Not assigned"}</td>
                        <td className="border border-green-500 p-3">{task.due_date || "No due date"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="border border-green-500 p-3 text-center">No tasks available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}