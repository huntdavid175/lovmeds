"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/app/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message || "Invalid email or password");
        setLoading(false);
        return;
      }

      // Optionally keep localStorage flag so existing layout guard still works
      localStorage.setItem("dashboard_authenticated", "true");

      setLoading(false);
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      console.error("Error during login:", err);
      setError("Unexpected error during login. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="font-heading text-3xl md:text-4xl text-black mb-2 ls-title">
              Admin Login
            </h1>
            <p className="text-black/60">Sign in to manage your store</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-black mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-14 px-4 rounded-xl border border-black/10 bg-white text-black placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-[#A33D4A] focus:border-transparent"
                placeholder="admin@lovmeds.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-black mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-14 px-4 rounded-xl border border-black/10 bg-white text-black placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-[#A33D4A] focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-xl bg-[#A33D4A] text-white text-lg font-medium transition-colors hover:bg-[#8E3540] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
