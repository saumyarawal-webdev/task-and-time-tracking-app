"use client";

import { useState, useMemo } from "react";
import { useTimeLogs } from "@/hooks/useTimeLogs";
import {
  Search,
  Calendar,
  Filter,
  Clock,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function TimeLogPage() {
  const { data: rawData, isLoading } = useTimeLogs();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [customDate, setCustomDate] = useState("");
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  // Smart client-side filtering and duration recalculation
  const filteredData = useMemo(() => {
    if (!rawData) return [];

    return rawData
      .map((summary) => {
        // 1. Filter by Search Term
        if (
          searchTerm &&
          !summary.task.title.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return null;
        }

        // 2. Filter by Task Status
        if (statusFilter !== "all" && summary.task.status !== statusFilter) {
          return null;
        }

        // 3. Filter Individual Logs by Date
        let filteredLogs = summary.logs;
        if (dateFilter !== "all") {
          filteredLogs = summary.logs.filter((log) => {
            const logDate = new Date(log.startTime).toDateString();
            const today = new Date().toDateString();
            const yesterdayDate = new Date();
            yesterdayDate.setDate(yesterdayDate.getDate() - 1);
            const yesterday = yesterdayDate.toDateString();

            if (dateFilter === "today") return logDate === today;
            if (dateFilter === "yesterday") return logDate === yesterday;
            if (dateFilter === "custom" && customDate) {
              // Ensure we compare timezone-adjusted local dates
              const custom = new Date(customDate);
              return (
                logDate ===
                new Date(
                  custom.getTime() + custom.getTimezoneOffset() * 60000,
                ).toDateString()
              );
            }
            return true;
          });
        }

        // If no logs match the date filter, hide the task completely
        if (filteredLogs.length === 0) return null;

        // Recalculate dynamic total based strictly on the filtered logs
        const recalculatedTotal = filteredLogs.reduce(
          (acc, log) => acc + (log.durationSeconds || 0),
          0,
        );

        return {
          ...summary,
          logs: filteredLogs,
          totalDurationSeconds: recalculatedTotal,
        };
      })
      .filter(Boolean); // Remove nulls
  }, [rawData, searchTerm, statusFilter, dateFilter, customDate]);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, "0")}h ${m.toString().padStart(2, "0")}m ${s.toString().padStart(2, "0")}s`;
  };

  const toggleExpand = (taskId: string) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        Time Logs History
      </h1>

      {/* Filters Section */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-zinc-950 p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-900 dark:text-zinc-100 outline-none focus:border-zinc-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={18} className="text-zinc-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-900 dark:text-zinc-100 outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-zinc-400" />
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="p-2 rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-900 dark:text-zinc-100 outline-none cursor-pointer"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="custom">Custom Date</option>
          </select>
          {dateFilter === "custom" && (
            <input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="p-2 rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-900 dark:text-zinc-100 outline-none"
            />
          )}
        </div>
      </div>

      {/* Data List */}
      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-10 text-zinc-500">
          <Loader2 className="animate-spin" size={24} />
          <span>Digging up time records...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredData.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-lg">
              <p className="text-zinc-500 dark:text-zinc-400">
                No time logs match your hunt.
              </p>
            </div>
          ) : (
            filteredData.map((summary: any) => (
              <div
                key={summary.task.id}
                className="border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 overflow-hidden"
              >
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                  onClick={() => toggleExpand(summary.task.id)}
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {summary.task.title}
                    </h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 mt-2 inline-block capitalize">
                      {summary.task.status.replace("_", " ")}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 font-mono">
                      <Clock size={16} />
                      {formatTime(summary.totalDurationSeconds)}
                    </div>
                    {expandedTaskId === summary.task.id ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </div>
                </div>

                {/* Expanded Logs History */}
                {expandedTaskId === summary.task.id && (
                  <div className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 p-4 space-y-2">
                    {summary.logs.map((log: any) => (
                      <div
                        key={log.id}
                        className="flex justify-between items-center text-sm p-2 rounded-md bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800"
                      >
                        <span className="text-zinc-500">
                          {new Date(log.startTime).toLocaleString()}
                        </span>
                        <span className="font-mono text-zinc-700 dark:text-zinc-300">
                          {log.endTime
                            ? formatTime(log.durationSeconds)
                            : "Active..."}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
