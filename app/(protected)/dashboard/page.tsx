"use client";

import { useState, useEffect } from "react";
import { useSummary } from "../../../hooks/useSummary";
import { useTimeLogs } from "@/hooks/useTimeLogs";
import { useUser } from "@/hooks/useUser";
import { useDashboardAI } from "@/hooks/useDashboardAI";
import {
  Loader2,
  Activity,
  Clock,
  CheckCircle2,
  ListTodo,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";

export default function DashboardPage() {
  const [showAnimations, setShowAnimations] = useState(false);
  const [triggerAi, setTriggerAi] = useState(false);

  const { data: summary, isLoading: isSummaryLoading, isError } = useSummary();
  const { data: logs } = useTimeLogs();
  const { data: user } = useUser();

  // Animation trigger: fires only after dashboard loading is complete
  useEffect(() => {
    if (!isSummaryLoading && !isError) {
      const timer = setTimeout(() => setShowAnimations(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isSummaryLoading, isError]);

  // AI only triggers when button is clicked (triggerAi becomes true)
  const aiPayload =
    triggerAi && summary && logs && user?.name
      ? { summary, logs, userName: user.name }
      : null;
  const { data: aiData, isLoading: isAiLoading } = useDashboardAI(aiPayload);

  const formatTime = (totalSeconds: number | undefined) => {
    if (!totalSeconds) return "0h 0m 0s";
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.floor(totalSeconds % 60);
    return `${h}h ${m}m ${s}s`;
  };

  if (isSummaryLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] text-zinc-500">
        <Loader2 className="animate-spin mr-2" size={24} />
        <span>Loading dashboard...</span>
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

  const safeTrackedTime = Number(summary?.totalTimeTracked || 0);
  const totalTasks =
    (summary?.completedTasks || 0) + (summary?.pendingOrInProgress || 0);

  const completionPercentage =
    totalTasks === 0
      ? 0
      : Math.round(((summary?.completedTasks || 0) / totalTasks) * 100);
  const pendingPercentage = totalTasks === 0 ? 0 : 100 - completionPercentage;

  const trackedDayPercent = Math.min(
    100,
    Math.round((safeTrackedTime / (8 * 3600)) * 100),
  );
  const touchedCompletedPct =
    totalTasks === 0 ? 0 : ((summary?.completedTasks || 0) / totalTasks) * 100;
  const touchedPendingPct =
    totalTasks === 0
      ? 0
      : ((summary?.pendingOrInProgress || 0) / totalTasks) * 100;

  const topCards = [
    {
      title: "Today's Tracked",
      value: formatTime(safeTrackedTime),
      icon: Clock,
    },
    {
      title: "Tasks Touched",
      value: summary?.tasksWorkedOn || 0,
      icon: Activity,
    },
    {
      title: "Completed",
      value: summary?.completedTasks || 0,
      icon: CheckCircle2,
    },
    {
      title: "In Progress",
      value: summary?.pendingOrInProgress || 0,
      icon: ListTodo,
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-zinc-50/50 dark:bg-zinc-950/50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Overview
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Here is what is happening today.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {topCards.map((card, index) => (
          <div
            key={index}
            className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden flex flex-col transition-transform hover:-translate-y-1 duration-300"
          >
            <div className="flex-1 flex items-center justify-center h-32 pt-4">
              {index === 0 && (
                <ResponsiveContainer width={100} height={100}>
                  <RadialBarChart
                    innerRadius="72%"
                    outerRadius="100%"
                    barSize={9}
                    data={[
                      {
                        value: showAnimations ? trackedDayPercent || 0.1 : 0.1,
                      },
                    ]}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <PolarAngleAxis
                      type="number"
                      domain={[0, 100]}
                      tick={false}
                    />
                    <RadialBar
                      dataKey="value"
                      cornerRadius={8}
                      fill="#18181b"
                      className="dark:fill-zinc-100"
                      background={{ fill: "#e4e4e7" }}
                      isAnimationActive={true}
                      animationDuration={1200}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              )}

              {index === 1 && (
                <div className="w-full px-6">
                  <div className="h-4 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-zinc-900 dark:bg-zinc-100 transition-all duration-1000 ease-out"
                      style={{
                        width: showAnimations
                          ? `${touchedCompletedPct}%`
                          : "0%",
                      }}
                    />
                    <div
                      className="h-full bg-zinc-400 dark:bg-zinc-600 transition-all duration-1000 ease-out"
                      style={{
                        width: showAnimations ? `${touchedPendingPct}%` : "0%",
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] font-semibold text-zinc-400 uppercase tracking-wide">
                    <span>Done</span>
                    <span>Left</span>
                  </div>
                </div>
              )}

              {index === 2 && (
                <div className="w-full px-4 h-full flex items-end">
                  <ResponsiveContainer width="100%" height={110}>
                    <RadialBarChart
                      cx="50%"
                      cy="80%"
                      innerRadius="60%"
                      outerRadius="100%"
                      barSize={28}
                      data={[
                        {
                          value: showAnimations
                            ? completionPercentage || 0.1
                            : 0.1,
                        },
                      ]}
                      startAngle={180}
                      endAngle={0}
                    >
                      <PolarAngleAxis
                        type="number"
                        domain={[0, 100]}
                        tick={false}
                      />
                      <RadialBar
                        dataKey="value"
                        cornerRadius={12}
                        fill="#18181b"
                        className="dark:fill-zinc-100"
                        background={{ fill: "#e4e4e7" }}
                        isAnimationActive={true}
                        animationDuration={1200}
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {index === 3 && (
                <div className="flex items-end justify-center gap-2 h-28 w-full px-4">
                  {[40, 65, 50, 80, pendingPercentage].map((h, i) => (
                    <div
                      key={i}
                      className={`w-6 rounded-t-md transition-all duration-1000 ease-out ${
                        i === 4
                          ? "bg-zinc-900 dark:bg-zinc-100"
                          : "bg-zinc-200 dark:bg-zinc-700"
                      }`}
                      style={{ height: showAnimations ? `${h}%` : "0%" }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <card.icon
                  className="text-zinc-400 dark:text-zinc-500"
                  size={14}
                  strokeWidth={2.5}
                />
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  {card.title}
                </span>
              </div>
              <span className="text-sm font-black text-zinc-900 dark:text-zinc-100">
                {card.value}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 relative overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl shadow-sm p-5 md:p-8 flex flex-col justify-center min-h-[300px] group transition-all">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-gradient-to-br from-zinc-100 to-transparent dark:from-zinc-800/50 rounded-full blur-3xl opacity-50 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-50/50 to-transparent dark:from-zinc-800/10 dark:to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative z-10 flex flex-col items-center justify-center text-center h-full max-w-3xl mx-auto w-full">
            {isAiLoading ? (
              <div className="flex flex-col items-center gap-5 text-zinc-400 dark:text-zinc-500">
                <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-full shadow-inner">
                  <Loader2
                    className="animate-spin text-zinc-500 dark:text-zinc-400"
                    size={28}
                  />
                </div>
                <p className="text-sm font-medium tracking-wide animate-pulse">
                  Synthesizing productivity insights...
                </p>
              </div>
            ) : aiData?.insight ? (
              <div className="flex flex-col items-center gap-6 w-full animate-in fade-in zoom-in-95 duration-500">
                <div className="flex items-center justify-center w-12 h-12 bg-zinc-50 dark:bg-zinc-800/80 rounded-2xl shadow-sm border border-zinc-200/50 dark:border-zinc-700/50">
                  <Sparkles
                    className="text-zinc-600 dark:text-zinc-300"
                    size={24}
                    strokeWidth={1.5}
                  />
                </div>
                <div className="relative w-full">
                  <span className="absolute -top-4 -left-2 text-4xl text-zinc-200 dark:text-zinc-800 font-serif leading-none select-none">
                    "
                  </span>
                  <p className="text-base md:text-lg font-medium text-zinc-600 dark:text-zinc-300 leading-relaxed md:leading-loose px-4 md:px-8">
                    {aiData.insight}
                  </p>
                  <span className="absolute -bottom-6 -right-2 text-4xl text-zinc-200 dark:text-zinc-800 font-serif leading-none select-none">
                    "
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center w-full">
                <div className="p-3 md:p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl md:rounded-2xl mb-4 md:mb-5 shadow-sm border border-zinc-100 dark:border-zinc-800">
                  <Sparkles
                    className="text-zinc-600 dark:text-zinc-400 w-5 h-5 md:w-7 md:h-7"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-zinc-800 dark:text-zinc-200 mb-2 tracking-tight">
                  AI Summary Engine
                </h3>
                <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 mb-5 md:mb-6 max-w-sm px-4 md:px-0">
                  Unlock a premium analysis of your daily tracking patterns and
                  task efficiency.
                </p>

                <button
                  onClick={() => setTriggerAi(true)}
                  className="group relative flex items-center gap-1.5 md:gap-2 px-4 md:px-6 py-2 md:py-2.5 text-sm md:text-base bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium rounded-lg md:rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-md hover:shadow-lg active:scale-95 mb-5 md:mb-6"
                >
                  <Sparkles className="w-4 h-4 md:w-5 md:h-5 group-hover:animate-pulse" />
                  Generate Insight
                </button>

                <div className="w-full max-w-md bg-zinc-50/80 dark:bg-zinc-800/30 p-3 md:p-5 rounded-xl md:rounded-2xl text-left border border-zinc-200/50 dark:border-zinc-700/50 backdrop-blur-sm">
                  <div className="flex items-start gap-2 md:gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 mt-1 md:mt-1.5 shrink-0" />
                    <p className="text-[11px] md:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      <strong className="text-zinc-700 dark:text-zinc-300 font-semibold">
                        For Reviewers:
                      </strong>{" "}
                      Please add a few tasks and start/stop the timers multiple
                      times to generate genuine data. Insights are generated
                      on-demand to conserve free API limits.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Task States
            </h3>
            <TrendingUp className="text-zinc-400" size={20} />
          </div>

          <div className="flex-1 flex items-center justify-center relative min-h-[220px]">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={[
                    {
                      name: "Completed",
                      value: showAnimations ? completionPercentage || 0.1 : 0.1,
                    },
                    {
                      name: "Pending / Working",
                      value: showAnimations ? pendingPercentage || 0.1 : 0.1,
                    },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  startAngle={90}
                  endAngle={-270}
                  paddingAngle={4}
                  cornerRadius={8}
                  dataKey="value"
                  stroke="none"
                  isAnimationActive={true}
                  animationDuration={1200}
                >
                  <Cell fill="#18181b" />
                  <Cell fill="#a1a1aa" />
                </Pie>
                <Tooltip
                  formatter={(value: any, name: any) => [
                    `${Math.round(value)}%`,
                    name,
                  ]}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e4e4e7",
                    fontSize: "13px",
                    fontWeight: 600,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-zinc-900 dark:text-zinc-100">
                {completionPercentage}%
              </span>
              <span className="text-xs font-semibold text-zinc-400">
                Completed
              </span>
            </div>
          </div>

          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-900 dark:bg-zinc-100" />
              <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                Completed{" "}
                <span className="text-zinc-900 dark:text-zinc-100">
                  {completionPercentage}%
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-400" />
              <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                Pending{" "}
                <span className="text-zinc-900 dark:text-zinc-100">
                  {pendingPercentage}%
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
