
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({
  to,
  cc,
  bcc,
  subject,
  html,
}) => {
  const { data, error } = await resend.emails.send({
    from: "Code-a-Nova <onboarding@resend.dev>",
    to,
    ...(cc ? { cc } : {}),
    ...(bcc ? { bcc } : {}),
    subject,
    html,
  });

  if (error) {
    throw new Error(`Email sending failed: ${error.message}`);
  }

  return data;
};

export default resend;
