
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async ({
  to,
  cc,
  bcc,
  subject,
  html,
}) => {
  return transporter.sendMail({
    from: `"Code-a-Nova" <${process.env.EMAIL_USER}>`,
    to,
    ...(cc ? { cc } : {}),
    ...(bcc ? { bcc } : {}),
    subject,
    html,
  });
};

export default transporter;
