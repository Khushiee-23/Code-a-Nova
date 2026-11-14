
import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowRight,
  Award,
  CalendarDays,
  CheckCircle2,
  Code2,
  GraduationCap,
  LogOut,
  Mail,
  MapPin,
  Users,
  UserRound,
  FileText,
} from "lucide-react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout, saveUser } = useAuth();

  const [profile, setProfile] = useState(user || null);
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);


const fetchDashboard = useCallback(async () => {
  setLoading(true);

  const [profileResult, registrationResult] =
    await Promise.allSettled([
      api.get("/user/me"),
      api.get("/hackathon/myentry"),
    ]);

  if (profileResult.status === "fulfilled") {
    const profileData =
      profileResult.value.data?.data?.user ||
      profileResult.value.data?.user ||
      profileResult.value.data?.data ||
      profileResult.value.data;

    setProfile(profileData);
    saveUser(profileData);
  } else {
    toast.error(
      profileResult.reason?.response?.data?.message ||
      "Unable to load your profile."
    );
  }

  if (registrationResult.status === "fulfilled") {
    const entry =
      registrationResult.value.data?.data?.registration || null;

    setRegistration(entry);
  } else if (registrationResult.reason?.response?.status === 404) {
    setRegistration(null);
  } else {
    toast.error(
      registrationResult.reason?.response?.data?.message ||
      "Unable to load your registration."
    );
  }

  setLoading(false);
}, [saveUser]);


  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleLogout = () => {
    logout();
    toast.success("You have been logged out.");
    navigate("/login", { replace: true });
  };

  const participant = profile || user;

  if (loading) {
    return (
      <main className="page-container flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-400/20 border-t-indigo-400" />
          <p className="mt-4 text-sm text-slate-400">
            Loading your dashboard...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="page-container section-padding">
      {/* Welcome section */}
      <section className="relative overflow-hidden rounded-3xl border border-indigo-400/20 bg-gradient-to-br from-indigo-500/20 via-navy-800 to-navy-900 p-7 sm:p-10">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-7 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-300">
              PARTICIPANT DASHBOARD
            </p>

            <h1 className="mt-4 font-heading text-3xl font-bold text-white sm:text-4xl">
              Welcome, {participant?.name || "Innovator"}!
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">
              Your innovation journey starts here. Manage your profile
              and track your Code-a-Nova hackathon registration.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-lime-400/20 bg-lime-400/10 px-4 py-2 text-xs font-medium text-lime-300">
              <CheckCircle2 size={15} />
              Account verified
            </div>
          </div>

          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-indigo-300">
            <Code2 size={42} />
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="mt-9 grid gap-7 lg:grid-cols-[0.85fr_1.15fr]">
        {/* Profile card */}
        <section className="glass-card rounded-3xl p-7">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold text-white">
              Your Profile
            </h2>
            <UserRound className="text-indigo-300" size={22} />
          </div>

          <div className="mt-7 space-y-6">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-300">
                <UserRound size={19} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500">Full Name</p>
                <p className="mt-1 break-words font-medium text-white">
                  {participant?.name || "Not available"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-300">
                <Mail size={19} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500">Email Address</p>
                <p className="mt-1 break-all font-medium text-white">
                  {participant?.email || "Not available"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-300">
                <CheckCircle2 size={19} />
              </div>
              <div>
                <p className="text-xs text-slate-500">Verification</p>
                <p className="mt-1 font-medium text-lime-300">
{participant?.isVerified
  ? "Account verified"
  : "Verification pending"}                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-400/5 px-5 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-400/10"
          >
            <LogOut size={17} />
            Logout
          </button>
        </section>

        {/* Registration card */}
        <section className="glass-card rounded-3xl p-7">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold text-white">
              Hackathon Registration
            </h2>
            <Award className="text-indigo-300" size={24} />
          </div>

          {registration ? (
            <div className="mt-7">
              <div className="inline-flex items-center gap-2 rounded-full bg-lime-400/10 px-4 py-2 text-xs font-semibold text-lime-300">
                <CheckCircle2 size={15} />
                Registration submitted
              </div>

              <h3 className="mt-5 font-heading text-2xl font-bold text-white">
                {registration.projectName || "Your project"}
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Your hackathon entry has been saved successfully.
              </p>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <GraduationCap className="mt-1 text-indigo-300" size={19} />
                  <div>
                    <p className="text-xs text-slate-500">College</p>
                    <p className="mt-1 text-sm text-white">
                      {registration.collegeName || "Not available"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 text-indigo-300" size={19} />
                  <div>
                    <p className="text-xs text-slate-500">Domain</p>
                    <p className="mt-1 text-sm text-white">
                      {registration.domain || "Not available"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="mt-1 text-indigo-300" size={19} />
                  <div>
                    <p className="text-xs text-slate-500">Team Size</p>
                    <p className="mt-1 text-sm text-white">
                      {registration.teamSize || 1} member(s)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CalendarDays className="mt-1 text-indigo-300" size={19} />
                  <div>
                    <p className="text-xs text-slate-500">Submitted</p>
                    <p className="mt-1 text-sm text-white">
                      {registration.createdAt
                        ? new Date(registration.createdAt).toLocaleDateString()
                        : "Saved"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-xl border border-indigo-400/15 bg-indigo-400/5 p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-indigo-300">
                  <FileText size={17} />
                  Registration received
                </p>
                <p className="mt-2 text-xs leading-6 text-slate-400">
                  Keep your project links and presentation ready for the
                  event.
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-7 rounded-2xl border border-dashed border-indigo-400/30 bg-indigo-400/5 p-7 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-300">
                <Code2 size={32} />
              </div>

              <h3 className="mt-5 font-heading text-xl font-bold text-white">
                Ready to build something amazing?
              </h3>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-slate-400">
                You haven't registered your project yet. Complete the
                hackathon registration form to secure your entry.
              </p>

              <Link
                to="/register"
                className="primary-button mt-7 inline-flex"
              >
                Register Now
                <ArrowRight size={18} />
              </Link>
            </div>
          )}
        </section>
      </div>

      <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-500">
        <Award size={15} />
        Keep innovating. Keep building. Welcome to Code-a-Nova.
      </div>
    </main>
  );
}
