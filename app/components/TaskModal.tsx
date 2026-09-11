"use client";

import { useState, useEffect } from "react";
import { useCreateTask } from "@/hooks/useCreateTask";
import { useUpdateTask } from "@/hooks/useUpdateTask";
import { useGenerateTask } from "@/hooks/useGenerateTask";
import { Loader2, X, Sparkles } from "lucide-react";
import { Task } from "@/hooks/useTasks";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
}

export default function TaskModal({
  isOpen,
  onClose,
  taskToEdit,
}: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { mutate: createTask, isPending: isCreating } = useCreateTask();
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask();
  const { mutate: generateTask, isPending: isGenerating } = useGenerateTask();

  const isPending = isCreating || isUpdating;
  const isEditing = !!taskToEdit;

  useEffect(() => {
    if (isOpen) {
      setTitle(taskToEdit?.title || "");
      setDescription(taskToEdit?.description || "");
    }
  }, [isOpen, taskToEdit]);

  if (!isOpen) return null;

  const handleGenerateAI = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Strict stop: do not submit the form

    if (!title.trim() && !description.trim()) return;

    generateTask(
      { title, description },
      {
        onSuccess: (data) => {
          setTitle(data.title);
          setDescription(data.description);
        },
      },
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const onSuccess = () => {
      setTitle("");
      setDescription("");
      onClose();
    };

    if (isEditing) {
      updateTask({ id: taskToEdit.id, title, description }, { onSuccess });
    } else {
      createTask({ title, description }, { onSuccess });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-0">
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg w-full max-w-md p-4 md:p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 md:top-4 md:right-4 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          <X className="w-4 h-4 md:w-5 md:h-5" />
        </button>

        <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-zinc-900 dark:text-zinc-100">
          {isEditing ? "Edit Task" : "Add New Task"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
          <div>
            <label className="block text-xs md:text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Title
            </label>
            <div className="relative">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., follow up with designer"
                className="w-full p-1.5 md:p-2 pr-8 md:pr-10 text-sm md:text-base rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-900 dark:text-zinc-100 outline-none focus:border-zinc-500"
                autoFocus
              />
              <button
                type="button"
                onClick={handleGenerateAI}
                disabled={
                  isGenerating || (!title.trim() && !description.trim())
                }
                className="absolute right-1 md:right-2 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-indigo-500 dark:hover:text-indigo-400 disabled:opacity-50 transition-colors"
                title="Enhance with AI"
              >
                {isGenerating ? (
                  <Loader2 className="animate-spin w-3 h-3 md:w-4 md:h-4" />
                ) : (
                  <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs md:text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Any extra details..."
              rows={3}
              className="w-full p-1.5 md:p-2 text-sm md:text-base rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-900 dark:text-zinc-100 outline-none focus:border-zinc-500 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isPending || !title.trim()}
            className="w-full flex items-center justify-center gap-1.5 md:gap-2 py-1.5 md:py-2 text-sm md:text-base bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-md hover:opacity-90 disabled:opacity-50 transition-colors mt-2"
          >
            {isPending && (
              <Loader2 className="animate-spin w-4 h-4 md:w-5 md:h-5" />
            )}
            {isPending ? "Saving..." : isEditing ? "Update Task" : "Save Task"}
          </button>
        </form>
      </div>
    </div>
  );
}
