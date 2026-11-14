// Escape user-provided values before inserting them into HTML.
const escapeHtml = (value = "") => {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
};

const emailLayout = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Code-a-Nova</title>
</head>

<body style="
  margin: 0;
  padding: 30px 15px;
  background: #0B1020;
  font-family: Arial, sans-serif;
  color: #F8FAFC;
">
  <div style="
    max-width: 560px;
    margin: auto;
    padding: 35px;
    background: #151D33;
    border: 1px solid #293550;
    border-radius: 16px;
  ">
    <h1 style="color: #A5B4FC;">
      Code-a-Nova
    </h1>

    ${content}

    <hr style="border: 1px solid #293550; margin-top: 30px;" />

    <p style="color: #94A3B8; font-size: 12px;">
      Code-a-Nova Hackathon Team
    </p>
  </div>
</body>
</html>
`;

export const otpEmailTemplate = (otp) => {
  return emailLayout(`
    <h2>Email Verification</h2>

    <p>
      Use the following OTP to verify your email address.
    </p>

    <h1 style="
      letter-spacing: 10px;
      text-align: center;
      color: #A5F3FC;
      background: #0B1020;
      padding: 20px;
      border-radius: 10px;
    ">
      ${escapeHtml(otp)}
    </h1>

    <p>
      This OTP expires in <strong>10 minutes</strong>.
    </p>

    <p>
      Do not share this code with anyone.
    </p>
  `);
};

export const registrationEmailTemplate = (registration) => {
  const members = registration.teamMembers
    .map(
      (member, index) => `
        <li>
          ${index + 1}. ${escapeHtml(member.name)}
          (${escapeHtml(member.email)})
        </li>
      `
    )
    .join("");

  return emailLayout(`
    <h2>Registration Confirmed!</h2>

    <p>
      Hello ${escapeHtml(registration.fullName)},
    </p>

    <p>
      Your Code-a-Nova hackathon registration was successful.
    </p>

    <h3>Registration Details</h3>

    <p><strong>Event:</strong> Code-a-Nova Hackathon</p>

    <p>
      <strong>Project:</strong>
      ${escapeHtml(registration.projectName)}
    </p>

    <p>
      <strong>Domain:</strong>
      ${escapeHtml(registration.domain)}
    </p>

    <p>
      <strong>Team Size:</strong>
      ${escapeHtml(registration.teamSize)}
    </p>

    <h3>Team Members</h3>

    <ul>${members}</ul>

    <p>Thank you for registering!</p>
  `);
};