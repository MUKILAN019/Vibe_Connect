import { useDroppable } from "@dnd-kit/core";
import { SortableItem } from "./SortableItem";
import { Trash2 } from "lucide-react";

export function KanbanColumn({ title, tasks, onDelete }) {
  const { setNodeRef } = useDroppable({ id: title });

  return (
    <div 
      ref={setNodeRef} 
      className="bg-green-900 p-6 rounded-xl min-h-[400px] w-96 shadow-lg border border-green-700 flex flex-col items-center"
    >
      <h2 className="text-2xl font-bold mb-4 capitalize text-green-300">{title}</h2>
      <div className="space-y-4 w-full">
        {tasks.map((task) => (
          <div key={task.id} className="flex justify-between items-center bg-green-800 p-3 rounded-md">
            <SortableItem id={task.id} title={task.title} />
            <button onClick={() => onDelete(task.id)} className="text-red-500 hover:text-red-700">
              <Trash2 size={20} className="text-red-400" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
