
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowRight, Users, FileText } from "lucide-react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const initialForm = {
  fullName: "",
  email: "",
  mobileNumber: "",
  collegeName: "",
  course: "",
  branch: "",
  yearOfStudy: "",
  domain: "",
  projectName: "",
  pptLink: "",
  prototypeLink: "",
  demoVideoLink: "",
  teamSize: "1",
};

export default function Registration() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState(initialForm);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((previous) => ({
        ...previous,
        fullName: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "teamSize") {
      const size = Number(value);

      setFormData((previous) => ({
        ...previous,
        teamSize: value,
      }));

      setTeamMembers((previous) =>
        Array.from({ length: size - 1 }, (_, index) => ({
          name: previous[index]?.name || "",
          email: previous[index]?.email || "",
        }))
      );

      return;
    }

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleTeamMemberChange = (index, field, value) => {
    setTeamMembers((previous) =>
      previous.map((member, memberIndex) =>
        memberIndex === index
          ? { ...member, [field]: value }
          : member
      )
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!/^[6-9]\d{9}$/.test(formData.mobileNumber)) {
      toast.error("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    if (formData.projectName.trim().length < 5) {
      toast.error("Project name must contain at least 5 characters.");
      return;
    }

    const invalidTeamMember = teamMembers.some(
      (member) =>
        !member.name.trim() ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email)
    );

    if (invalidTeamMember) {
      toast.error("Enter a valid name and email for every team member.");
      return;
    }

    setLoading(true);

    try {
      // The logged-in participant is the first team member.
      const completeTeam = [
        {
          name: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
        },
        ...teamMembers.map((member) => ({
          name: member.name.trim(),
         email: member.email.trim().toLowerCase(),
        })),
      ];

      const payload = {
        ...formData,
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        mobileNumber: formData.mobileNumber.trim(),
        collegeName: formData.collegeName.trim(),
        course: formData.course.trim(),
        branch: formData.branch.trim(),
        projectName: formData.projectName.trim(),
        teamSize: Number(formData.teamSize),
        teamMembers: completeTeam,
      };

      await api.post("/hackathon/register", payload);

      toast.success("Hackathon registration submitted successfully!");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "input-field w-full rounded-xl px-4 py-3 text-sm outline-none";

  const labelClass =
    "mb-2 block text-sm font-medium text-slate-300";

  return (
    <main className="page-container section-padding">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-300">
            CODE-A-NOVA
          </p>

          <h1 className="mt-3 font-heading text-3xl font-bold text-white sm:text-4xl">
            Hackathon Registration
          </h1>

          <p className="mt-3 text-sm leading-7 text-slate-400">
            Tell us about yourself, your team, and the project
            you're bringing to the hackathon.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="glass-card space-y-9 rounded-3xl p-6 sm:p-9"
        >
          {/* Participant details */}
          <section>
            <h2 className="mb-6 flex items-center gap-3 font-heading text-xl font-bold text-white">
              <Users className="text-indigo-300" size={22} />
              Participant Details
            </h2>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Full Name</label>
                <input
                  className={inputClass}
                  name="fullName"
                  value={formData.fullName}
                  readOnly
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Email Address</label>
                <input
                  className={inputClass}
                  type="email"
                  name="email"
                  value={formData.email}
                  readOnly
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Mobile Number</label>
                <input
                  className={inputClass}
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  pattern="[6-9][0-9]{9}"
                  maxLength={10}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>College Name</label>
                <input
                  className={inputClass}
                  name="collegeName"
                  value={formData.collegeName}
                  onChange={handleChange}
                  placeholder="Enter your college name"
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Course</label>
                <input
                  className={inputClass}
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  placeholder="e.g. B.Tech, BCA, MCA"
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Branch</label>
                <input
                  className={inputClass}
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  placeholder="e.g. Computer Science"
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Year of Study</label>
                <select
                  className={inputClass}
                  name="yearOfStudy"
                  value={formData.yearOfStudy}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Domain / Track</label>
                <select
                  className={inputClass}
                  name="domain"
                  value={formData.domain}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select your domain</option>
                  <option value="Web Development">Web Development</option>
                  <option value="AI / Machine Learning">
                    AI / Machine Learning
                  </option>
                  <option value="App Development">App Development</option>
                  <option value="Blockchain">Blockchain</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Open Innovation">Open Innovation</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </section>

          <div className="border-t border-white/10" />

          {/* Project details */}
          <section>
            <h2 className="mb-6 flex items-center gap-3 font-heading text-xl font-bold text-white">
              <FileText className="text-indigo-300" size={22} />
              Project Details
            </h2>

            <div className="space-y-5">
              <div>
                <label className={labelClass}>Project Name</label>
                <input
                  className={inputClass}
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleChange}
                  placeholder="Enter your project name"
                  minLength={5}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>PPT Link</label>
                <input
                  className={inputClass}
                  type="url"
                  name="pptLink"
                  value={formData.pptLink}
                  onChange={handleChange}
                  placeholder="https://..."
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Prototype Link</label>
                <input
                  className={inputClass}
                  type="url"
                  name="prototypeLink"
                  value={formData.prototypeLink}
                  onChange={handleChange}
                  placeholder="https://..."
                  required
                />
              </div>

              <div>
                <label className={labelClass}>
                  Demo Video Link (Optional)
                </label>
                <input
                  className={inputClass}
                  type="url"
                  name="demoVideoLink"
                  value={formData.demoVideoLink}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>
            </div>
          </section>

          <div className="border-t border-white/10" />

          {/* Team details */}
          <section>
            <h2 className="mb-6 flex items-center gap-3 font-heading text-xl font-bold text-white">
              <Users className="text-indigo-300" size={22} />
              Team Details
            </h2>

            <div className="max-w-xs">
              <label className={labelClass}>Total Team Size</label>
              <select
                className={inputClass}
                name="teamSize"
                value={formData.teamSize}
                onChange={handleChange}
                required
              >
                <option value="1">1 - Individual</option>
                <option value="2">2 Members</option>
                <option value="3">3 Members</option>
                <option value="4">4 Members</option>
                <option value="5">5 Members</option>
              </select>
            </div>

            <div className="mt-5 rounded-xl border border-indigo-400/20 bg-indigo-400/5 p-4">
              <p className="text-sm font-semibold text-indigo-300">
                Team Leader
              </p>
              <p className="mt-2 text-sm text-white">
                {formData.fullName || "Your name"}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {formData.email || "Your email"}
              </p>
            </div>

            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="mt-5 rounded-2xl border border-white/10 p-5"
              >
                <h3 className="mb-4 text-sm font-semibold text-white">
                  Team Member {index + 2}
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Member Name</label>
                    <input
                      className={inputClass}
                      value={member.name}
                      onChange={(event) =>
                        handleTeamMemberChange(
                          index,
                          "name",
                          event.target.value
                        )
                      }
                      placeholder="Enter member name"
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Member Email</label>
                    <input
                      className={inputClass}
                      type="email"
                      value={member.email}
                      onChange={(event) =>
                        handleTeamMemberChange(
                          index,
                          "email",
                          event.target.value
                        )
                      }
                      placeholder="Enter member email"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}

            {Number(formData.teamSize) === 1 && (
              <p className="mt-4 text-sm text-slate-400">
                You're registering as an individual participant.
                No additional team-member details are needed.
              </p>
            )}
          </section>

          <button
            type="submit"
            disabled={loading}
            className="primary-button flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Registration"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>
      </div>
    </main>
  );
}
