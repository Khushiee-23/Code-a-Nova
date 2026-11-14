import React, { useState } from "react";
//import { useState } from "react";
import toast from "react-hot-toast";
import { Mail, MessageCircle, Send } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    const contactEmail = import.meta.env.VITE_CONTACT_EMAIL;

    if (!contactEmail) {
      toast.error("Organizer contact email is not configured yet.");
      return;
    }

    const subject = encodeURIComponent("Code-a-Nova enquiry");
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`
    );

    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <main className="page-container section-padding">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-400">
          GET IN TOUCH
        </p>
        <h1 className="mt-5 font-heading text-4xl font-bold text-white sm:text-5xl">
          Let's start a <span className="gradient-text">conversation.</span>
        </h1>
        <p className="mt-5 leading-8 text-slate-400">
          Have a question about Code-a-Nova? Send us your message.
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-5xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-3xl border border-indigo-400/20 bg-gradient-to-br from-indigo-500/15 to-navy-800 p-8">
          <div className="inline-flex rounded-xl bg-indigo-400/15 p-3 text-indigo-300">
            <MessageCircle size={26} />
          </div>
          <h2 className="mt-6 font-heading text-2xl font-bold text-white">
            We're here to help.
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            Whether you have a registration question or need event information,
            we're happy to hear from you.
          </p>

          <div className="mt-8 flex items-start gap-3 border-t border-white/10 pt-6">
            <Mail className="mt-1 text-indigo-300" size={19} />
            <div>
              <p className="text-sm font-semibold text-white">
                Event enquiries
              </p>
              <p className="mt-1 text-xs leading-6 text-slate-400">
                Use the message form to contact the event organizers.
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="glass-card rounded-3xl p-7 sm:p-9"
        >
          <h2 className="font-heading text-2xl font-bold text-white">
            Send a message
          </h2>

          <div className="mt-7 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Your Name
              </label>
              <input
                required
                minLength={3}
                maxLength={80}
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="input-field"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Email Address
              </label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                className="input-field"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Message
              </label>
              <textarea
                required
                minLength={10}
                maxLength={2000}
                rows={5}
                value={form.message}
                onChange={(e) =>
                  setForm({ ...form, message: e.target.value })
                }
                className="input-field resize-y"
                placeholder="How can we help?"
              />
            </div>

            <button type="submit" className="primary-button w-full">
              Send Message
              <Send size={17} />
            </button>

            <p className="text-xs leading-5 text-slate-500">
              Your default email application will open with your message ready
              to send. No message is stored by this form.
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}