import { useState, useEffect } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { KanbanColumn } from "./KanbanColumn";
import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = "http://127.0.0.1:8000"; 

export default function Kanban() {
  const [tasks, setTasks] = useState({
    TODO: [],
    IN_PROGRESS: [],
    DONE: [],
  });

  
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/kanban/`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("access_token")}`, 
          },
        });
      
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);
 
  
  const onDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || !over.id || !(over.id in tasks)) return;

    const sourceColumn = Object.keys(tasks).find((key) =>
      tasks[key].some((task) => task.id === active.id)
    );
    const destinationColumn = over.id;

    if (!sourceColumn || sourceColumn === destinationColumn) return;

    const taskToMove = tasks[sourceColumn].find((task) => task.id === active.id);

    
    try {
      await axios.patch(
        `${API_BASE_URL}/api/task/update/${taskToMove.id}/`,
        { status: destinationColumn },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("access_token")}`,
          },
        }
      );

      
      setTasks((prev) => ({
        ...prev,
        [sourceColumn]: prev[sourceColumn].filter((task) => task.id !== active.id),
        [destinationColumn]: [...prev[destinationColumn], { ...taskToMove, status: destinationColumn }],
      }));
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  
  const deleteTask = async (column, taskId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/kanban/delete/${taskId}/`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("access_token")}`,
        },
      });

      
      setTasks((prev) => ({
        ...prev,
        [column]: prev[column].filter((task) => task.id !== taskId),
      }));
    } catch (error) {
      console.error("Error deleting task:", error.response?.data || error);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full flex justify-center">
        <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <div className="grid grid-cols-3 p-6 w-full">
            {Object.keys(tasks).map((status) => (
              <SortableContext
                key={status}
                items={tasks[status].map((task) => task.id)}
                strategy={verticalListSortingStrategy}
              >
                <KanbanColumn title={status} tasks={tasks[status]} onDelete={(taskId) => deleteTask(status, taskId)} />
              </SortableContext>
            ))}
          </div>
        </DndContext>
      </div>
    </div>
  );
}
