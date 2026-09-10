import Link from "next/link";
import Image from "next/image";
import { Clock, Sparkles, Activity, ArrowRight, ShieldCheck, Zap, BarChart3 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image 
              src="/favicon/android-chrome-192x192.png" 
              alt="Logo" 
              width={32} 
              height={32} 
              className="rounded-lg shadow-sm"
            />
            <span className="font-bold text-lg tracking-tight">Task Time Logger</span>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              href="/login" 
              className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/register" 
              className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 rounded-lg shadow-sm transition-opacity"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 via-transparent to-transparent dark:from-indigo-950/20 pointer-events-none" />
        
        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold tracking-wide uppercase">
            <Sparkles size={14} /> Powered by Gemini AI
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Hunt down your productivity goals with precision.
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            A senior-level task management and time tracking dashboard enhanced with intelligent AI insights to keep your workflow flawless.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              href="/register" 
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/10"
            >
              Start Tracking Free <ArrowRight size={18} />
            </Link>
            <Link 
              href="/login" 
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-border font-medium hover:bg-muted transition-colors flex items-center justify-center"
            >
              Sign In to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6 border-t border-border bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <h2 className="text-3xl font-bold tracking-tight">Engineered for Peak Performance</h2>
            <p className="text-muted-foreground">Everything you need to master your time and task execution.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-background border border-border shadow-sm flex flex-col gap-4">
              <div className="p-3 w-fit rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                <Clock size={24} />
              </div>
              <h3 className="text-xl font-bold">Precise Time Tracking</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Log your active hours effortlessly across tasks with real-time timers and clean breakdowns.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-background border border-border shadow-sm flex flex-col gap-4">
              <div className="p-3 w-fit rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                <Sparkles size={24} />
              </div>
              <h3 className="text-xl font-bold">AI Task Enhancement</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Transform raw, messy thoughts into professional, structured task titles and detailed descriptions instantly.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-background border border-border shadow-sm flex flex-col gap-4">
              <div className="p-3 w-fit rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400">
                <BarChart3 size={24} />
              </div>
              <h3 className="text-xl font-bold">Daily Insights</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Receive personalized productivity summaries and analytical feedback generated specifically for your workflow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6 text-center text-sm text-muted-foreground">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Task Time Logger. Made with &#x2665; by <Link href="https://saumya-rawal.vercel.app/" target="_blank" className="hover:underline">Saumya</Link></p>
          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/login" className="hover:text-foreground transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}