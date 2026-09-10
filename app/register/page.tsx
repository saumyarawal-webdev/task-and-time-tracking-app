import Image from "next/image";
import RegisterForm from "../components/register/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background p-4 space-y-8">
      <div className="flex flex-col items-center justify-center gap-3">
        <Image 
          src="/favicon/android-chrome-192x192.png" 
          alt="App Logo" 
          width={60} 
          height={60} 
          priority
          className="rounded-2xl shadow-sm"
        />
      </div>
      <RegisterForm />
    </main>
  );
}