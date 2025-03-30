import { useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { KanbanColumn } from "./KanbanColumn";

const sampleTasks = {
  todo: [{ id: "1", title: "Task 1" }, { id: "2", title: "Task 2" }],
  inProgress: [{ id: "3", title: "Task 3" }],
  done: [{ id: "4", title: "Task 4" }],
};

export default function Kanban() {
  const [tasks, setTasks] = useState(sampleTasks);

  const onDragEnd = (event) => {
    const { active, over } = event;
    if (!over || !over.id || !(over.id in tasks)) return; 

    const sourceColumn = Object.keys(tasks).find((key) =>
      tasks[key].some((task) => task.id === active.id)
    );
    const destinationColumn = over.id;

    if (!sourceColumn || sourceColumn === destinationColumn) return;

    const taskToMove = tasks[sourceColumn].find((task) => task.id === active.id);

    setTasks((prev) => ({
      ...prev,
      [sourceColumn]: prev[sourceColumn].filter((task) => task.id !== active.id),
      [destinationColumn]: [...prev[destinationColumn], taskToMove],
    }));
  };

  const deleteTask = (column, taskId) => {
    setTasks((prev) => ({
      ...prev,
      [column]: prev[column].filter((task) => task.id !== taskId),
    }));
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
