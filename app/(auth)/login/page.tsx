"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUser, signInUser } from "@/firebase/Users";
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = (await getUser(await signInUser(email,password))) as any;
      console.log(user.role);
      if(user.role="CHEF"){
          router.push("/u/orders");
        }else if(user.role==="ADMIN"){
          router.push("/u/");
        }
      
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center px-6">
      {/* CARD */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8">
        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-500 flex items-center justify-center text-white text-2xl">
            🍽
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800">Login</h1>
          <p className="text-gray-500 mt-2">Access your restaurant dashboard</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* EMAIL */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 text-black rounded-xl border border-gray-300
                         focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 text-black py-3 rounded-xl border border-gray-300
                         focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* ERROR */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2">
              {error}
            </div>
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-white
                       bg-emerald-600 hover:bg-emerald-700
                       transition-all duration-200
                       disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
        {/* SIGNUP */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            href="/register"
            className="text-emerald-600 font-semibold hover:underline"
          >
            Create one
          </Link>
        </div>
      </div>
    </main>
  );
}
