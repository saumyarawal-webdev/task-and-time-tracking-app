"use client";

import { useState, useEffect } from "react";
import { Play, Square, Trash2, Clock, Pencil } from "lucide-react";
import { useUpdateTask } from "@/hooks/useUpdateTask";
import { useDeleteTask } from "@/hooks/useDeleteTask";
import { useActiveTimer } from "@/hooks/useActiveTimer";
import { useStartTimer } from "@/hooks/useStartTimer";
import { useStopTimer } from "@/hooks/useStopTimer";
import { Task } from "@/hooks/useTasks"; 

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
}

export default function TaskCard({ task, onEdit }: TaskCardProps) {
  const [elapsed, setElapsed] = useState(0);

  const { mutate: updateTask } = useUpdateTask();
  const { mutate: deleteTask } = useDeleteTask();
  
  const { data: activeTimer } = useActiveTimer();
  const { mutate: startTimer, isPending: starting } = useStartTimer();
  const { mutate: stopTimer, isPending: stopping } = useStopTimer();

  const isActive = activeTimer?.taskId === task.id;
  const isAnotherTimerActive = !!activeTimer && !isActive;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && activeTimer?.startTime) {
      interval = setInterval(() => {
        const start = new Date(activeTimer.startTime).getTime();
        const now = new Date().getTime();
        setElapsed(Math.floor((now - start) / 1000));
      }, 1000);
    } else {
      setElapsed(0);
    }
    return () => clearInterval(interval);
  }, [isActive, activeTimer]);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateTask({ id: task.id, status: e.target.value as any });
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 gap-4 transition-all">
      <div className="flex-1 space-y-2">
        <h3 className="font-medium text-zinc-900 dark:text-zinc-100">{task.title}</h3>
        {task.description && <p className="text-sm text-zinc-500 line-clamp-1">{task.description}</p>}
        <select
          value={task.status}
          onChange={handleStatusChange}
          className="text-sm p-1 rounded border border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-700 dark:text-zinc-300 outline-none cursor-pointer"
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {isActive && (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-mono text-lg">
            <Clock className="animate-pulse" size={18} />
            {formatTime(elapsed)}
          </div>
        )}

        {isActive ? (
          <button
            onClick={() => stopTimer()}
            disabled={stopping}
            className="p-2 rounded-md bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors disabled:opacity-50"
            title="Stop Tracking"
          >
            <Square size={20} className="fill-current" />
          </button>
        ) : (
          <button
            onClick={() => startTimer(task.id)}
            disabled={starting || isAnotherTimerActive}
            className="p-2 rounded-md bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50"
            title={isAnotherTimerActive ? "Stop active timer first" : "Start Tracking"}
          >
            <Play size={20} className="fill-current" />
          </button>
        )}

        <button
          onClick={onEdit}
          className="p-2 rounded-md text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          title="Edit Task"
        >
          <Pencil size={20} />
        </button>

        <button
          onClick={() => deleteTask(task.id)}
          className="p-2 rounded-md text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          title="Delete Task"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}