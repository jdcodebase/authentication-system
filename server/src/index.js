import env from "./config/env.js";
import app from "./app.js";
import connectDB from "./config/db.js";
import transporter from "./config/email.js";

const PORT = env.PORT;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    transporter
      .verify()
      .then(() => console.log("Email service is ready."))
      .catch((emailError) =>
        console.warn(`Email service unavailable: ${emailError.message}`),
      );
  } catch (error) {
    console.error(`Error starting server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
