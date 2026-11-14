import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, MailCheck } from "lucide-react";
import api from "../services/api";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const email = sessionStorage.getItem("otpEmail");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [seconds, setSeconds] = useState(60);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) {
      navigate("/signup", { replace: true });
    }
  }, [email, navigate]);

  useEffect(() => {
    if (seconds <= 0) return;

    const timer = setTimeout(() => {
      setSeconds((current) => current - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [seconds]);

  const handleChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);

    const updated = [...otp];
    updated[index] = digit;
    setOtp(updated);

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pasted) return;

    e.preventDefault();

    const digits = Array.from({ length: 6 }, (_, i) => pasted[i] || "");
    setOtp(digits);

    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      return toast.error("Please enter all six OTP digits.");
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/verifyotp", {
        email,
        otp: otpValue,
      });

      toast.success(response.data.message || "Email verified successfully!");

      sessionStorage.removeItem("otpEmail");
      sessionStorage.removeItem("otpChallengeToken");

      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid or expired OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    const challengeToken = sessionStorage.getItem("otpChallengeToken");

    if (!challengeToken) {
      toast.error("Your verification session has expired. Please sign up again.");
      navigate("/signup");
      return;
    }

    setResending(true);

    try {
      const response = await api.post(
        "/auth/resendotp",
        {},
        {
          headers: {
            Authorization: `Bearer ${challengeToken}`,
          },
        }
      );

      setOtp(["", "", "", "", "", ""]);
      setSeconds(60);
      inputRefs.current[0]?.focus();

      toast.success(response.data.message || "A new OTP has been sent.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to resend OTP."
      );
    } finally {
      setResending(false);
    }
  };

  if (!email) return null;

  return (
    <main className="page-container flex min-h-[80vh] items-center justify-center py-16">
      <div className="glass-card w-full max-w-md rounded-3xl p-7 text-center shadow-glow sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-300">
          <MailCheck size={32} />
        </div>

        <p className="mt-7 text-xs font-bold uppercase tracking-[0.25em] text-indigo-400">
          EMAIL VERIFICATION
        </p>

        <h1 className="mt-3 font-heading text-3xl font-bold text-white">
          Check your inbox
        </h1>

        <p className="mt-4 text-sm leading-7 text-slate-400">
          We've sent a six-digit verification code to
          <span className="mt-1 block break-all font-semibold text-white">
            {email}
          </span>
        </p>

        <form onSubmit={handleVerify} className="mt-9">
          <div className="flex justify-center gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(element) => (inputRefs.current[index] = element)}
                type="text"
                inputMode="numeric"
                autoComplete={index === 0 ? "one-time-code" : "off"}
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                aria-label={`OTP digit ${index + 1}`}
                className="h-12 w-10 rounded-xl border border-white/10 bg-navy-800 text-center text-xl font-bold text-white outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 sm:h-14 sm:w-12"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || resending}
            className="primary-button mt-8 w-full"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <div className="mt-7 text-sm text-slate-400">
          Didn't receive the code?

          <button
            type="button"
            disabled={seconds > 0 || resending || loading}
            onClick={handleResend}
            className="ml-2 font-semibold text-indigo-400 hover:text-indigo-300 disabled:cursor-not-allowed disabled:text-slate-600"
          >
            {resending
              ? "Sending..."
              : seconds > 0
                ? `Resend in ${seconds}s`
                : "Resend OTP"}
          </button>
        </div>

        <Link
          to="/signup"
          className="mt-7 inline-flex items-center gap-2 text-xs text-slate-500 transition hover:text-white"
        >
          <ArrowLeft size={14} />
          Back to signup
        </Link>
      </div>
    </main>
  );
}