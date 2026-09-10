"use client";

import { useState } from "react";
import { useLogin } from "../../../hooks/useLogin";
import Link from "next/link";
export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutate: login, isPending, isError } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="flex flex-col gap-4 w-full max-w-sm p-6 border border-border rounded-lg bg-background"
    >
      <h2 className="text-2xl font-bold text-center text-foreground mb-4">Welcome Back</h2>
      
      {isError && (
        <p className="text-red-500 text-sm">Login failed. Please try again.</p>
      )}
      
      <div className="flex flex-col gap-1">
        <label className="text-sm text-foreground">Email</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          required 
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-foreground">Password</label>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          required 
        />
      </div>

      <button 
        type="submit" 
        disabled={isPending}
        className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50 transition-opacity"
      >
        {isPending ? "Logging in..." : "Log In"}
      </button>
      <div className="mt-4 text-center text-sm text-foreground">
        Don't have an account?{" "}
        <Link href="/register" className="font-medium underline transition-colors">
          Register
        </Link>
      </div>
    </form>
  );
}