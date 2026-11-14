import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowRight, Code2, Eye, EyeOff } from "lucide-react";
import api from "../services/api";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();

    if (!/^[A-Za-z ]{3,80}$/.test(name)) {
      return toast.error("Enter a valid name (letters only, at least 3 characters).");
    }

    if (form.password.trim().length < 8) {
  return toast.error("Password must contain at least 8 non-space characters.");
}

    if (form.password !== form.confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/signup", {
        name,
        email,
        password: form.password,
      });

const result = response.data?.data;
const challengeToken = result?.otpChallengeToken;

if (!challengeToken) {
  throw new Error("OTP challenge token was not received. Please try again.");
}

sessionStorage.setItem("otpEmail", result.email || email);
sessionStorage.setItem("otpChallengeToken", challengeToken);

toast.success(response.data.message || "OTP sent to your email.");
navigate("/verify-otp");
    }catch (error) {
  toast.error(
    error.response?.data?.message ||
    error.message ||
    "Signup failed. Please try again."
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
            JOIN THE INNOVATION
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold text-white">
            Create your account
          </h1>
          <p className="mt-3 text-sm text-slate-400">
            Sign up to begin your Code-a-Nova journey.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Full Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              minLength={3}
              maxLength={80}
              autoComplete="name"
              className="input-field"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
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
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                required
                minLength={8}
                autoComplete="new-password"
                className="input-field pr-12"
                placeholder="At least 8 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Confirm Password
            </label>
            <input
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={handleChange}
              required
              autoComplete="new-password"
              className="input-field"
              placeholder="Re-enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="primary-button w-full"
          >
            {loading ? "Creating account..." : "Create Account"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-indigo-400 hover:text-indigo-300"
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}