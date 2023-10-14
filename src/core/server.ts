import * as dotenv from "dotenv";
import app from "./app";

dotenv.config();
const port = process.env.PORT || 5002;

const server = app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});

// Handle unhandled rejection errors
process.on("unhandledRejection", (error: Error) => {
  console.error(`Unhandled Rejection Error >>> ${error.name} >>> ${error.message}`);
  server.close(() => {
    console.error("Shutting down ... ");
    process.exit(1);
  });
});
