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
  User 
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

return (
    <>
      {/* Invisible spacer prevents content jump when sidebar becomes absolute on mobile */}
      {!isCollapsed && <div className="w-16 md:hidden shrink-0" />}
      <aside 
        className={`flex flex-col h-screen border-r border-border bg-background transition-all duration-300 z-50 ${
          isCollapsed ? "w-16 relative" : "w-64 absolute md:relative left-0 top-0"
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
              <span className="font-bold text-foreground truncate">Task Time Logger</span>
            </div>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-md hover:bg-input text-foreground transition-colors shrink-0"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-2 space-y-2 mt-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => {
                  // Collapse sidebar on mobile when a tab is clicked
                  if (typeof window !== "undefined" && window.innerWidth < 768) {
                    setIsCollapsed(true);
                  }
                }}
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
            {!isCollapsed && <span className="truncate">{isPending ? "Logging out..." : "Logout"}</span>}
          </button>
        </div>
      </aside>
    </>
  );
}