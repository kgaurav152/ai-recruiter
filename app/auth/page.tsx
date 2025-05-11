"use client";
import { FcGoogle } from "react-icons/fc";
import { FaMicrophoneAlt } from "react-icons/fa";
import { supabase } from "@/services/supabaseClient";
import { useState } from "react";
const page = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const signInWithEmail = async () => {
    // e.preventDefault();
    setLoading(true);
    setError("");
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error("Error signing in with email:", error.message);
      setError(error.message);
    }
    setLoading(false);
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_HOST_URL}/dashboard`,
      },
    });
    if (error) {
      console.error("Error signing in with Google:", error.message);
    }
    setLoading(false);
  };
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="border-2 rounded-2xl p-8 shadow-xl w-full max-w-lg mx-auto ">
        <h1 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
          Sign in to <span className="text-blue-600">Recruitron</span>{" "}
          <span className="text-red-600">
            <FaMicrophoneAlt />
          </span>
        </h1>
        <p className="text-muted-foreground text-center mb-6">
          Let AI do the hiring while you build the future.
        </p>
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        <form onSubmit={signInWithEmail} className="mb-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 p-3 rounded-lg border border-gray-300 focus:outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-6 p-3 rounded-lg border border-gray-300 focus:outline-none"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition mb-4"
          >
            {loading ? "Signing in..." : "Sign in with Email"}
          </button>
        </form>
        <button
          onClick={signInWithGoogle}
          disabled={loading}
          className="cursor-pointer flex items-center justify-center gap-3 w-full py-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition"
        >
          <FcGoogle size={24} />
          {loading ? "Signing in..." : "Sign in with Google"}
        </button>
      </div>
    </div>
  );
};

export default page;
