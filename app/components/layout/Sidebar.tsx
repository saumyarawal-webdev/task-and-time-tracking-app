"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  CheckSquare,
  Timer,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
} from "lucide-react";
import { useUser } from "../../../hooks/useUser";
import { useLogout } from "../../../hooks/useLogout";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const pathname = usePathname();

  const { data: user, isLoading } = useUser();
  const { mutate: logout, isPending } = useLogout();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Tasks", href: "/tasks", icon: CheckSquare },
    { name: "Time Log", href: "/timelog", icon: Timer },
  ];

  const [showMobileLogout, setShowMobileLogout] = useState(false);

  return (
    <>
      {/* Desktop Sidebar - Strictly hidden on mobile */}
      <aside
        className={`hidden md:flex flex-col h-screen border-r border-border bg-background transition-all duration-300 z-50 ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!isCollapsed && (
            <div className="flex items-center gap-2 truncate">
              <Image
                src="/favicon/android-chrome-192x192.png"
                alt="Logo"
                width={24}
                height={24}
                className="rounded-md shrink-0"
              />
              <span className="font-bold text-foreground truncate">
                Task Time Tracker
              </span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-md hover:bg-input text-foreground transition-colors shrink-0"
          >
            {isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
        </div>

        <nav className="flex-1 p-2 space-y-2 mt-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 p-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-input"
                } ${isCollapsed ? "justify-center" : ""}`}
                title={isCollapsed ? item.name : ""}
              >
                <item.icon size={20} className="shrink-0" />
                {!isCollapsed && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-2 border-t border-border flex flex-col gap-2">
          {!isCollapsed && (
            <div className="flex items-center gap-3 p-2 text-sm text-foreground overflow-hidden whitespace-nowrap">
              <User size={20} className="shrink-0 text-foreground/70" />
              <span className="font-medium truncate">
                {isLoading ? "Loading..." : user?.name || "User"}
              </span>
            </div>
          )}
          <button
            onClick={() => logout()}
            disabled={isPending}
            className={`flex items-center gap-3 p-2 w-full rounded-md text-red-500 hover:bg-input transition-colors disabled:opacity-50 ${
              isCollapsed ? "justify-center" : ""
            }`}
            title={isCollapsed ? "Logout" : ""}
          >
            <LogOut size={20} className="shrink-0" />
            {!isCollapsed && (
              <span className="truncate">
                {isPending ? "Logging out..." : "Logout"}
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Tab Bar - Hidden on desktop */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.08)] z-50 px-6 pt-4 pb-6 flex justify-between items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setShowMobileLogout(false)}
              className="flex flex-col items-center gap-1.5"
            >
              <item.icon
                size={24}
                className={`transition-all duration-300 ${
                  isActive
                    ? "text-zinc-900 dark:text-zinc-100"
                    : "text-zinc-400 dark:text-zinc-600"
                }`}
                strokeWidth={isActive ? 2.5 : 1.5}
              />
              <span
                className={`text-[11px] transition-all duration-300 ${
                  isActive
                    ? "font-bold text-zinc-900 dark:text-zinc-100"
                    : "font-medium text-zinc-400 dark:text-zinc-600"
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}

        {/* User Profile & Logout Bubble */}
        <div className="relative flex flex-col items-center">
          {/* True Speech Bubble for Logout */}
          <div
            className={`absolute bottom-full mb-4 flex flex-col items-center transition-all duration-300 origin-bottom ${
              showMobileLogout
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-75 translate-y-4 pointer-events-none"
            }`}
          >
            <button
              onClick={() => logout()}
              disabled={isPending}
              className="relative flex items-center justify-center w-12 h-12 bg-red-500 hover:bg-red-600 rounded-full text-white shadow-lg transition-colors disabled:opacity-50 z-10"
            >
              <LogOut size={20} strokeWidth={2.5} />
            </button>
            {/* The tail of the bubble */}
            <div className="absolute -bottom-1.5 w-4 h-4 bg-red-500 rotate-45 shadow-sm z-0" />
          </div>

          {/* Profile Trigger Icon */}
          <button
            onClick={() => setShowMobileLogout(!showMobileLogout)}
            className="flex flex-col items-center gap-1.5"
          >
            <User
              size={24}
              className={`transition-all duration-300 ${
                showMobileLogout
                  ? "text-zinc-900 dark:text-zinc-100"
                  : "text-zinc-400 dark:text-zinc-600"
              }`}
              strokeWidth={showMobileLogout ? 2.5 : 1.5}
            />
            <span
              className={`text-[11px] transition-all duration-300 ${
                showMobileLogout
                  ? "font-bold text-zinc-900 dark:text-zinc-100"
                  : "font-medium text-zinc-400 dark:text-zinc-600"
              }`}
            >
              Profile
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}
