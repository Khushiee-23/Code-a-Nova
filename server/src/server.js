import "dotenv/config";

import app from "./app.js";
import connectDatabase from "./config/db.js";
import transporter from "./config/mailer.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    const requiredVariables = [
      "MONGO_URI",
      "JWT_SECRET",
      "EMAIL_USER",
      "EMAIL_PASS",
      "CLIENT_URL",
    ];

    const missingVariables = requiredVariables.filter(
      (variable) => !process.env[variable]
    );

    if (missingVariables.length > 0) {
      throw new Error(
        `Missing environment variables: ${missingVariables.join(", ")}`
      );
    }

    if (process.env.JWT_SECRET.length < 32) {
      throw new Error(
        "JWT_SECRET must contain at least 32 characters."
      );
    }

    await connectDatabase();
    await transporter.verify();

    app.listen(PORT, "0.0.0.0", () => {
  console.log(`Code-a-Nova server running on port $DIL0`);
});

  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();