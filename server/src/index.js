import env from "./config/env.js";
import app from "./app.js";
import connectDB from "./config/db.js";
import transporter from "./config/email.js";

const PORT = env.PORT;

// Fire-and-forget: verifies in background, never blocks or crashes startup
const verifyEmailTransporter = () => {
  transporter
    .verify()
    .then(() => console.log("Email transporter verified successfully."))
    .catch((error) =>
      console.error("Email transporter verification failed:", error.message),
    );
};

const startServer = async () => {
  try {
    await connectDB();

    verifyEmailTransporter();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Error starting server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
