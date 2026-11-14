
import React from "react";
import { Link } from "react-router-dom";

import {
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  Code2,
  Lightbulb,
  Rocket,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: BrainCircuit,
    title: "Think Beyond",
    description:
      "Explore challenging problems and discover creative ways to solve them.",
    color: "text-violet-300",
    bg: "bg-violet-400/10",
  },
  {
    icon: Code2,
    title: "Build Something",
    description:
      "Turn your concepts into working projects with technology and teamwork.",
    color: "text-indigo-300",
    bg: "bg-indigo-400/10",
  },
  {
    icon: Trophy,
    title: "Show Your Skills",
    description:
      "Present your work, demonstrate your ideas, and learn from other builders.",
    color: "text-lime-300",
    bg: "bg-lime-400/10",
  },
];

const phases = [
  {
    number: "01",
    title: "Register",
    description: "Create your account and submit your hackathon registration.",
  },
  {
    number: "02",
    title: "Innovate",
    description: "Choose your track, collaborate, and develop your solution.",
  },
  {
    number: "03",
    title: "Present",
    description: "Showcase your project and explain the impact of your idea.",
  },
];


export default function Home() {
  return (
    <main className="overflow-hidden">
      <style>{`
        @keyframes novaFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-18px);
          }
        }

        @keyframes novaFloatRotate {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(12deg);
          }
        }

        @keyframes novaGlow {
          0%, 100% {
            filter: drop-shadow(0 0 2px currentColor);
          }
          50% {
            filter: drop-shadow(0 0 15px currentColor);
          }
        }

        @keyframes novaPulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.12);
          }
        }

        @keyframes novaRing {
          0%, 100% {
            transform: scale(1);
            opacity: 0.45;
          }
          50% {
            transform: scale(1.1);
            opacity: 1;
          }
        }

        .nova-float {
          animation: novaFloat 2.5s ease-in-out infinite !important;
          will-change: transform;
        }

        .nova-float-slow {
          animation: novaFloat 3.5s ease-in-out infinite !important;
          will-change: transform;
        }

        .nova-float-rotate {
          animation: novaFloatRotate 3s ease-in-out infinite !important;
          will-change: transform;
        }

        .nova-glow {
          animation: novaGlow 2s ease-in-out infinite !important;
        }

        .nova-pulse {
          animation: novaPulse 2.5s ease-in-out infinite !important;
          will-change: transform;
        }

        .nova-ring {
          animation: novaRing 3.5s ease-in-out infinite !important;
        }

        .nova-delay-1 {
          animation-delay: 0.5s;
        }

        .nova-delay-2 {
          animation-delay: 1s;
        }

        .nova-delay-3 {
          animation-delay: 1.5s;
        }

        // @media (prefers-reduced-motion: reduce) {
        //   .nova-float,
        //   .nova-float-slow,
        //   .nova-float-rotate,
        //   .nova-glow,
        //   .nova-pulse,
        //   .nova-ring {
        //     animation: none !important;
        //   }
        }
      `}</style>

  

      {/* HERO */}
      <section className="relative isolate">
        <div className="pointer-events-none absolute -left-40 top-10 -z-10 h-96 w-96 rounded-full bg-indigo-600/15 blur-[120px]" />

        <div className="pointer-events-none absolute -right-40 top-40 -z-10 h-96 w-96 rounded-full bg-violet-600/10 blur-[120px]" />

        <div className="page-container grid min-h-[680px] items-center gap-14 py-20 lg:grid-cols-2 lg:py-28">

          {/* LEFT CONTENT */}
          <div>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-4 py-2 text-xs font-semibold tracking-wide text-indigo-300">
              <Sparkles size={15} />
              THE INNOVATION STARTS HERE
            </div>

            <h1 className="max-w-3xl font-heading text-5xl font-bold leading-[1.12] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Ideas become
              <span className="gradient-text block">
                innovations.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">
              Step into Code-a-Nova — a platform for problem-solvers,
              developers, and creative minds. Bring your idea, build something
              meaningful, and make your mark.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/signup" className="primary-button">
                Start Your Journey
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-6 py-3 font-semibold text-slate-200 transition hover:border-indigo-400/40 hover:bg-white/5"
              >
                Explore Event
                <ArrowUpRight size={17} />
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm text-slate-400">
              <span className="flex items-center gap-2">
                <ShieldCheck size={17} className="text-lime-300" />
                Secure registration
              </span>

              <span className="flex items-center gap-2">
                <Users size={17} className="text-indigo-300" />
                Team collaboration
              </span>
            </div>
          </div>

          {/* RIGHT VISUAL */}
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute inset-8 rounded-full bg-indigo-500/20 blur-3xl" />

            <div className="glass-card relative rounded-[2rem] p-6 shadow-glow sm:p-9">

              {/* CARD HEADER */}
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Your next big idea
                  </p>

                  <p className="mt-1 font-heading text-lg font-bold text-white">
                    Build the Future
                  </p>
                </div>

                <div className="rounded-xl bg-lime-400/10 p-3 text-lime-300 nova-float-rotate">
                  <Rocket size={25} />
                </div>
              </div>

              {/* ANIMATED ILLUSTRATION */}
              <div className="my-8 flex aspect-square items-center justify-center rounded-3xl border border-indigo-400/20 bg-gradient-to-br from-indigo-500/15 via-violet-500/10 to-lime-400/5">

                <div className="relative flex h-48 w-48 items-center justify-center rounded-full border border-indigo-300/30 nova-ring sm:h-56 sm:w-56">

                  {/* OUTER RINGS */}
                  <div className="absolute inset-5 rounded-full border border-violet-300/30 nova-ring nova-delay-1" />

                  <div className="absolute inset-10 rounded-full border border-lime-300/20 nova-ring nova-delay-2" />

                  {/* CENTRAL CODE ICON */}
                  <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-indigo-500 shadow-glow nova-pulse">
                    <Code2 size={48} className="text-white" />
                  </div>

                  {/* LIGHTNING ICON */}
                  <div className="absolute -right-2 top-8 rounded-xl border border-white/10 bg-navy-800 p-3 text-lime-300 nova-glow">
                    <Zap size={21} />
                  </div>

                  {/* LIGHTBULB ICON */}
                  <div className="absolute -bottom-1 left-2 rounded-xl border border-white/10 bg-navy-800 p-3 text-violet-300 nova-float-slow nova-delay-1">
                    <Lightbulb size={21} />
                  </div>

                </div>
              </div>

              {/* CARD FOOTER */}
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">
                    Imagine. Create. Innovate.
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Your journey starts with an idea.
                  </p>
                </div>

                <Sparkles
                  className="shrink-0 text-indigo-300 nova-glow"
                  size={23}
                />
              </div>
            </div>

            {/* FLOATING BRAIN ICON */}
            <div className="absolute -left-5 top-24 hidden rounded-xl border border-white/10 bg-navy-800 p-3 shadow-xl sm:block nova-float nova-delay-1">
              <BrainCircuit className="text-indigo-300" size={22} />
            </div>

            {/* FLOATING TROPHY ICON */}
            <div className="absolute -right-5 bottom-24 hidden rounded-xl border border-white/10 bg-navy-800 p-3 shadow-xl sm:block nova-float-slow nova-delay-2">
              <Trophy className="text-lime-300" size={22} />
            </div>

          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section-padding border-y border-white/5 bg-white/[0.015]">
        <div className="page-container">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-400">
              WHY CODE-A-NOVA
            </p>

            <h2 className="mt-4 font-heading text-3xl font-bold text-white sm:text-4xl">
              More than just <span className="gradient-text">coding.</span>
            </h2>

            <p className="mt-5 leading-7 text-slate-400">
              Challenge yourself, work with passionate people, and transform
              your imagination into something real.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="glass-card rounded-2xl p-7 transition duration-300 hover:-translate-y-1 hover:border-indigo-400/30"
                >
                  <div
                    className={`inline-flex rounded-xl p-3 ${feature.bg} ${feature.color}`}
                  >
                    <Icon size={25} />
                  </div>

                  <h3 className="mt-6 font-heading text-xl font-bold text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="section-padding">
        <div className="page-container">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-400">
              YOUR JOURNEY
            </p>

            <h2 className="mt-4 font-heading text-3xl font-bold text-white sm:text-4xl">
              From idea to impact.
            </h2>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {phases.map((phase) => (
              <div
                key={phase.number}
                className="relative rounded-2xl border border-white/10 bg-navy-800/60 p-7"
              >
                <span className="font-heading text-5xl font-bold text-indigo-400/30">
                  {phase.number}
                </span>

                <h3 className="mt-5 font-heading text-xl font-bold text-white">
                  {phase.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {phase.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20">
        <div className="page-container">
          <div className="relative overflow-hidden rounded-3xl border border-indigo-400/20 bg-gradient-to-br from-indigo-600/20 via-violet-600/10 to-navy-800 p-9 text-center sm:p-16">

            <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />

            <div className="relative">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-400/15 text-indigo-300 nova-float">
                <Rocket size={28} />
              </div>

              <h2 className="mt-7 font-heading text-3xl font-bold text-white sm:text-4xl">
                Ready to create something amazing?
              </h2>

              <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
                Take the first step. Register your account and get ready to
                bring your ideas to life.
              </p>

              <Link to="/signup" className="primary-button mt-8">
                Register for Code-a-Nova
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
