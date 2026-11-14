import React, { useState } from "react";
import { BrainCircuit, Code2, Lightbulb, Rocket, Target, Users } from "lucide-react";

const values = [
  {
    icon: Lightbulb,
    title: "Creativity",
    description: "Think freely, question assumptions, and explore new possibilities.",
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "Learn together, share perspectives, and build stronger solutions.",
  },
  {
    icon: Rocket,
    title: "Innovation",
    description: "Turn promising ideas into practical projects and real outcomes.",
  },
];

export default function About() {
  return (
    <main>
      <section className="page-container section-padding">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-400">
            ABOUT THE EVENT
          </p>
          <h1 className="mt-5 font-heading text-4xl font-bold text-white sm:text-6xl">
            Where ideas meet <span className="gradient-text">innovation.</span>
          </h1>
          <p className="mt-7 text-base leading-8 text-slate-400">
            Code-a-Nova brings together creative thinkers and technology
            enthusiasts to explore challenges, develop solutions, and
            experience the power of building together.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          <div className="glass-card rounded-3xl p-8 sm:p-10">
            <div className="inline-flex rounded-xl bg-indigo-400/10 p-3 text-indigo-300">
              <Target size={27} />
            </div>
            <h2 className="mt-6 font-heading text-2xl font-bold text-white">
              Our Mission
            </h2>
            <p className="mt-4 leading-8 text-slate-400">
              Encourage participants to solve meaningful problems through
              technology, experimentation, teamwork, and creative thinking.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-8 sm:p-10">
            <div className="inline-flex rounded-xl bg-lime-400/10 p-3 text-lime-300">
              <BrainCircuit size={27} />
            </div>
            <h2 className="mt-6 font-heading text-2xl font-bold text-white">
              Our Vision
            </h2>
            <p className="mt-4 leading-8 text-slate-400">
              Create an environment where ambitious ideas can grow into
              impactful projects and participants can discover their potential.
            </p>
          </div>
        </div>

        <div className="mt-20 text-center">
          <div className="inline-flex rounded-xl bg-violet-400/10 p-3 text-violet-300">
            <Code2 size={27} />
          </div>
          <h2 className="mt-5 font-heading text-3xl font-bold text-white">
            What we believe in
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <article key={value.title} className="glass-card rounded-2xl p-7 text-left">
                  <Icon size={26} className="text-indigo-300" />
                  <h3 className="mt-5 font-heading text-xl font-bold text-white">
                    {value.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    {value.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}