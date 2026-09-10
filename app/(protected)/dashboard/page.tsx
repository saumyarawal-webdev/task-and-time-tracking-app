"use client";

import { useSummary } from "../../../hooks/useSummery";
import { useTimeLogs } from "@/hooks/useTimeLogs";
import { useUser } from "@/hooks/useUser";
import { useDashboardAI } from "@/hooks/useDashboardAI";
import { Loader2, Activity, Clock, CheckCircle2, ListTodo, Sparkles, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const { data: summary, isLoading: isSummaryLoading, isError } = useSummary();
  const { data: logs } = useTimeLogs();
  const { data: user } = useUser();

  // Create the payload only when all required data is ready
  const aiPayload = summary && logs && user?.name ? {
    summary,
    logs,
    userName: user.name
  } : null;

  // AI Hook manages its own caching and loading state
  const { data: aiData, isLoading: isAiLoading } = useDashboardAI(aiPayload);

  const formatTime = (totalSeconds: number | undefined) => {
    if (!totalSeconds) return "0h 0m";
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  if (isSummaryLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] text-zinc-500">
        <Loader2 className="animate-spin mr-2" size={24} />
        <span>Loading dashboard</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500 bg-red-50 dark:bg-red-900/10 rounded-xl m-6">
        Failed to fetch summary data. Please try again.
      </div>
    );
  }

  const totalTasks = (summary?.completedTasks || 0) + (summary?.pendingOrInProgress || 0);
  const completionPercentage = totalTasks === 0 ? 0 : Math.round(((summary?.completedTasks || 0) / totalTasks) * 100);
  const pendingPercentage = totalTasks === 0 ? 0 : 100 - completionPercentage;

  const topCards = [
    {
      title: "Today's Tracked",
      value: formatTime(summary?.totalTimeTracked),
      icon: Clock,
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-100 dark:bg-indigo-900/30",
    },
    {
      title: "Tasks Touched",
      value: summary?.tasksWorkedOn || 0,
      icon: Activity,
      color: "text-cyan-600 dark:text-cyan-400",
      bg: "bg-cyan-100 dark:bg-cyan-900/30",
    },
    {
      title: "Completed",
      value: summary?.completedTasks || 0,
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
    },
    {
      title: "In Progress",
      value: summary?.pendingOrInProgress || 0,
      icon: ListTodo,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-100 dark:bg-amber-900/30",
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-zinc-50/50 dark:bg-zinc-950/50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Overview</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Here is what is happening today.</p>
        </div>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {topCards.map((card, index) => (
          <div 
            key={index} 
            className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl shadow-sm flex items-center gap-5 transition-transform hover:-translate-y-1 duration-300"
          >
            <div className={`p-4 rounded-xl ${card.bg}`}>
              <card.icon className={card.color} size={26} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
                {card.title}
              </p>
              <h3 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
                {card.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        
        {/* AI Integration Panel (Spans 2 columns) */}
        <div className="lg:col-span-2 relative overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl shadow-sm p-6 flex flex-col justify-center min-h-[300px] group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/10 dark:to-purple-900/10 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-4 h-full">
            {isAiLoading ? (
              <div className="flex flex-col items-center gap-4 text-indigo-500">
                <Loader2 className="animate-spin" size={32} />
                <p className="text-sm font-medium animate-pulse">AI is analyzing your productivity...</p>
              </div>
            ) : aiData?.insight ? (
              <div className="flex flex-col items-center gap-4">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl">
                  <Sparkles className="text-indigo-600 dark:text-indigo-400" size={28} />
                </div>
                <p className="text-lg font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed max-w-xl">
                  {aiData.insight}
                </p>
              </div>
            ) : (
              <>
                <div className="p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl">
                  <Sparkles className="text-indigo-600 dark:text-indigo-400" size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">AI Summary Engine</h3>
                  <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mt-2">
                    Log some time on your tasks today, and I will generate your personalized productivity insight!
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Status Distribution Panel (Spans 1 column) */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Task States</h3>
            <TrendingUp className="text-zinc-400" size={20} />
          </div>

          <div className="flex-1 flex flex-col justify-center gap-8">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Completed</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">{completionPercentage}%</span>
              </div>
              <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 dark:bg-emerald-400 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-amber-600 dark:text-amber-400">Pending / Working</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">{pendingPercentage}%</span>
              </div>
              <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 dark:bg-amber-400 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${pendingPercentage}%` }}
                />
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}