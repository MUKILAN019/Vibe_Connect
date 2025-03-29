import { useDroppable } from "@dnd-kit/core";
import { SortableItem } from "./SortableItem";

export function KanbanColumn({ title, tasks }) {
  const { setNodeRef } = useDroppable({ id: title });

  return (
    <div 
      ref={setNodeRef} 
      className="bg-green-900 p-6 rounded-xl min-h-[400px] w-96 shadow-lg border border-green-700 flex flex-col items-center"
    >
      <h2 className="text-2xl font-bold mb-4 capitalize text-green-300">{title}</h2>
      <div className="space-y-4 w-full">
        {tasks.map((task) => (
          <SortableItem key={task.id} id={task.id} title={task.title} />
        ))}
      </div>
    </div>
  );
}
