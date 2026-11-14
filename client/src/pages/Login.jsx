
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowRight, Code2, Eye, EyeOff } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      // Backend returns token and user inside response.data.data
      const result = response.data.data;

      if (!result?.token) {
        throw new Error(
          "Login response did not contain an authentication token."
        );
      }

      login(result.token, result.user);

      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-container flex min-h-[80vh] items-center justify-center py-16">
      <div className="glass-card w-full max-w-lg rounded-3xl p-7 shadow-glow sm:p-10">

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-300">
          <Code2 size={30} />
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-400">
            WELCOME BACK
          </p>

          <h1 className="mt-3 font-heading text-3xl font-bold text-white">
            Login to your account
          </h1>

          <p className="mt-3 text-sm text-slate-400">
            Continue your Code-a-Nova journey.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Email Address
            </label>

            <input
              type="email"
              required
              autoComplete="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
              className="input-field"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }
                className="input-field pr-12"
                placeholder="Enter your password"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="primary-button w-full"
          >
            {loading ? "Logging in..." : "Login"}
            {!loading && <ArrowRight size={18} />}
          </button>

        </form>

        <p className="mt-7 text-center text-sm text-slate-400">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-indigo-400 hover:text-indigo-300"
          >
            Sign up
          </Link>
        </p>

      </div>
    </main>
  );
}
