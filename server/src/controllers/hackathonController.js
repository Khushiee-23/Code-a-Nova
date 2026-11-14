
import HackathonRegistration from "../models/HackathonRegistration.js";

import asyncHandler from "../utils/asyncHandler.js";
import { sendEmail } from "../config/mailer.js";
import { registrationEmailTemplate } from "../utils/emailTemplates.js";

const isValidEmail = (value) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

const isValidUrl = (value) => {
  if (typeof value !== "string" || !value.trim()) {
    return false;
  }

  try {
    const parsedUrl = new URL(value.trim());
    return ["http:", "https:"].includes(parsedUrl.protocol);
  } catch {
    return false;
  }
};

// POST /api/hackathon/register
export const createRegistration = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    mobileNumber,
    collegeName,
    course,
    branch,
    yearOfStudy,
    domain,
    projectName,
    pptLink,
    prototypeLink,
    demoVideoLink,
    teamSize,
    teamMembers,
  } = req.body;

  const requiredFields = {
    fullName,
    email,
    mobileNumber,
    collegeName,
    course,
    branch,
    yearOfStudy,
    domain,
    projectName,
    pptLink,
    prototypeLink,
    teamSize,
    teamMembers,
  };

  for (const [field, value] of Object.entries(requiredFields)) {
    if (
      value === undefined ||
      value === null ||
      (typeof value === "string" && !value.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: `${field} is required.`,
      });
    }
  }

  const normalizedName = String(fullName).trim();
  const normalizedEmail = String(email).trim().toLowerCase();
  const normalizedMobile = String(mobileNumber).trim();
  const normalizedCollege = String(collegeName).trim();
  const normalizedProject = String(projectName).trim();
  const normalizedPptLink = String(pptLink).trim();
  const normalizedPrototypeLink = String(prototypeLink).trim();
  const normalizedDemoLink = String(demoVideoLink || "").trim();

  if (!/^[A-Za-z ]{3,80}$/.test(normalizedName)) {
    return res.status(400).json({
      success: false,
      message: "Full name must contain at least 3 letters.",
    });
  }

  if (normalizedEmail !== req.user.email.toLowerCase()) {
    return res.status(400).json({
      success: false,
      message: "Registration email must match your account email.",
    });
  }

  if (!/^[6-9]\d{9}$/.test(normalizedMobile)) {
    return res.status(400).json({
      success: false,
      message: "Enter a valid 10-digit Indian mobile number.",
    });
  }

  if (normalizedProject.length < 5) {
    return res.status(400).json({
      success: false,
      message: "Project name must contain at least 5 characters.",
    });
  }

  if (
    !isValidUrl(normalizedPptLink) ||
    !isValidUrl(normalizedPrototypeLink)
  ) {
    return res.status(400).json({
      success: false,
      message: "Enter valid PPT and prototype URLs.",
    });
  }

  if (normalizedDemoLink && !isValidUrl(normalizedDemoLink)) {
    return res.status(400).json({
      success: false,
      message: "Enter a valid demo video URL.",
    });
  }

  const parsedTeamSize = Number(teamSize);

  if (
    !Number.isInteger(parsedTeamSize) ||
    parsedTeamSize < 1 ||
    parsedTeamSize > 5
  ) {
    return res.status(400).json({
      success: false,
      message: "Team size must be between 1 and 5.",
    });
  }

  if (
    !Array.isArray(teamMembers) ||
    teamMembers.length !== parsedTeamSize
  ) {
    return res.status(400).json({
      success: false,
      message: "Team member count must equal team size.",
    });
  }

  const normalizedMembers = [];

  for (const member of teamMembers) {
    if (!member || typeof member !== "object") {
      return res.status(400).json({
        success: false,
        message: "Invalid team member information.",
      });
    }

    const memberName =
      typeof member.name === "string" ? member.name.trim() : "";

    const memberEmail =
      typeof member.email === "string"
        ? member.email.trim().toLowerCase()
        : "";

    if (!/^[A-Za-z ]{3,80}$/.test(memberName)) {
      return res.status(400).json({
        success: false,
        message: "Every team member needs a valid name.",
      });
    }

    if (!isValidEmail(memberEmail)) {
      return res.status(400).json({
        success: false,
        message: "Every team member needs a valid email.",
      });
    }

    normalizedMembers.push({
      name: memberName,
      email: memberEmail,
    });
  }

  // The registered account holder must be included in the team.
  if (!normalizedMembers.some(
    (member) => member.email === req.user.email.toLowerCase()
  )) {
    return res.status(400).json({
      success: false,
      message: "The team leader must be included in the team members.",
    });
  }

  const leader = normalizedMembers[0];

if (
  leader.email !== req.user.email.toLowerCase() ||
  leader.name.toLowerCase() !== normalizedName.toLowerCase()
) {
  return res.status(400).json({
    success: false,
    message: "The first team member must be the registered team leader.",
  });
}

  const existingRegistration =
    await HackathonRegistration.findOne({
      userId: req.user._id,
    });

  if (existingRegistration) {
    return res.status(409).json({
      success: false,
      message: "You have already registered for this hackathon.",
    });
  }

  const registration = await HackathonRegistration.create({
    userId: req.user._id,
    fullName: normalizedName,
    email: req.user.email,
    mobileNumber: normalizedMobile,
    collegeName: normalizedCollege,
    course: String(course).trim(),
    branch: String(branch).trim(),
    yearOfStudy: String(yearOfStudy).trim(),
    domain: String(domain).trim(),
    projectName: normalizedProject,
    pptLink: normalizedPptLink,
    prototypeLink: normalizedPrototypeLink,
    demoVideoLink: normalizedDemoLink,
    teamSize: parsedTeamSize,
    teamMembers: normalizedMembers,
  });

  // Send confirmation to all unique team email addresses.
  const uniqueRecipients = [
    ...new Set([
      registration.email,
      ...registration.teamMembers.map((member) => member.email),
    ]),
  ];

  let emailSent = false;

  try {
    const emailResult = await sendEmail({
      to: uniqueRecipients[0],
      bcc: uniqueRecipients.slice(1),
      subject: "Code-a-Nova | Registration Confirmation",
      html: registrationEmailTemplate(registration),
    });

    const accepted = (emailResult.accepted || []).map((item) =>
      String(item).toLowerCase()
    );

    emailSent = uniqueRecipients.every((recipient) =>
      accepted.includes(recipient)
    );

    if (!emailSent) {
      console.error("Some registration confirmation emails were not accepted.");
    }
  } catch (error) {
    console.error("Confirmation email failed:", error.message);
  }

  return res.status(201).json({
    success: true,
    message: emailSent
      ? "Hackathon registration successful. Confirmation emails sent."
      : "Registration saved, but some confirmation emails could not be sent.",
    data: {
      registration,
      emailSent,
    },
  });
});

// GET /api/hackathon/myentry
export const getMyEntry = asyncHandler(async (req, res) => {
  const registration = await HackathonRegistration.findOne({
    userId: req.user._id,
  });

  res.status(200).json({
    success: true,
    data: {
      registration,
    },
  });
});

// DELETE /api/hackathon/:id
export const deleteRegistration = asyncHandler(async (req, res) => {
  const registration = await HackathonRegistration.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!registration) {
    return res.status(404).json({
      success: false,
      message: "Registration not found.",
    });
  }

  await registration.deleteOne();

  res.status(200).json({
    success: true,
    message: "Registration deleted successfully.",
  });
});
