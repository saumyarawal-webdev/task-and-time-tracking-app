import Link from "next/link";
import Image from "next/image";
import {
  Clock,
  Sparkles,
  Activity,
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3,
} from "lucide-react";

export default function LandingPage() {
  return (
    // Added overflow-x-hidden to prevent the background glow from breaking mobile width
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      {/* Background Dot Texture & Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-60 z-0" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[350px] bg-indigo-500/20 dark:bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md transition-all">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2 md:gap-3">
            <Image
              src="/favicon/android-chrome-192x192.png"
              alt="Logo"
              width={28}
              height={28}
              className="rounded-lg shadow-sm md:w-8 md:h-8"
            />
            <span className="font-bold text-base md:text-lg tracking-tight">
              Task Time Tracker
            </span>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <Link
              href="/login"
              className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium text-foreground hover:bg-muted rounded-full transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-4 py-1.5 md:px-5 md:py-2 text-xs md:text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:scale-105 rounded-full shadow-sm transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 md:px-6 py-20 lg:py-32 relative z-10">
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-[10px] md:text-xs font-bold tracking-widest uppercase border border-indigo-200/50 dark:border-indigo-800/50 shadow-sm">
            <Sparkles size={14} className="text-indigo-500" /> Powered by
            OpenRouter AI
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.1] md:leading-[1.1] bg-gradient-to-br from-zinc-900 to-zinc-500 dark:from-zinc-100 dark:to-zinc-500 bg-clip-text text-transparent px-4">
            Hunt down your productivity goals.
          </h1>

          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4 leading-relaxed">
            A precise task management and time tracking dashboard enhanced with
            intelligent insights to keep your workflow flawless and focused.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 pt-4 px-4 w-full sm:w-auto">
            <Link
              href="/register"
              className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold flex items-center justify-center gap-2 hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-lg shadow-zinc-500/20"
            >
              Start Tracking Free <ArrowRight size={18} />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 rounded-full border border-zinc-200 dark:border-zinc-800 font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:-translate-y-0.5 transition-all flex items-center justify-center"
            >
              Sign In to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section
        id="features"
        className="py-20 px-4 md:px-6 border-t border-border bg-muted/30 relative z-10"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Engineered for Peak Performance
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">
              Everything you need to master your time and task execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="group p-6 md:p-8 rounded-3xl bg-background border border-border shadow-sm hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 flex flex-col gap-4">
              <div className="p-3 w-fit rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 group-hover:scale-110 transition-transform duration-300">
                <Clock size={24} strokeWidth={1.5} />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-zinc-100">
                Precise Time Tracking
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Log your active hours effortlessly across tasks with real-time
                timers and clean visual breakdowns.
              </p>
            </div>

            <div className="group p-6 md:p-8 rounded-3xl bg-background border border-border shadow-sm hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 flex flex-col gap-4">
              <div className="p-3 w-fit rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 group-hover:scale-110 transition-transform duration-300">
                <Sparkles size={24} strokeWidth={1.5} />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-zinc-100">
                AI Task Enhancement
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Transform raw, messy thoughts into professional, structured task
                titles and detailed descriptions instantly.
              </p>
            </div>

            <div className="group p-6 md:p-8 rounded-3xl bg-background border border-border shadow-sm hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 flex flex-col gap-4">
              <div className="p-3 w-fit rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 size={24} strokeWidth={1.5} />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-zinc-100">
                Daily Insights
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Receive personalized productivity summaries and analytical
                feedback generated specifically for your workflow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 md:px-6 text-center text-xs md:text-sm text-muted-foreground relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            © {new Date().getFullYear()} Task Time Tracker. Made with &#x2665;
            by{" "}
            <Link
              href="https://saumya-rawal.vercel.app/"
              target="_blank"
              className="font-semibold text-zinc-700 dark:text-zinc-300 hover:underline"
            >
              Saumya
            </Link>
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/login"
              className="hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/login"
              className="hover:text-foreground transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
