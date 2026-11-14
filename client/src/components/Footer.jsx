import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Code2, Github, Instagram, Linkedin, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#080D1B]">
      <div className="page-container py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400">
                <Code2 size={24} />
              </div>
              <span className="font-heading text-xl font-bold text-white">
                Code-a-<span className="text-indigo-400">Nova</span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
              A space for curious minds, creative thinkers, and ambitious
              builders to turn ideas into meaningful innovation.
            </p>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-white">
              Quick Links
            </h3>
            <div className="mt-5 flex flex-col gap-3 text-sm text-slate-400">
              <Link className="hover:text-indigo-400" to="/">Home</Link>
              <Link className="hover:text-indigo-400" to="/about">About</Link>
              <Link className="hover:text-indigo-400" to="/contact">Contact</Link>
              <Link className="hover:text-indigo-400" to="/signup">Register</Link>
            </div>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-white">
              Stay Connected
            </h3>
            <p className="mt-5 text-sm leading-7 text-slate-400">
              Follow the official event channels for announcements and updates.
            </p>

            <div className="mt-5 flex gap-3">
              {[
                { Icon: Github, label: "GitHub" },
                { Icon: Instagram, label: "Instagram" },
                { Icon: Linkedin, label: "LinkedIn" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  onClick={(event) => event.preventDefault()}
                  className="rounded-xl border border-white/10 p-3 text-slate-400 transition hover:border-indigo-400/40 hover:text-indigo-400"
                >
                  <Icon size={19} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-4 border-t border-white/10 pt-7 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Code-a-Nova. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made for innovators <ArrowUpRight size={13} />
          </p>
        </div>
      </div>
    </footer>
  );
}