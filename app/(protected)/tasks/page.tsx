"use client";

import { useState } from "react";
import { useTasks, Task } from "@/hooks/useTasks";
import { Loader2, Plus } from "lucide-react";
import TaskCard from "../../components/TaskCard";
import TaskModal from "../../components/TaskModal";

export default function TasksPage() {
  const { data: tasks, isLoading } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const handleCreateNew = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Tasks & Tracking
        </h1>
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-md hover:opacity-90 transition-colors"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
          New Task
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-10 text-zinc-500">
          <Loader2 className="animate-spin" size={24} />
          <span>Loading tasks...</span>
        </div>
      ) : (
        <div className="grid gap-4">
          {tasks?.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => handleEditTask(task)}
            />
          ))}
          {tasks?.length === 0 && (
            <div className="text-center py-10 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-lg">
              <p className="text-zinc-500 dark:text-zinc-400">
                No tasks yet. Time to hunt!
              </p>
            </div>
          )}
        </div>
      )}

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        taskToEdit={taskToEdit}
      />
    </div>
  );
}
